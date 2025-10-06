import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {height, width} from 'react-native-dimension';
import styles from './style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {FlatList} from 'react-native-gesture-handler';
import {Rating, AirbnbRating} from 'react-native-ratings';
// import {getProductsById} from '../../../../services/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonModal from './../../../components/modal/index';
import CartModal from './cartModal';
import {colors} from './../../../constants/index';
import {getProductsByMerchantId} from '../../../services/product';
import OverLayLoader from '../../../components/loader';
import {setMerchantDetail} from '../../../redux/slices/Merchant';
import {setCartData} from '../../../redux/slices/Cart';
import {useSelector, useDispatch} from 'react-redux';
import {addSubscribers, removeSubscribers} from '../../../services/merchant';
import {color} from 'react-native-reanimated';
import {getMerchantProfile} from '../../../services/merchant';

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hours ${String(remainingMinutes).padStart(2, '0')} min`;
  } else if (hours > 0) {
    return `${hours}:00 hours`;
  } else {
    return `00:${String(remainingMinutes).padStart(2, '0')} min`;
  }
}

const Products = ({route, navigation}) => {
  const dispatch = useDispatch();
  let ref = useRef();
  const user = useSelector(state => state.LoginSlice.user);
  let cartData = useSelector(state => state.CartSlice.cartData);
  const [productsList, setProductsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [details, setDetails] = useState({});
  const [imageLoading, setImageLoading] = useState(true);
  let restId = route.params.details._id;
  // console.log(details,"myresttttttt");

  useEffect(() => {
    setIsVisible(true);
    getProductsByMerchantId(restId)
      .then(res => {
        setIsVisible(false);
        setProductsList(res.data.data);
      })
      .catch(err => {
        setIsVisible(false);
      });
  }, []);

  useEffect(() => {
    getMerchantDetials();
  }, []);

  const getMerchantDetials = () => {
    setIsVisible(true);
    getMerchantProfile(restId)
      .then(response => {
        if (response?.data?.status == 'ok') {
          let data = response?.data?.data;
          setDetails(data);
          setIsVisible(false);
        } else {
          setIsVisible(false);
        }
      })
      .catch(error => {
        console.log(error, 'errrorr');
        setIsVisible(false);
      });
  };
  const ratingCompleted = rating => {};

  const navigateToRatings = () => {
    navigation.navigate('Ratings', {data: details});
  };

  const handleIncrease = () => {
    let item = {...selectedItem};
    item['selectedQty'] = item['selectedQty'] + 1;
    setSelectedItem(item);
  };

  const handleDecrease = () => {
    if (selectedItem.selectedQty < 2) {
      Alert.alert('Selected quantity cannot be less than 1');
    } else {
      let item = {...selectedItem};
      item['selectedQty'] = item['selectedQty'] - 1;
      setSelectedItem(item);
    }
  };

  // console.log(cartData,"datatat");

  const handleAddToCart = async () => {
    if (user) {
      let tempArr = [...cartData];
      // console.log(tempArr,"indexxx");
      let findIndex = tempArr.findIndex(item => item._id == selectedItem._id);
      if (cartData.length < 1) {
        if (findIndex != -1) {
          tempArr[findIndex].selectedQty =
            tempArr[findIndex].selectedQty + selectedItem.selectedQty;
          console.log('if chala====');
          dispatch(setCartData(tempArr));
          alert('Item added to cart successfully');
          AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
          AsyncStorage.setItem('merchantDetails', JSON.stringify(details));
          dispatch(setMerchantDetail(details));
        } else {
          dispatch(setCartData([...cartData, selectedItem]));
          AsyncStorage.setItem(
            'cartData',
            JSON.stringify([...cartData, selectedItem]),
          );
          dispatch(setMerchantDetail(details));
          AsyncStorage.setItem('merchantDetails', JSON.stringify(details));
          alert('Item added to cart successfully');
          console.log('else chala');
        }
      } else if (
        cartData.length > 0 &&
        cartData[0].merchantId === selectedItem.merchantId
      ) {
        console.log(selectedItem.merchantId, 'item selecettd');
        console.log(cartData[0], 'cart selecettd');

        console.log('else if chala');
        if (findIndex != -1) {
          tempArr[findIndex].selectedQty = 10 + 10;
          dispatch(setCartData(tempArr));
          AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
          dispatch(setMerchantDetail(details));
          AsyncStorage.setItem('merchantDetails', JSON.stringify(details));
          console.log(tempArr[findIndex].selectedQty, 'kfhhfjhfjhjhf');
          alert(tempArr[findIndex].selectedQty);
        } else {
          console.log('else if ka elsechala');
          dispatch(setCartData([...cartData, selectedItem]));
          AsyncStorage.setItem(
            'cartData',
            JSON.stringify([...cartData, selectedItem]),
          );
          dispatch(setMerchantDetail(details));
          AsyncStorage.setItem('merchantDetails', JSON.stringify(details));
          alert('Item added to cart successfully');
        }
      } else {
        alert('You can only add items in cart from one restaurant at a time');
      }
      ref.current.hide();
    } else {
      Alert.alert('Alert', 'Please login first to add items in your cart', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            ref.current.hide();
            navigation.navigate('AuthStack');
          },
        },
      ]);
    }
  };

  const handlePressProduct = (item, index) => {
    item['selectedQty'] = 1;
    setSelectedItem(item);
    ref.current.isVisible({
      height: 90,
    });
  };

  const handleSubscribeButton = async () => {
    if (user) {
      let payload = {
        merchantId: restId,
        customerId: user._id,
      };
      addSubscribers(payload)
        .then(response => {
          if (response?.data?.status == 'ok') {
            alert(response?.data?.message);
            getMerchantDetials();
          } else {
            console.log(response?.data, 'error datatta===>');
          }
        })
        .catch(error => {
          console.log(error, 'erroro');
        });
    } else {
      alert('Please login first to subscribe this restaurant');
    }
  };

  const handleUnsubscribeButton = async () => {
    let payload = {
      merchantId: restId,
      customerId: user._id,
    };
    removeSubscribers(payload)
      .then(response => {
        if (response?.data?.status == 'ok') {
          alert(response?.data?.message);
          getMerchantDetials();
        } else {
          console.log(response?.data, 'error datatta===>');
        }
      })
      .catch(error => {
        console.log(error, 'erroro');
      });
  };

  // console.log(user._id,"my iddddd");
  // console.log(details?.subscribers[1],"subssssssssssss");

  const renderTotalItems = () => {
    let totalItems = 0;
    {
      cartData.length > 0 &&
        cartData.map(item => {
          totalItems = totalItems + item.selectedQty;
        });
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 13,
            color: 'white',
          }}>
          {totalItems} items
        </Text>
      </View>
    );
  };

  const renderTotalPrice = () => {
    let totalPrice = 0;
    {
      cartData.length > 0 &&
        cartData.map(item => {
          totalPrice =
            item.discount > 0
              ? totalPrice + item.discount * item.selectedQty
              : totalPrice + item.price * item.selectedQty;
        });
    }
    return (
      <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
        £ {totalPrice}
      </Text>
    );
  };

  const renderRating = () => {
    let count = 0;
    details?.reviews?.map(item => {
      count = count + item.rating;
    });
    let result = count / details?.reviews?.length;
    // console.log(result,"resultresult");
    if (isNaN(result)) {
      result = 0;
    }
    return (
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('Reviews', {data: details})}>
        <AirbnbRating
          defaultRating={details?.reviews?.length == 0 ? 5 : result}
          size={15}
          count={5}
          showRating={false}
          isDisabled
          selectedColor={colors.orangeColor}
        />
        <Text style={{color: colors.orangeColor}}>
          {' '}
          ({details?.reviews?.length})
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <OverLayLoader isloading={isVisible} />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <View>
            <Image
              style={{
                height: 200,
                width: width(100),
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              }}
              source={{
                uri: details?.merchantImage,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              borderRadius: 200,
              backgroundColor: 'white',
              padding: 10,
            }}>
            <AntDesign name="arrowleft" size={16} color={colors.yellow} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Reviews', {data:details})}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              borderRadius: 200,
              padding: 10,
            }}>
            <Entypo name={'info'} size={24} color={'white'} />
          </TouchableOpacity> */}
          {details?.subscribers?.includes(user?._id) ? (
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                borderRadius: 200,
                padding: 10,
                backgroundColor: colors.yellow,
              }}
              onPress={handleUnsubscribeButton}>
              <Text style={{color: colors.red, fontWeight: '600'}}>
                Unsubscribe
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                borderRadius: 200,
                padding: 10,
                backgroundColor: colors.yellow,
              }}
              onPress={handleSubscribeButton}>
              <Text style={{color: colors.red, fontWeight: '600'}}>
                subscribe
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              borderRadius: 200,
              padding: 10,
              backgroundColor: colors.yellow,
            }}
            onPress={() =>
              navigation.navigate('PrivateOrder', {
                details,
                productsList,
              })
            }>
            <Text style={{color: colors.red, fontWeight: '600'}}>
              Private Hire
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: width(2),
            marginHorizontal: width(3),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={styles.productname}>{details.name}</Text>
          </View>
          {renderRating()}
        </View>
        <View
          style={{
            borderTopWidth: 0.3,
            borderColor: '#a3a3a3',
            marginVertical: width(2),
          }}>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 10,
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Our Pickup Standard time
          </Text>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 10,
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {formatTime(details?.pickupTimmings)}
          </Text>
        </View>
        <View
          style={{
            borderTopWidth: 0.3,
            borderColor: '#a3a3a3',
            marginVertical: width(2),
          }}>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 10,
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Our Menu
          </Text>
        </View>
        <FlatList
          data={productsList}
          style={{marginBottom: width(3)}}
          renderItem={({item, index}) => {
            if (item.isShow) {
              let result = item.allergiesData.some(item =>
                user?.allergies.includes(item.name),
              );
              if (result) return null;
              else {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePressProduct(item, index)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        paddingVertical: width(3),
                        marginBottom: width(2),
                        shadowColor: 'black',
                        shadowOpacity: 0.1,
                        shadowOffset: {width: 0, height: 1},
                        shadowRadius: 30,
                        marginHorizontal: width(2),
                        borderRadius: 10,
                        borderBottomWidth: 1,
                        borderColor: '#a3a3a3',
                      }}>
                      <View style={{marginHorizontal: width(3), width: '60%'}}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>
                          {item.name}
                        </Text>
                        <Text style={{color: 'grey'}}>{item.description}</Text>
                        {item.discount > 0 ? (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'grey'}}>
                              £{item.discount}
                            </Text>
                            <Text
                              style={{
                                color: 'grey',
                                marginLeft: 10,
                                textDecorationLine: 'line-through',
                              }}>
                              £{item.price}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={{
                              color: 'grey',
                            }}>
                            £{item.price}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                          marginRight: 10,
                        }}>
                        <View style={{height: width(20), width: width(30)}}>
                          {imageLoading && (
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                              }}>
                              <ActivityIndicator
                                size="small"
                                color={colors.yellow}
                              />
                            </View>
                          )}
                          <Image
                            source={{uri: item.image}}
                            onLoadEnd={() => setImageLoading(false)}
                            resizeMode="stretch"
                            style={{
                              height: width(20),
                              borderRadius: 10,
                              width: width(30),
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }
            }
          }}
        />
        <View style={{justifyContent: 'flex-end'}}>
          {cartData.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <View
                style={{
                  backgroundColor: colors.yellow,
                  marginBottom: width(2),
                  marginHorizontal: width(3),
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    left: width(2),
                  }}>
                  {renderTotalItems()}
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    left: width(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: '500',
                      color: colors.white,
                      padding: width(3),
                    }}>
                    View Cart
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    flex: 1,
                    marginRight: width(4),
                  }}>
                  {renderTotalPrice()}
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <CommonModal ref={ref} type="products">
        <CartModal
          selectedItem={selectedItem}
          productsList={productsList}
          handleDecrease={handleDecrease}
          handleIncrease={handleIncrease}
          handleAddToCart={handleAddToCart}
        />
      </CommonModal>
    </>
  );
};

export default Products;
