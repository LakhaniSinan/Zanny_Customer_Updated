import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../../../components/header';
import Button from '../../../components/button';
import styles from './style';
import {width} from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from './../../../constants/index';
import CartImage from '../../../components/cartImage';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {setCartData} from '../../../redux/slices/Cart';
import {useFocusEffect} from '@react-navigation/native';

const deliveryData = {
  image: 'https://images.deliveryhero.io/image/fd-pk/LH/dbi9-hero.jpg',
  time: 30,
};
const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  let cartData = useSelector(state => state.CartSlice.cartData);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});
  // console.log(cartData, 'cart datat');
  const getData = async () => {
    try {
      let data = await AsyncStorage.getItem('cartData');
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      data = JSON.parse(data);
      setUser(user);
      setCart(data);
      // dispatch(setCartData(data));
    } catch (error) {}
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  const onDecreasePress = index => {
    let tempArr = [...cart];

    if (tempArr[index].selectedQty <= 1) {
      Alert.alert('Error', 'Quantity cannot be less than 1');
      return;
    }

    tempArr[index].selectedQty = tempArr[index].selectedQty - 1;
    setCart(tempArr);
    AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
  };

  const onIncreasePress = index => {
    let tempArr = [...cart];
    console.log(tempArr[index].selectedQty, 'increaseeee');
    tempArr[index].selectedQty = tempArr[index].selectedQty + 1;
    setCart(tempArr);
    // dispatch(setCartData(tempArr));
    AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
  };

  const handleRemoveItem = index => {
    let tempArr = [...cart];
    let newVal = tempArr.splice(index, 1);
    setCart(tempArr);
    dispatch(setCartData(tempArr));
    AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
  };

  const renderTotal = () => {
    cartData.map(item => {
      let total = total + item.selectedQty * item.price;
    });
    setTotal(total);
  };

  const handleNextClick = () => {
    console.log(user, 'USERSS');
    dispatch(setCartData(cart));
    navigation.navigate('Checkout');
  };

  let total = 0;
  // console.log(cart,"Asdkasdjasjlsad")

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header text="Cart" goBack={true} />
      {cart && cart.length > 0 ? (
        <>
          <ScrollView>
            <View>
              {cart.map((val, ind) => {
                let value = val.discount > 0 ? val.discount : val.price;
                total = total + val.selectedQty * value;
                return (
                  <View style={styles.cardview} key={ind}>
                    <Entypo
                      name={'cross'}
                      size={24}
                      color={'black'}
                      onPress={() => handleRemoveItem(ind)}
                      style={{position: 'absolute', top: 2, right: 3}}
                    />
                    <View style={styles.innerview}>
                      <CartImage
                        imageUrl={val.image}
                        imgContainer={styles.imgview}
                        imgStyle={styles.img}
                      />
                      <View style={styles.txtview}>
                        <View style={styles.nameview}>
                          <Text style={styles.txtname}>{val.name}</Text>
                          <Text style={styles.txtstyle}>
                            £ {val.discount > 0 ? val.discount : val.price}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: width(3),
                          }}>
                          <TouchableOpacity
                            onPress={() => onDecreasePress(ind)}>
                            <View
                              style={{
                                width: width(10),
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: width(4),
                                backgroundColor: colors.orangeColor,
                                height: width(10),
                              }}>
                              <Text style={{color: 'white', fontSize: 20}}>
                                -
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontWeight: '600',
                            }}>
                            {val.selectedQty}
                          </Text>
                          <TouchableOpacity
                            onPress={() => onIncreasePress(ind)}>
                            <View
                              style={{
                                width: width(10),
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: width(4),
                                backgroundColor: colors.orangeColor,
                                height: width(10),
                              }}
                              colors={colors.themeColor}>
                              <Text style={{color: 'white', fontSize: 20}}>
                                +
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        {/* <Text style={styles.quantity}> Qty : {selectedQty}</Text> */}
                      </View>
                    </View>
                    <Text style={styles.txtdate}>{val.description}</Text>
                  </View>
                );
              })}
              <View style={{marginHorizontal: width(4)}}>
                <View style={styles.subtotal}>
                  <Text style={styles.subtotalText}>Sub Total</Text>
                  <Text style={styles.subtotalPrice}>£{total}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: width(4),
                justifyContent: 'flex-end',
                flex: 1,
              }}>
              <View style={styles.total}>
                <Text style={styles.subtotalText}>Total</Text>
                <Text style={styles.subtotalPrice}>£{total}</Text>
              </View>
            </View>
          </ScrollView>
          <View style={{marginBottom: width(2)}}>
            <Button
              heading="Next"
              color={colors.pinkColor}
              onPress={handleNextClick}
            />
          </View>
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: width(2),
              color: 'black',
              textAlign: 'center',
            }}>
            No Items in Cart
          </Text>
          <Button
            onPress={() => navigation.navigate('AllRestaurants')}
            heading={'Buy Now'}
            color={colors.pinkColor}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
