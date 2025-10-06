import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  PlatformPay,
  StripeProvider,
  usePlatformPay,
} from '@stripe/stripe-react-native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { height, width } from 'react-native-dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/button';
import Header from '../../../components/header';
import OverLayLoader from '../../../components/loader';
import { setCartData } from '../../../redux/slices/Cart';
import { setMerchantDetail } from '../../../redux/slices/Merchant';
import { setOrderType } from '../../../redux/slices/OrderType';
import { STRIPE_PUBLISH_TEST, colors } from './../../../constants/index';
import { getAdminSettings } from './../../../services/adminSettings/index';
import {
  createStripeClientSecret,
  getCalculatedDeliveryFee,
  placeUserOrder,
} from './../../../services/order';
import OrderSummaryCard from './orderSumaryCard';
import styles from './style';

const Checkout = ({ navigation }) => {
  const [rideTip, setRideTip] = useState('0');
  const dispatch = useDispatch();
  const user = useSelector(state => state.LoginSlice.user);
  const { orderType } = useSelector(state => state.OrderType);
  const { paymentType } = useSelector(state => state.PaymentType);

  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );

  let merchantDetail = useSelector(state => state.MerchantSlice.merchantDetail);

  let cartData = useSelector(state => state.CartSlice.cartData);
  let location = useSelector(state => state.LocationSlice.currentLocation);
  const [orderBill, setOrderBill] = useState({
    subTotal: 0,
  });

  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [settingsData, setSettingsData] = useState(null);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay();

  useEffect(() => {
    getAdminSettings()
      .then(response => {
        setSettingsData(response.data.data);
      })
      .catch(errrr => { });
  }, []);

  useEffect(() => {
    (async function () {
      if (await isPlatformPaySupported()) {
        if (Platform.OS == 'android') {
          setIsGooglePaySupported(true);
          setIsApplePaySupported(false);
        } else {
          setIsGooglePaySupported(false);
          setIsApplePaySupported(true);
        }
      }
    })();
  }, [isPlatformPaySupported]);

  const onChangeText = text => {
    setRideTip(text);
  };

  useFocusEffect(
    React.useCallback(() => {
      handleCalculateTotal();
      handelgetDeliveryCharges();
    }, []),
  );

  const handleCalculateTotal = async () => {
    let merchant = await AsyncStorage.getItem('merchantDetails');
    merchant = JSON.parse(merchant);
    dispatch(setMerchantDetail(merchant));
    let discount = 0;
    let total = 0;
    let updatedTotal = 0;

    if (cartData.length > 0) {
      cartData.map(item => {
        let value = item.discount > 0 ? item.discount : item.price;
        total += value * item.selectedQty;
      });
      if (total) {
        const numericTotal = Number(total.toFixed(2) * 0.05);
        console.log(numericTotal, 'numericTotalnumericTotal');

        if (numericTotal > 4.5) {
          updatedTotal = 4.5;
        } else if (Number(numericTotal) < Number(0.99)) {
          updatedTotal = 0.99;
        } else {
          updatedTotal = numericTotal;
        }
        setServiceCharges(updatedTotal);
      }

      setOrderBill({
        ...orderBill,
        subTotal: total,
        discount: discount,
      });
    }
  };

  const handleOrderNow = async () => {
    let totalAmount =
      Number(orderBill.subTotal) -
      Number(discountedTotal) +
      Number(deliveryCharges) +
      Number(serviceCharges);
    let userData = {
      email: user.email,
      image: user.customerImage,
      name: user.name,
      phone: user.phoneNumber,
    };
    let payload = {
      order: cartData,
      tip: rideTip ? Number(rideTip) : 0,
      userId: user._id,
      serviceCharges: settingsData?.serviceCharges,
      address: location?.address,
      subTotal: orderBill.subTotal,
      totalBill: totalAmount,
      discount: orderBill.discount,
      date: moment(new Date()).format('DD-MM-YYYY'),
      merchantId: cartData[0]?.merchantId,
      latitude: location?.latitude ? location?.latitude : 0,
      longitude: location?.longitude ? location?.longitude : 0,
      userDetails: userData,
      deliveryCharges: deliveryCharges,
      msgToMerchant: 'testing note',
      merchantDetails: merchantDetail,
      pickupTimmings: merchantDetail?.pickupTimmings,
      userCardDetails: wallet,
      orderType: orderType,
      paymentType: paymentType,
    };

    console.log(payload, 'payloadpayload');
    setIsLoading(true);

    if (paymentType !== 'COD') {
      if (wallet == null) {
        alert('Please Select Any Payment Method');
      } else if (wallet.cardNo == 'Google Pay') {
        payWithGoogle(payload);
      } else if (wallet.cardNo == 'Apple Pay') {
        payWithApple(payload);
      } else {
        payload['expMonth'] = wallet?.expiryMonth;
        payload['expYear'] = wallet?.expiryYear;
        payload['number'] = wallet?.cardNo;
        placeUserOrder(payload)
          .then(res => {
            setIsLoading(false);
            if (res.status != 200) {
              alert(res.data.message);
              dispatch(setOrderType(''));
            } else {
              alert(res.data.message);
              dispatch(setCartData([]));
              AsyncStorage.setItem('cartData', JSON.stringify([]));
              navigation.navigate('AllRestaurants');
            }
          })
          .catch(err => {
            setIsLoading(false);
            alert(err?.response?.data?.message);
          });
      }
    } else {
      placeUserOrder(payload)
        .then(res => {
          setIsLoading(false);
          if (res.status != 200) {
            alert(res.data.message);
            dispatch(setOrderType(''));
          } else {
            alert(res.data.message);
            dispatch(setCartData([]));
            AsyncStorage.setItem('cartData', JSON.stringify([]));
            navigation.navigate('AllRestaurants');
          }
        })
        .catch(err => {
          setIsLoading(false);
          alert(err?.response?.data?.message);
        });
    }
  };

  const showAlert = () =>
    Alert.alert(
      'Please Confirm',
      'Are you sure you want to place your order on the given date and time?',
      [
        {
          text: 'Confirm',
          onPress: () => Alert.alert('Order placed successfully'),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      },
    );

  let discountedTotal = (orderBill.subTotal * orderBill.discount) / 100;

  const handelgetDeliveryCharges = async () => {
    let payload = {
      restlat: merchantDetail?.latitude,
      restlong: merchantDetail?.longitude,
      userlat: location?.latitude,
      userlong: location?.longitude,
    };
    setIsLoading(true);
    getCalculatedDeliveryFee(payload)
      .then(res => {
        setIsLoading(false);
        if (res.data.status == 'ok') {
          let data = res?.data?.data;
          setDeliveryCharges(orderType != 'pickup' ? data.toFixed(2) : 0);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error calculation');
      });
  };

  const payWithGoogle = async orderPayload => {
    let payload = {
      amount:
        orderBill.subTotal + deliveryCharges + settingsData?.serviceCharges,
    };
    createStripeClientSecret(payload)
      .then(async ressss => {
        let clientSecret = ressss.data.secretKey;
        const { error } = await confirmPlatformPayPayment(clientSecret, {
          googlePay: {
            testEnv: true,
            merchantName: 'My merchant name',
            merchantCountryCode: 'GB',
            currencyCode: 'GBP',
            billingAddressConfig: {
              format: PlatformPay.BillingAddressFormat.Full,
              isPhoneNumberRequired: true,
              isRequired: true,
            },
          },
        });

        if (error) {
          console.log(error, 'ERRRRRRRRRR');
          return error.message;
        } else {
          setIsLoading(true);
          placeUserOrder(orderPayload)
            .then(res => {
              setIsLoading(false);
              if (res.status != 200) {
                alert(res.data.message);
              } else {
                alert(res.data.message);
                dispatch(setCartData([]));
                AsyncStorage.setItem('cartData', JSON.stringify([]));
                navigation.navigate('AllRestaurants');
              }
            })
            .catch(err => {
              setIsLoading(false);
              alert(err?.response?.data?.message);
            });
        }
      })
      .catch(errr => { setIsLoading(false); });
  };

  const payWithApple = async orderPayload => {
    let payload = {
      amount: orderBill.subTotal + deliveryCharges,
    };

    let passedAmount = orderBill.subTotal + deliveryCharges;
    createStripeClientSecret(payload).then(async ressss => {
      setIsLoading(false);
      let clientSecret = ressss.data.secretKey;
      const { error } = await confirmPlatformPayPayment(clientSecret, {
        applePay: {
          cartItems: [
            {
              label: 'to Zannys Foods',
              amount: passedAmount.toString(),
              paymentType: PlatformPay.PaymentType.Immediate,
            },
          ],
          merchantCountryCode: 'GB',
          currencyCode: 'GBP',
          requiredShippingAddressFields: [
            PlatformPay.ContactField.PostalAddress,
          ],
          requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
        },
      });
      if (error) {
        setIsLoading(false);
        console.log(error, 'Errr');
      } else {
        setIsLoading(true);
        placeUserOrder(orderPayload)
          .then(res => {
            if (res.status != 200) {
              alert(res.data.message);
              setIsLoading(false);
            } else {
              setIsLoading(false);
              alert(res.data.message);
              dispatch(setCartData([]));
              AsyncStorage.setItem('cartData', JSON.stringify([]));
              navigation.navigate('AllRestaurants');
            }
          })
          .catch(err => {
            setIsLoading(false);
            alert(err?.response?.data?.message);
          });
      }
    });
  };

  return (
    <>
      <OverLayLoader isloading={isLoading} />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StripeProvider
          publishableKey={STRIPE_PUBLISH_TEST}
          merchantIdentifier="merchant.com.zannycustomer">
          <Header text="Checkout" goBack={true} />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            automaticallyAdjustKeyboardInsets={true}>
            {orderType !== 'pickup' && (
              <View
                style={{
                  marginHorizontal: width(3),
                  borderRadius: 10,
                  marginTop: height(2),
                  marginBottom: width(2),
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  shadowRadius: 30,
                }}>
                <View
                  style={{
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View>
                    <EvilIcons
                      style={{}}
                      name="location"
                      color={colors.yellow}
                      size={22}
                    />
                  </View>

                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      marginLeft: 5,
                      fontWeight: '600',
                      marginVertical: width(2),
                    }}>
                    Delivery address
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <AntDesign
                      style={{}}
                      name="edit"
                      color={colors.yellow}
                      size={22}
                      onPress={() =>
                        navigation.navigate('Address', {
                          type: 'checkout',
                          location,
                        })
                      }
                    />
                  </View>
                </View>

                <View
                  style={{
                    marginHorizontal: width(5),
                    marginBottom: width(2),
                  }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: 'black',
                    }}>
                    {location?.address}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.container}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: width(3),
                  marginVertical: width(3),
                }}>
                <AntDesign name="wallet" color={colors.yellow} size={22} />
                <Text style={styles.heading}>Payment Method</Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <AntDesign
                    style={{}}
                    name="edit"
                    color={colors.yellow}
                    size={22}
                    onPress={() =>
                      navigation.navigate('PaymentOptions', {
                        isGooglePaySupported,
                        isApplePaySupported,
                      })
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginVertical: width(3),
                  marginHorizontal: width(3),
                }}>
                <AntDesign
                  name="creditcard"
                  color={colors.yellow}
                  size={22}
                  onPress={() => navigation.navigate('Addresses')}
                />
                {paymentType !== 'COD' ? (
                  <>
                    {wallet?.cardNo == 'Google Pay' ||
                      wallet?.cardNo == 'Apple Pay' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: colors.black,
                        }}>
                        {wallet?.cardNo}
                      </Text>
                    ) : wallet?.cardNo ? (
                      <Text
                        style={{
                          ...styles.heading,
                          letterSpacing: 3,
                          color: colors.black,
                        }}>
                        {'****' + wallet?.cardNo.toString().slice(12, 16)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: colors.black,
                        }}>
                        Please select payment Option
                      </Text>
                    )}
                  </>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginVertical: width(3),
                      marginHorizontal: width(3),
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.black,
                      }}>
                      {paymentType}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ marginTop: width(4) }}>
              <OrderSummaryCard
                orderType={orderType}
                orderBill={orderBill}
                charges={deliveryCharges}
                serviceCharges={serviceCharges}
              />
            </View>
            {orderType != 'pickup' && (
              <View>
                <Text
                  style={{
                    color: '#000',
                    paddingVertical: width(4),
                    marginHorizontal: width(6),
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Do you want to give a tip to your rider?
                </Text>
                <View
                  style={{
                    marginHorizontal: width(4),
                  }}>
                  <TextInput
                    value={rideTip}
                    onChangeText={onChangeText}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    placeholder="Rider Tip"
                    onSubmitEditing={Keyboard.dismiss}
                    style={{
                      elevation: 1,
                      borderRadius: width(4),
                      backgroundColor: '#FFF',
                      borderWidth: 1,
                      paddingHorizontal: width(5),
                      height: width(10),
                    }}
                  />
                </View>
              </View>
            )}

            <View>
              <View
                style={{
                  marginVertical: width(4),
                  marginHorizontal: width(4),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>
                  Total
                </Text>
                <Text
                  style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                  £
                  {Number(orderBill.subTotal) +
                    Number(deliveryCharges) +
                    Number(serviceCharges) +
                    Number(rideTip)}
                </Text>
              </View>
              <Button
                onPress={handleOrderNow}
                heading="Order Now"
                color={colors.yellow}
              />
            </View>
          </ScrollView>
        </StripeProvider>
      </SafeAreaView>
    </>
  );
};

export default Checkout;
