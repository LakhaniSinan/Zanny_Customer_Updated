// CartScreen.js (refactored + commented)
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import ActionBuuton from '../../../components/actionButton';
import CartCard from '../../../components/cartCard';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {setCartData} from '../../../redux/slices/Cart';
import {getAdminSettings} from '../../../services/adminSettings';
import {getMerchantProfile} from '../../../services/merchant';
import {
  applyPromoCode,
  getCalculatedDeliveryFee,
  placeUserOrder,
} from '../../../services/order';
import {icons, fontFamily} from '../../../assets';

/**
 * Helper: parse price strings like "£12.00" -> 12
 * Returns 0 for invalid values
 */
const parsePriceToNumber = price =>
  Number(String(price ?? '').replace(/[^0-9.]/g, '')) || 0;

/**
 * Row: small label-value row used inside summary
 * Divider: simple horizontal divider
 * SectionCard: simple card wrapper with title
 * (kept inside same file for convenience)
 */
const Row = React.memo(({label, value, bold}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    }}>
    <Text style={{color: colors.graydark, fontFamily: fontFamily.poppin}}>
      {label}
    </Text>
    <Text
      style={{
        color: colors.redish,
        fontWeight: bold ? '800' : '700',
        fontFamily: fontFamily.poppinBold,
      }}>
      {label === 'Promo Discount' ? value : `£${Number(value || 0).toFixed(2)}`}
    </Text>
  </View>
));

const Divider = React.memo(() => (
  <View
    style={{
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    }}
  />
));

const SectionCard = React.memo(({title, children, style}) => (
  <View
    style={[
      {
        marginHorizontal: width(4),
        marginTop: width(2),
        padding: width(3),
        borderRadius: width(3),
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
      },
      style,
    ]}>
    <Text
      style={{
        fontWeight: '700',
        fontSize: 16,
        fontFamily: fontFamily.poppinBold,
      }}>
      {title}
    </Text>
    <View style={{marginTop: width(2)}}>{children}</View>
  </View>
));

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Local states
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Redux state
  const cartData = useSelector(s => s.CartSlice.cartData) || [];
  const location = useSelector(s => s.LocationSlice.currentLocation);
  const {user} = useSelector(s => s.LoginSlice);
  const wallet = useSelector(s => s.PaymentCardSlice.currentPaymentCard);
  const {address} = useSelector(s => s.AddressSlice);
  const selectedAddress = address && address.length ? address[0] : null;

  // Human-friendly address line
  const addressLine = useMemo(
    () =>
      selectedAddress?.address || selectedAddress?.full_address || 'No address',
    [selectedAddress],
  );

  // ---------- Derived totals ----------
  const {subTotal, discountedSubTotal, total} = useMemo(() => {
    // subtotal uses price * quantity
    const st = cartData.reduce((acc, item) => {
      const price = parsePriceToNumber(item?.price);
      const qty = Number(item?.quantity || item?.selectedQty || 1);
      return acc + price * qty;
    }, 0);

    const discountPercent = promoData?.discount || 0;
    const discounted = Number((st - (st * discountPercent) / 100).toFixed(2));
    const t = Number(
      (
        discounted +
        Number(deliveryCharges || 0) +
        Number(serviceCharges || 0)
      ).toFixed(2),
    );
    return {subTotal: st, discountedSubTotal: discounted, total: t};
  }, [cartData, promoData, deliveryCharges, serviceCharges]);

  // ---------- Fetch admin settings (once) ----------
  useEffect(() => {
    setLoading(true);
    getAdminSettings()
      .catch(e => console.log('getAdminSettings error', e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // ---------- Get merchant details when cart has items ----------
  useEffect(() => {
    if (cartData?.length) {
      const restId = cartData[0]?.merchantId;
      fetchMerchantDetails(restId);
    } else {
      setMerchantDetails(null);
      setDeliveryCharges(0);
    }
  }, [cartData]);

  // Fetch merchant profile
  const fetchMerchantDetails = useCallback(async restId => {
    if (!restId) return;
    setLoading(true);
    try {
      const res = await getMerchantProfile(restId);
      if (res?.data?.status === 'ok') {
        setMerchantDetails(res.data.data);
      }
    } catch (err) {
      console.log('getMerchantProfile err', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Calculate delivery charges when merchantDetails or selectedAddress changes ----------
  const fetchDeliveryCharges = useCallback(async () => {
    if (!merchantDetails || !selectedAddress) return;
    const payload = {
      restlat: merchantDetails.latitude,
      restlong: merchantDetails.longitude,
      userlat: selectedAddress.latitude,
      userlong: selectedAddress.longitude,
    };
    setLoading(true);
    try {
      const res = await getCalculatedDeliveryFee(payload);
      if (res?.data?.status === 'ok' && res.data.data != null) {
        setDeliveryCharges(Number(Number(res.data.data).toFixed(2)));
      } else {
        setDeliveryCharges(0);
      }
    } catch (err) {
      console.log('getCalculatedDeliveryFee err', err);
      setDeliveryCharges(0);
    } finally {
      setLoading(false);
    }
  }, [merchantDetails, selectedAddress]);

  // ---------- Service charge calculation ----------
  const calculateServiceCharges = useCallback(() => {
    if (!cartData?.length) {
      setServiceCharges(0);
      return;
    }
    // totalValue is subtotal (price * qty)
    const totalValue = cartData.reduce((acc, item) => {
      const price = parsePriceToNumber(item?.price);
      const qty = Number(item?.quantity || item?.selectedQty || 1);
      // If item has discount field greater than 0 and it's supposed to be the discounted price use it,
      // else use the price. (Preserved similar logic but safe)
      const effectivePrice =
        Number(item?.discount) > 0 ? Number(item.discount) : price;
      return acc + effectivePrice * qty;
    }, 0);

    // Fee: 5% clamped between 0.99 and 4.5 (keeps previous logic)
    const fee = Math.min(Math.max(totalValue * 0.05, 0.99), 4.5);
    setServiceCharges(Number(fee.toFixed(2)));
  }, [cartData]);

  // run when screen focused (or merchant/address change)
  useFocusEffect(
    useCallback(() => {
      calculateServiceCharges();
      fetchDeliveryCharges();
    }, [calculateServiceCharges, fetchDeliveryCharges]),
  );

  // ---------- Promo handling ----------
  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim()) {
      return Alert.alert('Enter promo', 'Please enter a promo code first');
    }
    setLoading(true);
    try {
      const response = await applyPromoCode({promoCode});
      // service returns HTTP status codes
      if (response?.status === 200 || response?.status === 201) {
        setPromoData(response.data.data);
        setIsPromoApplied(true);
        Alert.alert(
          'Success',
          `Promo applied! ${response.data.data.discount}% discount`,
        );
      } else {
        Alert.alert('Error', response?.data?.message || 'Invalid promo code');
      }
    } catch (err) {
      console.log('applyPromoCode err', err);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Failed to apply promo code',
      );
    } finally {
      setLoading(false);
    }
  }, [promoCode]);

  // ---------- Place order ----------
  const handleOrderNow = useCallback(async () => {
    // validate
    if (!cartData?.length)
      return Alert.alert('Cart empty', 'Add items to cart first');
    // if paymentType is card required wallet; current code used wallet presence only
    if (!wallet)
      return Alert.alert('Payment method', 'Please select a payment method');

    const payload = {
      order: cartData,
      tip: 0,
      userId: user?._id,
      serviceCharges,
      address: addressLine,
      subTotal: discountedSubTotal,
      deliveryCharges,
      totalBill: total,
      discount: promoData?.discount || 0,
      date: moment().format('DD-MM-YYYY'),
      merchantId: cartData[0]?.merchantId,
      latitude: selectedAddress?.latitude || 0,
      longitude: selectedAddress?.longitude || 0,
      userDetails: {
        email: user?.email,
        name: user?.name,
        phone: user?.phoneNumber,
        image: user?.customerImage,
        stripeCustomerID: user?.stripeCustomerID,
      },
      merchantDetails,
      userCardDetails: wallet,
      orderType: 'delivery',
      paymentType: wallet ? 'card' : 'COD',
      promoData: promoData,
    };
    console.log(payload, 'payloadpayloadpayloadpayloadpayloadasdsad');

    setLoading(true);
    try {
      const res = await placeUserOrder(payload);
      // assuming placeUserOrder throws or returns success 200
      if (
        res?.status === 200 ||
        res?.status === 201 ||
        res?.data?.status === 'ok'
      ) {
        afterOrderSuccess('Order placed successfully!');
      } else {
        Alert.alert('Error', res?.data?.message || 'Failed to place order');
      }
    } catch (err) {
      console.log('placeUserOrder err', err);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Failed to place order',
      );
    } finally {
      setLoading(false);
    }
  }, [
    cartData,
    user,
    serviceCharges,
    addressLine,
    discountedSubTotal,
    deliveryCharges,
    total,
    promoData,
    merchantDetails,
    wallet,
    selectedAddress,
  ]);

  const afterOrderSuccess = useCallback(
    message => {
      Alert.alert('Success', message);
      // clear cart locally and redux
      dispatch(setCartData([]));
      AsyncStorage.setItem('cartData', JSON.stringify([])).catch(e =>
        console.log('AsyncStorage set cartData err', e),
      );
      // navigate to restaurants or orders screen
      navigation.navigate('AllRestaurants');
    },
    [dispatch, navigation],
  );

  // ---------- Render helpers ----------
  const renderEmpty = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: width(20),
        paddingHorizontal: width(5),
      }}>
      <Image
        source={icons.emptyCartIcon}
        style={{
          width: width(50),
          height: width(50),
          resizeMode: 'contain',
          marginBottom: width(5),
        }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.black,
          marginBottom: width(2),
        }}>
        Your Cart is Empty
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: colors.graydark,
          textAlign: 'center',
          marginBottom: width(5),
        }}>
        Explore delicious food and start ordering!
      </Text>
      <View style={{width: width(60)}}>
        <ActionBuuton
          name="Start Ordering"
          height={width(12)}
          fontSize={14}
          bgcColor={colors.redish}
          fontColor={colors.white}
          onPress={() => navigation.navigate('AllFoodScreen')}
        />
      </View>
    </View>
  );

  // FlatList footer (only when cart has items)
  const renderFooter = () => {
    if (!cartData?.length) return null;
    return (
      <View style={{paddingBottom: width(30)}}>
        {/* Delivery Address */}
        <SectionCard title="Delivery Address">
          <Text
            numberOfLines={2}
            style={{
              fontSize: 13,
              color: colors.graydark,
              marginBottom: width(2),
              fontFamily: fontFamily.poppin,
            }}>
            {addressLine}
          </Text>
          <ActionBuuton
            name="Change"
            height={width(9)}
            fontSize={12}
            bgcColor={colors.redish}
            fontColor={colors.white}
            onPress={() => navigation.navigate('Address')}
          />
        </SectionCard>

        {/* Payment Method */}
        <SectionCard title="Payment Method" style={{}}>
          <Text
            style={{
              fontSize: 13,
              color: colors.graydark,
              marginBottom: width(2),
              fontFamily: fontFamily.poppin,
            }}>
            {wallet?.last4
              ? `**** ${wallet?.last4}`
              : 'Select a payment method'}
          </Text>

          <ActionBuuton
            name="Payment Options"
            height={width(9)}
            fontSize={12}
            bgcColor={colors.redish}
            fontColor={colors.white}
            onPress={() => navigation.navigate('PaymentOptions')}
          />
        </SectionCard>

        {/* Promo Code */}
        <View style={{marginHorizontal: width(4), marginTop: width(2)}}>
          <Text
            style={{fontWeight: '700', fontSize: 16, marginVertical: width(2)}}>
            Promo Code
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              value={promoCode}
              onChangeText={text => {
                setPromoCode(text);
                setIsPromoApplied(false);
                if (!text) setPromoData(null);
              }}
              placeholder="Enter Promo Code"
              placeholderTextColor={colors.graydark}
              style={{
                flex: 1,
                height: 50,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 15,
                color: colors.black,
                fontFamily: fontFamily.poppin,
              }}
            />
            <View style={{width: width(30), marginLeft: 10}}>
              <ActionBuuton
                name="Apply"
                height={50}
                fontSize={14}
                bgcColor={colors.redish}
                fontColor={colors.white}
                onPress={handleApplyPromo}
              />
            </View>
          </View>
        </View>

        {/* Payment Summary */}
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
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
              fontFamily: fontFamily.poppinBold,
            }}>
            Payment Summary
          </Text>
          <Row label="Sub Total" value={subTotal} />
          {isPromoApplied && promoData && (
            <Row
              label="Promo Discount"
              value={`-${(subTotal - discountedSubTotal).toFixed(2)} (£${
                promoData.discount
              }% OFF)`}
            />
          )}
          <Row label="Delivery" value={deliveryCharges} />
          <Row label="Service Charges" value={serviceCharges} />
          <Divider />
          <Row label="Total" value={total} bold />
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader goBack notificationsIcon text="Cart" />
      <FlatList
        data={cartData}
        renderItem={({item, index}) => <CartCard item={item} index={index} />}
        keyExtractor={(item, i) =>
          item?._id ? `cart-${item._id}` : `cart-${i}`
        }
        ListEmptyComponent={renderEmpty()}
        ListFooterComponent={renderFooter()}
        contentContainerStyle={{
          paddingBottom: cartData?.length ? width(1) : 0,
        }}
      />

      {cartData?.length > 0 && !keyboardVisible && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: width(4),
            backgroundColor: colors.white,
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
      )}

      <OverLayLoader isloading={loading} />
    </View>
  );
};

export default CartScreen;
