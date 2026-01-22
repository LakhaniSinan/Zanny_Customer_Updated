// ReOccuringCheckout.js (updated with CustomModal)
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {
  confirmPlatformPayPayment,
  PlatformPay,
} from '@stripe/stripe-react-native';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import CustomInput from '../../../components/customInput';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import PreOrderCard from '../../../components/preOrderCard';
import {colors} from '../../../constants';
import {setOrderType} from '../../../redux/slices/OrderType';
import {setPreOrderData} from '../../../redux/slices/PreOrder';
import {getAdminSettings} from '../../../services/adminSettings';
import {getMerchantProfile} from '../../../services/merchant';
import {
  applyPromoCode,
  createStripeClientSecret,
  getCalculatedDeliveryFee,
  placeUserOrder,
} from '../../../services/order';

const parsePriceToNumber = price =>
  Number(String(price ?? '').replace(/[^0-9.]/g, '')) || 0;

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
    style={{height: 1, backgroundColor: colors.border, marginVertical: 12}}
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

const ReOccuringCheckout = ({route}) => {
  const selected = route.params.selectedDates || [];

  const data = route.params;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {preOrderData} = useSelector(state => state.PreOrderDataSlice);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [selectedDates, setSelectedDates] = useState(selected);
  console.log(
    selectedDates,
    'selectedDatesselectedDatesselectedDatesselectedDatesselectedDates',
  );

  const checkoutItems = useMemo(() => {
    return selectedDates
      .flatMap(d => d.products || [])
      .filter(p => p.isSelected);
  }, [selectedDates]);

  const preparedOrderItems = useMemo(() => {
    return selectedDates.flatMap(d =>
      (d.products || [])
        .filter(p => p.isSelected)
        .map(p => ({
          ...p,
          date: moment(d.date).format('YYYY-MM-DD'), // ✅ apni date
          time: moment(data?.time).format('HH:mm'),
        })),
    );
  }, [selectedDates, data?.time]);

  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {user} = useSelector(s => s.LoginSlice);
  const wallet = useSelector(s => s.PaymentCardSlice.currentPaymentCard);
  const {address} = useSelector(s => s.AddressSlice);
  const selectedAddress = address && address.length ? address[0] : null;
  const {orderType} = useSelector(state => state.OrderType);

  const {currentLocation} = useSelector(state => state.LocationSlice);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const addressLine = useMemo(
    () => currentLocation?.address,
    [selectedAddress],
  );
  const effectiveDeliveryCharges = useMemo(() => {
    return orderType === 'collection' ? 0 : Number(deliveryCharges || 0);
  }, [orderType, deliveryCharges]);

  const {subTotal, discountedSubTotal, total} = useMemo(() => {
    const st = checkoutItems.reduce((acc, item) => {
      const basePrice =
        item?.discount > 0
          ? parsePriceToNumber(item?.discount) // after-discount price ✅
          : parsePriceToNumber(item?.price); // normal price

      const qty = Number(item?.selectedQty || 1);
      return acc + basePrice * qty;
    }, 0);

    const discountPercent = promoData?.discount || 0;

    const discounted =
      discountPercent > 0
        ? Number((st - (st * discountPercent) / 100).toFixed(2))
        : Number(st.toFixed(2));

    const t = Number(
      (
        discounted +
        effectiveDeliveryCharges +
        Number(serviceCharges || 0)
      ).toFixed(2),
    );

    return {
      subTotal: st,
      discountedSubTotal: discounted,
      total: t,
    };
  }, [checkoutItems, promoData, effectiveDeliveryCharges, serviceCharges]);

  useEffect(() => {
    setLoading(true);
    getAdminSettings()
      .catch(() => {})
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

  useEffect(() => {
    if (preOrderData?.length) {
      fetchMerchantDetails(preOrderData[0]?.merchantId);
    } else {
      setMerchantDetails(null);
      setDeliveryCharges(0);
    }
  }, [preOrderData]);

  const fetchMerchantDetails = useCallback(async restId => {
    if (!restId) return;
    setLoading(true);
    try {
      const res = await getMerchantProfile(restId);
      if (res?.data?.status === 'ok') setMerchantDetails(res.data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveryCharges = useCallback(async () => {
    if (orderType === 'collection') {
      setDeliveryCharges(0);
      return;
    }

    if (!merchantDetails || !currentLocation) return;

    const payload = {
      restlat: merchantDetails.latitude,
      restlong: merchantDetails.longitude,
      userlat: currentLocation.latitude,
      userlong: currentLocation.longitude,
    };

    setLoading(true);
    try {
      const res = await getCalculatedDeliveryFee(payload);
      setDeliveryCharges(
        res?.data?.status === 'ok' && res.data.data != null
          ? Number(Number(res.data.data).toFixed(2))
          : 0,
      );
    } catch (err) {
      setDeliveryCharges(0);
    } finally {
      setLoading(false);
    }
  }, [merchantDetails, currentLocation, orderType]);

  const calculateServiceCharges = useCallback(() => {
    if (!checkoutItems?.length) {
      setServiceCharges(0);
      return;
    }

    const totalValue = checkoutItems.reduce((acc, item) => {
      const price = parsePriceToNumber(item?.price);
      const qty = Number(item?.selectedQty || 1);
      return acc + price * qty;
    }, 0);

    const fee = Math.min(Math.max(totalValue * 0.05, 0.99), 4.5);
    setServiceCharges(Number(fee.toFixed(2)));
  }, [checkoutItems]);

  useFocusEffect(
    useCallback(() => {
      calculateServiceCharges();
      fetchDeliveryCharges();
    }, [calculateServiceCharges, fetchDeliveryCharges]),
  );

  const showModal = ({icons, title, message, onConfirm}) => {
    setModalData({
      type: 'default',
      Icon: icons,
      name: title,
      detail: message,
      onConfirm: () => {
        onConfirm && onConfirm();
        setModalVisible(false);
      },
      onCancel: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim())
      return showModal({
        title: 'Enter Promo',
        message: 'Please enter a promo code first',
      });
    setLoading(true);
    try {
      const response = await applyPromoCode({promoCode});
      if (response?.status === 200 || response?.status === 201) {
        setPromoData(response.data.data);
        setIsPromoApplied(true);
        showModal({
          icons: icons.check,
          title: 'Success',
          message: `Promo applied! ${response.data.data.discount}% discount`,
        });
      } else {
        showModal({
          icons: icons.cross,
          title: 'Error',
          message: response?.data?.message || 'Invalid promo code',
        });
      }
    } catch (err) {
      showModal({
        icons: icons.cross,
        title: 'Error',
        message: err?.response?.data?.message || 'Failed to apply promo code',
      });
    } finally {
      setLoading(false);
    }
  }, [promoCode]);

  const afterOrderSuccess = useCallback(
    message => {
      showModal({
        icons: icons.check,
        title: 'Success',
        message,
        onConfirm: () => {
          const remainingItems = preOrderData.filter(item => !item.isSelected);
          dispatch(setPreOrderData(remainingItems));
          AsyncStorage.setItem('preOrderData', JSON.stringify(remainingItems));
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'BottomStack',
                state: {
                  index: 0,
                  routes: [{name: 'Home'}],
                },
              },
            ],
          });
        },
      });
    },
    [dispatch, navigation],
  );

  const ordersByDate = useMemo(() => {
    return selectedDates
      .map(d => {
        const items = (d.products || []).filter(p => p.isSelected);
        if (!items.length) return null;

        const subTotal = items.reduce((acc, item) => {
          const price = parsePriceToNumber(item.price);
          return acc + price * (item.selectedQty || 1);
        }, 0);

        return {
          deliveryDate: moment(d.date).format('YYYY-MM-DD'),
          items,
          subTotal,
        };
      })
      .filter(Boolean);
  }, [selectedDates]);

  // console.log(ordersByDate, 'ordersByDateordersByDateordersByDateordersByDate');

  const handleOrderNow = useCallback(async () => {
    if (!checkoutItems?.length) {
      return showModal({
        title: 'No Items Selected',
        message: 'Please select at least one item to continue',
      });
    }

    if (!wallet)
      return showModal({
        title: 'Payment Method',
        message: 'Please select a payment method',
      });

    const payload = {
      order: preparedOrderItems,

      tip: 0,

      userId: user?._id,
      merchantId: preOrderData[0]?.merchantId,

      serviceCharges,
      address: addressLine,
      subTotal: discountedSubTotal,
      deliveryCharges: effectiveDeliveryCharges,
      totalBill: total,

      discount: promoData?.discount || 0,

      deliveryData: moment(data?.selectedDate || selectedDates[0]?.date).format(
        'DD-MM-YYYY',
      ),
      deliveryTime: moment(data?.time).format('hh:mm A'),

      latitude: currentLocation?.latitude || 0,
      longitude: currentLocation?.longitude || 0,

      userDetails: {
        email: user?.email,
        name: user?.name,
        phone: user?.phoneNumber,
        image: user?.customerImage,
        stripeCustomerID: user?.stripeCustomerID,
      },

      merchantDetails,
      userCardDetails: wallet,

      orderType,

      paymentType:
        wallet?.paymentMethodId === 'GOOGLE_PAY' ||
        wallet?.cardNo === 'Google Pay'
          ? 'GOOGLE_PAY'
          : wallet?.paymentMethodId === 'APPLE_PAY' ||
            wallet?.cardNo === 'Apple Pay'
          ? 'APPLE_PAY'
          : wallet
          ? 'card'
          : 'COD',

      promoData,
      noteForChef: note,
      orderCategory: 'daily',
    };

    if (
      wallet?.paymentMethodId === 'GOOGLE_PAY' ||
      wallet?.cardNo === 'Google Pay'
    ) {
      await payWithGoogle(payload);
      return;
    }

    if (
      wallet?.paymentMethodId === 'APPLE_PAY' ||
      wallet?.cardNo === 'Apple Pay'
    ) {
      await payWithApple(payload);
      return;
    }

    console.log(payload, 'payloadpayloadpayloadpayloadpayload');
    setLoading(true);
    try {
      const res = await placeUserOrder(payload);
      if (res?.status === 200 || res?.status === 201) {
        afterOrderSuccess(res?.data?.message);
      } else {
        showModal({
          title: 'Error',
          message: res?.data?.message || 'Failed to place order',
        });
      }
    } catch (err) {
      showModal({
        title: 'Error',
        message: err?.response?.data?.message || 'Failed to place order',
      });
    } finally {
      setLoading(false);
    }
  }, [
    preOrderData,
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
    afterOrderSuccess,
  ]);

  const payWithGoogle = useCallback(
    async orderPayload => {
      setLoading(true);
      try {
        const amountInPence = Math.round(Number(total) * 100);

        const intentRes = await createStripeClientSecret({
          amount: amountInPence,
        });
        const clientSecret = intentRes?.data?.secretKey;

        const {error} = await confirmPlatformPayPayment(clientSecret, {
          googlePay: {
            testEnv: true,
            merchantName: 'Zannys Foods',
            merchantCountryCode: 'GB',
            currencyCode: 'GBP',
            amount: amountInPence,
            billingAddressConfig: {
              format: PlatformPay.BillingAddressFormat.Full,
              isPhoneNumberRequired: true,
              isRequired: true,
            },
          },
        });

        if (error) {
          console.log('Google Pay error', error);
          showModal({
            title: 'Payment Failed',
            message: error.message || 'Google Pay payment failed',
          });
          return;
        }

        const res = await placeUserOrder(orderPayload);
        if (res?.status === 200 || res?.status === 201) {
          afterOrderSuccess(res?.data?.message);
        } else {
          showModal({
            title: 'Error',
            message: res?.data?.message || 'Failed to place order',
          });
        }
      } catch (err) {
        console.log('payWithGoogle err', err);
        showModal({
          title: 'Error',
          message: err?.response?.data?.message || 'Google Pay failed',
        });
      } finally {
        setLoading(false);
      }
    },
    [total, afterOrderSuccess, showModal],
  );

  const payWithApple = useCallback(
    async orderPayload => {
      // Only check platform - if iOS, proceed with Apple Pay
      // Let Stripe SDK handle the actual capability check
      if (Platform.OS !== 'ios') {
        showModal({
          icons: icons.cross,
          title: 'Apple Pay',
          message: 'Apple Pay is only available on iOS devices.',
        });
        return;
      }

      console.log('🍎 Starting Apple Pay flow on iOS device');
      console.log('Total amount:', total);

      setLoading(true);
      try {
        // Convert total to pence (smallest currency unit) for Stripe
        const amountInPence = Math.round(total * 100);
        const displayAmount = total.toFixed(2);

        console.log(
          '💰 Creating payment intent for amount:',
          amountInPence,
          'pence (£' + displayAmount + ')',
        );
        const intentRes = await createStripeClientSecret({
          amount: amountInPence,
        });

        if (!intentRes?.data?.secretKey) {
          console.error('❌ Failed to get client secret from server');
          throw new Error('Failed to create payment intent. Please try again.');
        }

        const clientSecret = intentRes.data.secretKey;
        console.log('✅ Payment intent created, client secret received');

        console.log('🍎 Attempting to confirm Apple Pay payment...');
        console.log('Merchant ID: merchant.com.zannycustomer');
        console.log('Amount:', displayAmount, 'GBP');

        // Try to confirm payment - Stripe SDK will handle device capability check
        const {error} = await confirmPlatformPayPayment(clientSecret, {
          applePay: {
            cartItems: [
              {
                label: 'Zannys Foods Order',
                amount: displayAmount,
                paymentType: PlatformPay.PaymentType.Immediate,
              },
            ],
            merchantCountryCode: 'GB',
            currencyCode: 'GBP',
            requiredShippingAddressFields: [
              PlatformPay.ContactField.PostalAddress,
            ],
            requiredBillingContactFields: [
              PlatformPay.ContactField.PhoneNumber,
            ],
          },
        });

        if (error) {
          console.error('❌ Apple Pay payment error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);

          let errorMessage = 'Apple Pay payment failed. ';
          if (error.code === 'Canceled') {
            errorMessage = 'Apple Pay payment was cancelled.';
          } else if (error.message) {
            errorMessage += error.message;
          } else {
            errorMessage +=
              'Please ensure Apple Pay is set up in Wallet app and try again.';
          }

          showModal({
            title: 'Payment Failed',
            message: errorMessage,
          });
          setLoading(false);
          return;
        }

        console.log('✅ Apple Pay payment successful!');
        console.log('📦 Placing order...');

        const res = await placeUserOrder(orderPayload);
        if (res?.status === 200 || res?.status === 201) {
          console.log('✅ Order placed successfully');
          afterOrderSuccess(res?.data?.message);
        } else {
          console.error('❌ Order placement failed:', res?.data?.message);
          showModal({
            title: 'Error',
            message: res?.data?.message || 'Failed to place order',
          });
        }
      } catch (err) {
        console.error('❌ payWithApple exception:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));

        let errorMessage = 'Apple Pay failed. ';
        if (err?.message) {
          errorMessage += err.message;
        } else if (err?.response?.data?.message) {
          errorMessage += err.response.data.message;
        } else {
          errorMessage += 'Please try again or contact support.';
        }

        showModal({
          title: 'Error',
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [total, confirmPlatformPayPayment, afterOrderSuccess, showModal],
  );

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
        Your Pre Order Cart is Empty
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
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'BottomStack'}],
              }),
            )
          }
        />
      </View>
    </View>
  );

  const updateProduct = useCallback((dateIndex, productId, changes) => {
    setSelectedDates(prev => {
      const updated = [...prev];
      updated[dateIndex] = {
        ...updated[dateIndex],
        products: updated[dateIndex].products.map(p =>
          p._id === productId ? {...p, ...changes} : p,
        ),
      };
      return updated;
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader goBack notificationsIcon text="Check out" />
      <FlatList
        data={selectedDates}
        keyExtractor={item => item.date}
        renderItem={({item, index}) => {
          return (
            <View style={{paddingHorizontal: width(3)}}>
              <TouchableOpacity
                onPress={() =>
                  setSelectedDates(prev => {
                    const updated = [...prev];
                    updated[index].isOpen = !updated[index].isOpen;
                    return updated;
                  })
                }
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: width(4),
                  borderBottomWidth: 0.5,
                  borderColor: colors.border,
                }}>
                <Text style={{fontFamily: fontFamily.poppinSemiBold}}>
                  {item.day} {moment(item.date).format('DD/MM/YYYY')}
                </Text>
                <Image
                  resizeMode="contain"
                  source={icons.arrowDown}
                  style={{
                    height: 10,
                    width: 10,
                    transform: [{rotate: item.isOpen ? '180deg' : '0deg'}],
                  }}
                />
              </TouchableOpacity>

              {item.isOpen && (
                <>
                  <FlatList
                    data={item.products}
                    keyExtractor={p => p._id}
                    renderItem={({item: prod}) => (
                      <PreOrderCard
                        item={prod}
                        type={'reOccuring'}
                        ischeckout={true}
                        handleIncreaseQuantity={() =>
                          updateProduct(index, prod._id, {
                            selectedQty: prod.selectedQty + 1,
                          })
                        }
                        handleDecreaseQuantity={() =>
                          prod.selectedQty > 1 &&
                          updateProduct(index, prod._id, {
                            selectedQty: prod.selectedQty - 1,
                          })
                        }
                        handleSelectToCheckout={() =>
                          updateProduct(index, prod._id, {
                            isSelected: !prod.isSelected,
                          })
                        }
                      />
                    )}
                  />
                  <View
                    style={{paddingHorizontal: width(4), marginTop: width(4)}}>
                    {(preOrderData[0]?.merchant?.isPickUp ||
                      preOrderData[0]?.merchant?.isDelivery) && (
                      <Text
                        style={{
                          fontFamily: fontFamily.poppinSemiBold,
                          color: colors.black,
                          fontSize: 16,
                        }}>
                        Delivery Type
                      </Text>
                    )}
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 10,
                        paddingVertical: width(4),
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                      }}>
                      {preOrderData[0]?.merchant?.isPickUp && (
                        <TouchableOpacity
                          onPress={() => dispatch(setOrderType('collection'))}
                          style={{
                            paddingHorizontal: width(3),
                            paddingVertical: width(2),
                            borderRadius: 100,
                            borderWidth: 1,
                            backgroundColor:
                              orderType == 'collection'
                                ? colors.redish
                                : colors.softgray,
                            borderColor:
                              orderType == 'collection'
                                ? colors.redish
                                : colors.softgray,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: fontFamily.poppinSemiBold,
                              color:
                                orderType == 'collection'
                                  ? colors.white
                                  : colors.black,
                            }}>
                            Collection
                          </Text>
                        </TouchableOpacity>
                      )}
                      {preOrderData[0]?.merchant?.isDelivery && (
                        <TouchableOpacity
                          onPress={() => dispatch(setOrderType('delivery'))}
                          style={{
                            paddingHorizontal: width(3),
                            paddingVertical: width(2),
                            borderRadius: 100,
                            borderWidth: 1,

                            borderColor:
                              orderType == 'delivery'
                                ? colors.redish
                                : colors.softgray,
                            backgroundColor:
                              orderType == 'delivery'
                                ? colors.redish
                                : colors.softgray,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: fontFamily.poppinSemiBold,
                              color:
                                orderType == 'delivery'
                                  ? colors.white
                                  : colors.black,
                            }}>
                            Delivery
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }}
        ListFooterComponent={
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

            <View
              style={{
                height: width(13),
                backgroundColor: '#F8F8F8',
                borderRadius: 100,
                borderWidth: 1,
                borderColor: colors.border,
                marginHorizontal: width(4),
                marginTop: width(2),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: width(4),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinRegular,
                  fontSize: 14,
                  color: colors.gray,
                }}>
                Delivery Time
              </Text>
              <View
                style={{
                  borderRadius: 100,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={icons.timeIcon}
                  style={{height: width(5), width: width(5)}}
                />

                <Text
                  style={{
                    fontFamily: fontFamily.poppinBold,
                    color: colors.redish,
                    marginLeft: width(3),
                    marginTop: width(1),
                  }}>
                  {moment(data?.time).format('hh:mm A')}
                </Text>
              </View>
            </View>

            {/* Payment Method */}
            <SectionCard title="Payment Method">
              <Text
                style={{
                  fontSize: 13,
                  color: colors.graydark,
                  marginBottom: width(2),
                  fontFamily: fontFamily.poppin,
                }}>
                {wallet?.paymentMethodId === 'GOOGLE_PAY'
                  ? 'Google Pay'
                  : wallet?.paymentMethodId === 'APPLE_PAY'
                  ? 'Apple Pay'
                  : wallet?.last4
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
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                  marginVertical: width(2),
                }}>
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

            <View style={{marginHorizontal: width(4), marginTop: width(2)}}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                  marginVertical: width(2),
                }}>
                Leave a note for chef
              </Text>
              <View style={{}}>
                <CustomInput
                  value={note}
                  multiline={true}
                  onChangeText={setNote}
                  placeholder="Type here..."
                  placeholderTextColor={colors.graydark}
                />
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
              {orderType !== 'collection' && (
                <Row label="Delivery" value={effectiveDeliveryCharges} />
              )}

              <Row label="Service Charges" value={serviceCharges} />

              <Divider />

              <Row label="Total" value={total} bold />
            </View>
          </View>
        }
      />

      {preOrderData?.length > 0 && !keyboardVisible && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 10,
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

      <CustomModal
        visible={modalVisible}
        type={modalData.type}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        onConfirm={modalData.onConfirm}
        onCancel={modalData.onCancel}
        close={() => setModalVisible(false)}
      />
      <OverLayLoader isloading={loading} />
    </View>
  );
};

export default ReOccuringCheckout;
