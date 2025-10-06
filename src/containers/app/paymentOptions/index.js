import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Apple from '../../../assets/images/apple.png';
import Header from '../../../components/header';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {setCurrentPaymentCard} from '../../../redux/slices/paymentCard';
import {setPaymentType} from '../../../redux/slices/PaymentType';
import {getPaymentCardById} from '../../../services/paymentCard';
import styles from './style';

const PaymentOptions = ({
  navigation,
  route,
  isGooglePaySupported,
  isApplePaySupported,
}) => {
  console.log(route.params, 'SS');
  const dispatch = useDispatch();
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );

  const [paymentCards, setPaymentCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getUserPaymentCards();
    }, []),
  );

  const getUserPaymentCards = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getPaymentCardById(data._id)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          let cards = response?.data?.data;
          let Arr = [];
          cards.map((item, index) => {
            if (wallet !== null && item._id == wallet._id) {
              Arr.push({...item, isSelected: true});
            } else {
              Arr.push({...item, isSelected: false});
            }
          });
          setPaymentCards(Arr);
        } else {
          console.log(response?.data, 'negative resss');
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error');
      });
  };

  const handleCODSelection = () => {
    dispatch(setPaymentType('COD'));
    AsyncStorage.setItem('paymentType', JSON.stringify('COD'));
    alert('Cash on Delivery Selected');
    navigation.goBack();
  };

  const handleOnPressRadioBtn = (item, index) => {
    paymentCards[index].isSelected = !paymentCards[index].isSelected;
    AsyncStorage.setItem('paymentCard', JSON.stringify(item));
    dispatch(setCurrentPaymentCard(item));
    dispatch(setPaymentType('Card'));
    AsyncStorage.setItem('paymentType', JSON.stringify('Card'));
    navigation.goBack();
    alert('Card Selected Successfully');
  };
  const {orderType} = useSelector(state => state.OrderType);
  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="Payment Options" goBack={true} />

        {orderType == 'delivery' && (
          <>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: width(4),
                marginHorizontal: width(2),
              }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleCODSelection}
                style={{
                  width: width(88),
                  paddingHorizontal: width(3),
                  paddingVertical: width(4),
                  borderRadius: 8,
                  elevation: 5,
                  justifyContent: 'center',
                  marginRight: width(2),
                  backgroundColor: colors.orangeColor,
                }}>
                <Text style={styles.textStyle}>Cash On Delivery</Text>
              </TouchableOpacity>
              <View style={{borderWidth: 0.5, borderRadius: 50, padding: 4}}>
                <TouchableOpacity
                  style={{
                    height: width(3),
                    width: width(3),
                    borderRadius: 50,
                  }}></TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                color: colors.black,
                paddingHorizontal: width(5),
                marginVertical: width(4),
              }}>
              OR
            </Text>
          </>
        )}
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: width(4),
            marginHorizontal: width(2),
            justifyContent: 'space-between',
          }}
          onPress={() =>
            navigation.navigate('AddEditPaymentCard', {
              type: 'add',
            })
          }>
          <View style={styles.subView}>
            <Text style={{color: colors.black}}>Add Credit or Debit Card</Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={15}
            color={colors.black}
          />
        </TouchableOpacity>
        {paymentCards.length > 0 ? (
          paymentCards.map((item, index) => {
            return (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: width(2),
                  marginHorizontal: width(2),
                }}
                key={index}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    width: width(88),
                    borderRadius: 8,
                    elevation: 5,
                    marginRight: width(2),
                    backgroundColor: colors.orangeColor,
                  }}
                  onPress={() =>
                    navigation.navigate('AddEditPaymentCard', {
                      type: 'edit',
                      detail: item,
                    })
                  }>
                  <View style={styles.subView}>
                    <Text style={styles.textStyle}>{item?.cardName}</Text>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.cardNo}>
                      {'\u2022'}
                      {'\u2022'}
                      {'\u2022'}
                      {'\u2022'}
                      {item?.cardNo.toString().slice(12, 16)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOnPressRadioBtn(item, index)}
                  style={{borderWidth: 0.5, borderRadius: 50, padding: 4}}>
                  <TouchableOpacity
                    style={{
                      height: width(3),
                      width: width(3),
                      borderRadius: 50,
                      backgroundColor: item?.isSelected ? colors.yellow : '',
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          })
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
              No payment cards found
            </Text>
          </View>
        )}

        {route?.params?.isApplePaySupported && (
          <TouchableOpacity
            onPress={() => {
              dispatch(
                setCurrentPaymentCard({
                  cardNo: 'Apple Pay',
                }),
              );
              navigation.goBack();
            }}
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: width(4),
              marginHorizontal: width(2),
              justifyContent: 'space-between',
            }}>
            <View style={styles.subView}>
              <Image
                source={Apple}
                style={{
                  width: width(10),
                  height: width(10),
                  marginRight: width(2),
                }}
                resizeMode="contain"
              />
              <Text style={{color: colors.black}}>Pay with Apple</Text>
            </View>

            <View
              style={{
                height: width(5),
                width: width(5),
                borderColor: colors.yellow,
                borderWidth: 0.5,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

export default PaymentOptions;
