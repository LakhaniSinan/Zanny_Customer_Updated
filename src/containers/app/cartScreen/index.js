import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {usePlatformPay} from '@stripe/stripe-react-native';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, FlatList, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import ActionBuuton from '../../../components/actionButton';
import CartCard from '../../../components/cartCard';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {setCartData} from '../../../redux/slices/Cart';
import {getAdminSettings} from '../../../services/adminSettings';
import {
  createStripeClientSecret,
  getCalculatedDeliveryFee,
  placeUserOrder,
} from '../../../services/order';
import {getMerchantProfile} from '../../../services/merchant';

const parsePriceToNumber = price => {
  const numeric = String(price ?? '').replace(/[^0-9.]/g, '');
  return Number(parseFloat(numeric)) || 0;
};

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [settingsData, setSettingsData] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [details, setDetails] = useState(0);
  const cartData = useSelector(s => s.CartSlice.cartData) || [];
  const addresses = useSelector(s => s.AddressSlice.address) || [];
  const {user} = useSelector(s => s.LoginSlice);
  const location = useSelector(s => s.LocationSlice.currentLocation);
  console.log(details, 'merchantmerchantmerchantmerchantmerchant');

  const wallet = useSelector(s => s.PaymentCardSlice.currentPaymentCard);
  const {isPlatformPaySupported, confirmPlatformPayPayment} = usePlatformPay();
  const {address} = useSelector(state => state.AddressSlice);
  const selectedAddress = address[0];

  const addressLine =
    addresses?.[0]?.address || addresses?.[0]?.full_address || 'No address';
  const {subTotal, total} = useMemo(() => {
    const st = cartData.reduce((acc, item) => {
      return acc + parsePriceToNumber(item?.price) * (item?.quantity ?? 1);
    }, 0);
    return {
      subTotal: st,
      total: st + Number(deliveryCharges) + Number(serviceCharges),
    };
  }, [cartData, deliveryCharges, serviceCharges]);

  useEffect(() => {
    setLoading(true);
    getAdminSettings()
      .then(res => {
        setSettingsData(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    getMerchantDetials();
  }, []);

  useEffect(() => {
    (async () => {
      await isPlatformPaySupported();
    })();
  }, []);

  const getMerchantDetials = () => {
    let restId = cartData[0]?.merchantId;
    setLoading(true);
    getMerchantProfile(restId)
      .then(response => {
        if (response?.data?.status == 'ok') {
          let data = response?.data?.data;
          setDetails(data);
        } else {
        }
      })
      .catch(error => {
        console.log(error, 'errrorr');
        setLoading(false);
      });
  };

  const fetchDeliveryCharges = async () => {
    if (!details || !address?.length > 0) return;

    setLoading(true);
    const payload = {
      restlat: details.latitude,
      restlong: details.longitude,
      userlat: selectedAddress.latitude,
      userlong: selectedAddress.longitude,
    };

    console.log(payload, 'payloadpayloadpayloadpayload');

    getCalculatedDeliveryFee(payload)
      .then(res => {
        console.log(res, 'resresresresres');

        if (res.data.status === 'ok') {
          setDeliveryCharges(Number(res.data.data.toFixed(2)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const calculateServiceCharges = () => {
    if (cartData.length === 0) return;

    let total = 0;
    cartData.forEach(item => {
      const value = item.discount > 0 ? item.discount : item.price;
      total += value * (item.selectedQty || 1);
    });

    const fee = Number((total * 0.05).toFixed(2));
    const updated = fee > 4.5 ? 4.5 : fee < 0.99 ? 0.99 : fee;

    setServiceCharges(updated);
  };

  useFocusEffect(
    useCallback(() => {
      calculateServiceCharges();
      fetchDeliveryCharges();
    }, [address?.length > 0, details, cartData]),
  );

  const handleOrderNow = async () => {
    if (!wallet) {
      return Alert.alert('Please select a payment method');
    }

    const payload = {
      order: cartData,
      tip: 0,
      userId: user._id,
      serviceCharges,
      address: location?.address,
      subTotal,
      deliveryCharges,
      totalBill: total,
      discount: 0,
      date: moment(new Date()).format('DD-MM-YYYY'),
      merchantId: cartData[0]?.merchantId,
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      userDetails: {
        email: user.email,
        name: user.name,
        phone: user.phoneNumber,
        image: user.customerImage,
      },
      merchantDetails: details,
      userCardDetails: wallet,
      orderType: 'delivery',
      paymentType: wallet?.cardNo,
    };

    console.log(payload, 'payloadpayloadpayloadpayload');
    return;
    setLoading(true);

    if (wallet.cardNo === 'Google Pay') {
      return handleGooglePay(payload);
    }

    if (wallet.cardNo === 'Apple Pay') {
      return handleApplePay(payload);
    }

    placeUserOrder({
      ...payload,
      expMonth: wallet.expiryMonth,
      expYear: wallet.expiryYear,
      number: wallet.cardNo,
    })
      .then(res => {
        setLoading(false);
        if (res.status === 200) {
          afterOrderSuccess(res.data.message);
        } else {
          Alert.alert(res.data.message);
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert(err?.response?.data?.message);
      });
  };

  const handleGooglePay = async payload => {
    try {
      const amountPayload = {
        amount: subTotal + deliveryCharges + serviceCharges,
      };

      const res = await createStripeClientSecret(amountPayload);
      const clientSecret = res.data.secretKey;

      const {error} = await confirmPlatformPayPayment(clientSecret, {
        googlePay: {
          testEnv: true,
          merchantName: 'Jarvis Store',
          merchantCountryCode: 'GB',
          currencyCode: 'GBP',
        },
      });

      if (error) return Alert.alert(error.message);

      placeUserOrder(payload).then(res => {
        setLoading(false);
        afterOrderSuccess(res.data.message);
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const handleApplePay = async payload => {
    Alert.alert('Apple Pay Coming Soon!');
  };

  const afterOrderSuccess = message => {
    Alert.alert(message);
    dispatch(setCartData([]));
    AsyncStorage.setItem('cartData', JSON.stringify([]));
    navigation.navigate('AllRestaurants');
  };

  const renderItem = ({item, index}) => <CartCard item={item} index={index} />;

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader goBack notificationsIcon text="Cart" />

      <FlatList
        data={cartData}
        renderItem={renderItem}
        keyExtractor={(_, i) => 'cart-' + i}
        ListFooterComponent={
          <View style={{paddingBottom: width(30)}}>
            <View
              style={{
                marginHorizontal: width(4),
                marginTop: width(4),
                padding: width(3),
                borderRadius: width(3),
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
              }}>
              <View style={{}}>
                <Text style={{fontWeight: '700', fontSize: 16}}>
                  Delivery Address
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    color: colors.graydark,
                    width: width(65),
                  }}>
                  {addressLine}
                </Text>
              </View>

              <View style={{width: width(22), marginTop: 10}}>
                <ActionBuuton
                  name="Change"
                  height={width(9)}
                  fontSize={12}
                  bgcColor={colors.redish}
                  fontColor={colors.white}
                  onPress={() => navigation.navigate('Address')}
                />
              </View>
            </View>

            <View
              style={{
                marginHorizontal: width(4),
                marginTop: width(4),
                padding: width(3),
                borderRadius: width(3),
                borderWidth: 1,
                flexDirection: 'row',
                borderColor: colors.border,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{fontWeight: '700', fontSize: 16}}>
                  Payment Method
                </Text>
                <Text style={{fontSize: 13, color: colors.graydark}}>
                  {wallet?.cardNo
                    ? `****${wallet?.cardNo}`
                    : 'Select a payment method'}
                </Text>
              </View>
              <View style={{width: width(40), marginTop: 10}}>
                <ActionBuuton
                  name="Proceed to Payment"
                  height={width(9)}
                  fontSize={12}
                  bgcColor={colors.redish}
                  fontColor={colors.white}
                  onPress={() => navigation.navigate('PaymentOptions')}
                />
              </View>
            </View>

            <View
              style={{
                marginHorizontal: width(4),
                marginTop: width(5),
                padding: width(4),
                backgroundColor: colors.white,
                borderRadius: width(3),
                borderWidth: 1,
                borderColor: colors.border,
              }}>
              <Text style={{fontWeight: '700', fontSize: 18}}>
                Payment Summary
              </Text>

              <Row label="Sub Total" value={subTotal} />
              <Row label="Delivery" value={deliveryCharges} />
              <Row label="Service Charges" value={serviceCharges} />

              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: 10,
                }}
              />

              <Row label="Total" value={total} bold />
            </View>
          </View>
        }
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: width(4),
          paddingHorizontal: width(4),
        }}>
        <ActionBuuton
          name="Place Order"
          height={width(12)}
          fontSize={14}
          bgcColor={colors.black}
          fontColor={colors.white}
          onPress={handleOrderNow}
        />
      </View>

      <OverLayLoader isloading={loading} />
    </View>
  );
};

const Row = ({label, value, bold}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    }}>
    <Text style={{color: colors.graydark}}>{label}</Text>
    <Text
      style={{
        color: colors.redish,
        fontWeight: bold ? '800' : '700',
      }}>
      £{Number(value || 0).toFixed(2)}
    </Text>
  </View>
);

export default CartScreen;
