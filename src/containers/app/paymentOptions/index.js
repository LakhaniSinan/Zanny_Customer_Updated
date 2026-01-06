import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CardField,
  createPaymentMethod,
  StripeProvider,
  usePlatformPay,
} from '@stripe/stripe-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';

import {fontFamily, icons} from '../../../assets';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {colors, STRIPE_PUBLISH_TEST} from '../../../constants';

import {setCurrentPaymentCard} from '../../../redux/slices/paymentCard';
import {setPaymentType} from '../../../redux/slices/PaymentType';
import {
  addPaymentCard,
  createStripId,
  deletePaymentCard,
} from '../../../services/paymentCard';
import {handelGetCard} from '../../../redux/slices/UserCards';
import {setUserData} from '../../../redux/slices/Login';

const PaymentOptions = ({navigation}) => {
  const dispatch = useDispatch();

  /* ================= REDUX ================= */
  const {cardsData} = useSelector(state => state.CardSlice);
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );
  const {user} = useSelector(state => state.LoginSlice);

  /* ================= STATES ================= */
  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  // Wrapper to handle payment type selection with logging
  const handlePaymentTypeSelect = useCallback(type => {
    console.log('Payment type selected:', type, 'Platform:', Platform.OS);
    setSelectedPaymentType(type);
  }, []);
  const [saveCard, setSaveCard] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardFieldKey, setCardFieldKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  // Always enable Apple Pay and Google Pay on iOS devices
  const [isApplePaySupported, setIsApplePaySupported] = useState(
    Platform.OS === 'ios',
  );
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(
    Platform.OS === 'ios',
  );
  const {isPlatformPaySupported} = usePlatformPay();

  const [modalData, setModalData] = useState({
    type: '',
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    disableClose: false,
    onPress: () => setModalVisible(false),
    onCancel: () => setModalVisible(false),
  });

  /* ================= MODAL ================= */
  const showModal = useCallback((type, message) => {
    console.log(type, 'typetypetypetypetype');

    setModalData({
      type,
      Icon: type === 'success' ? icons.check : icons.cross || icons.cross,
      name: type === 'success' ? 'Success' : 'Error',
      detail: message,
      buttonName: 'Okay',
      disableClose: false,
      onPress: () => setModalVisible(false),
      onCancel: () => setModalVisible(false),
    });
    setModalVisible(true);
  }, []);

  /* ================= PLATFORM PAY SUPPORT ================= */
  useEffect(() => {
    // On iOS, always enable Apple Pay and Google Pay
    if (Platform.OS === 'ios') {
      setIsApplePaySupported(true);
      setIsGooglePaySupported(true);
    } else {
      // On Android, check for Google Pay support
      (async () => {
        try {
          const supported = await isPlatformPaySupported();
          if (supported) {
            setIsGooglePaySupported(true);
          }
        } catch (error) {
          console.log('Platform pay support check error:', error);
        }
      })();
    }
  }, []);

  /* ================= CARD CHANGE ================= */
  const handleCardChange = useCallback(details => {
    setIsCardValid(details?.complete);
    setCardDetails(details);
  }, []);

  /* ================= STRIPE METHOD (SINGLE SOURCE) ================= */
  const createStripeCard = async details => {
    const {paymentMethod, error} = await createPaymentMethod({
      paymentMethodType: 'Card',
      card: details,
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentMethod;
  };

  useEffect(() => {
    if (!user?.stripeCustomerID) {
      handleCreateStripId();
    }
  }, []);

  const handleCreateStripId = async () => {
    try {
      let params = {
        userId: user?._id,
        email: user?.email,
      };

      console.log(params, 'paramsparamsparamsparamsparamsparamsasda ');

      const response = await createStripId(params);
      console.log(response, 'responseresponseresponseresponse');
      if (response.status == 200 || response.status == 201) {
        let userData = response?.data?.user;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(setUserData(userData));
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.log(error, 'verrorerrorerrorerrorerror');
    }
  };
  /* ================= SELECT SAVED CARD ================= */
  const handleSelectPayment = async (method, cardItem = null) => {
    if (method === 'card' && cardItem) {
      dispatch(setCurrentPaymentCard(cardItem));
      dispatch(setPaymentType('Card'));

      await AsyncStorage.multiSet([
        ['paymentCard', JSON.stringify(cardItem)],
        ['paymentType', JSON.stringify('Card')],
      ]);

      setModalData({
        type: 'success',
        Icon: icons.check,
        name: 'Success',
        detail: 'Card selected successfully',
        buttonName: 'Okay',
        disableClose: true,
        onPress: () => {
          setModalVisible(false);
          navigation.goBack();
        },
      });

      setModalVisible(true);
    }
  };

  /* ================= DELETE CARD ================= */
  const handleDeleteCard = cardItem => {
    setModalData({
      type: 'confirmation',
      Icon: icons.alertIcon,
      name: 'Confirmation',
      detail: 'Are you sure you want to delete this card?',
      onPress: async () => {
        try {
          setIsLoading(true);

          const response = await deletePaymentCard({
            paymentId: cardItem?.paymentMethodId,
            userId: user?._id,
          });

          if (response?.status === 200 || response?.status === 201) {
            dispatch(handelGetCard(user?._id));
            showModal('success', response?.data?.message);
          } else {
            showModal('error', response?.data?.message);
          }
        } catch {
          showModal('error', 'Something went wrong while deleting card');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => setModalVisible(false),
    });

    setModalVisible(true);
  };

  /* ================= CONTINUE ================= */
  const handleContinue = async () => {
    if (selectedPaymentType === 'apple' || selectedPaymentType === 'google') {
      const isApple = selectedPaymentType === 'apple';

      // On iOS, always allow Apple Pay and Google Pay
      // On Android, check support for Google Pay only
      if (Platform.OS !== 'ios') {
        const isSupported = isApple
          ? isApplePaySupported
          : isGooglePaySupported;
        if (!isSupported) {
          showModal(
            'error',
            isApple
              ? 'Apple Pay is not available on this device'
              : 'Google Pay is not available on this device',
          );
          return;
        }
      }

      const platformPayload = {
        paymentMethodId: isApple ? 'APPLE_PAY' : 'GOOGLE_PAY',
        brand: isApple ? 'Apple Pay' : 'Google Pay',
        last4: '',
        expMonth: '',
        expYear: '',
      };

      dispatch(setCurrentPaymentCard(platformPayload));
      dispatch(setPaymentType(isApple ? 'APPLE_PAY' : 'GOOGLE_PAY'));

      await AsyncStorage.multiSet([
        ['paymentCard', JSON.stringify(platformPayload)],
        ['paymentType', JSON.stringify(isApple ? 'APPLE_PAY' : 'GOOGLE_PAY')],
      ]);

      setModalData({
        type: 'success',
        Icon: icons.check,
        name: 'Success',
        detail: `${isApple ? 'Apple Pay' : 'Google Pay'} selected successfully`,
        buttonName: 'Okay',
        disableClose: true,
        onPress: () => {
          setModalVisible(false);
          navigation.goBack();
        },
      });

      setModalVisible(true);
      return;
    }

    if (!isCardValid || !cardDetails) {
      showModal('error', 'Please enter complete card details');
      return;
    }

    try {
      setIsLoading(true);

      const paymentMethod = await createStripeCard(cardDetails);

      if (saveCard) {
        const response = await addPaymentCard({
          paymentId: paymentMethod.id,
          email: user?.email,
          userId: user?._id,
        });

        if (response?.status !== 200 && response?.status !== 201) {
          showModal('error', response?.data?.message);
          return;
        }

        dispatch(handelGetCard(user?._id));
      }

      dispatch(
        setCurrentPaymentCard({
          paymentMethodId: paymentMethod.id,
          last4: paymentMethod.Card.last4,
          expMonth: paymentMethod.Card.expMonth,
          expYear: paymentMethod.Card.expYear,
          brand: paymentMethod.Card.brand,
        }),
      );

      dispatch(setPaymentType('Card'));
      await AsyncStorage.setItem('paymentType', JSON.stringify('Card'));

      setCardFieldKey(prev => prev + 1);
      setCardDetails(null);
      setIsCardValid(false);

      navigation.navigate('CartScreen');
    } catch (error) {
      showModal('error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  // Enable button when:
  // - Card selected AND card is valid
  // - Apple Pay selected on iOS (always enabled on iOS)
  // - Google Pay selected on iOS (always enabled on iOS) or Android (if supported)
  const canSubmit =
    selectedPaymentType === 'card'
      ? isCardValid
      : selectedPaymentType === 'apple'
      ? Platform.OS === 'ios' || isApplePaySupported
      : selectedPaymentType === 'google'
      ? Platform.OS === 'ios' ||
        (Platform.OS === 'android' && isGooglePaySupported)
      : false;

  // Debug logging for iOS issues
  useEffect(() => {
    if (Platform.OS === 'ios') {
      console.log('Payment Options State:', {
        selectedPaymentType,
        isApplePaySupported,
        canSubmit,
        isCardValid,
      });
    }
  }, [selectedPaymentType, isApplePaySupported, canSubmit, isCardValid]);

  const PaymentOptionItem = ({value, label, icon, selectedValue, onSelect}) => {
    const isSelected = selectedValue === value;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: width(4),
          marginTop: width(4),
        }}>
        <TouchableOpacity
          onPress={() => onSelect(value)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: width(10),
                width: width(10),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icon}
                style={{height: width(6), width: width(6)}}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                fontSize: 14,
                color: colors.black,
                fontFamily: fontFamily.poppinSemiBold,
                marginLeft: width(4),
              }}>
              {label}
            </Text>
          </View>

          <View
            style={{
              height: width(5),
              width: width(5),
              borderRadius: 100,
              borderWidth: 1,
              borderColor: colors.redish,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isSelected && (
              <View
                style={{
                  height: width(3),
                  width: width(3),
                  borderRadius: 100,
                  backgroundColor: colors.redish,
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /* ================= UI (UNTOUCHED) ================= */
  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <AppHeader text="Payment Method" goBack />

      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <ScrollView style={{flex: 1}}>
          {Platform.OS == 'ios' ? (
            <PaymentOptionItem
              value="apple"
              label="Apple Pay"
              icon={icons.apple}
              selectedValue={selectedPaymentType}
              onSelect={handlePaymentTypeSelect}
            />
          ) : (
            <PaymentOptionItem
              value="google"
              label="Google Pay"
              icon={icons.Google}
              selectedValue={selectedPaymentType}
              onSelect={handlePaymentTypeSelect}
            />
          )}
          <PaymentOptionItem
            value="card"
            label="Credit Card"
            icon={icons.cardIcon}
            selectedValue={selectedPaymentType}
            onSelect={handlePaymentTypeSelect}
          />

          {selectedPaymentType === 'card' && (
            <View style={{paddingHorizontal: width(4), marginTop: width(2)}}>
              <Text style={{fontFamily: fontFamily.poppinMedium, fontSize: 12}}>
                Add Card Details
              </Text>

              <StripeProvider
                publishableKey={STRIPE_PUBLISH_TEST}
                merchantIdentifier="merchant.com.yourapp">
                <CardField
                  key={cardFieldKey}
                  postalCodeEnabled={false}
                  placeholder={{number: '4242 4242 4242 4242'}}
                  cardStyle={{
                    backgroundColor: colors.lightGray,
                    textColor: colors.black,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    placeholderColor: colors.graydark,
                  }}
                  style={{
                    width: '100%',
                    height: 60,
                    alignSelf: 'center',
                    marginTop: width(2),
                  }}
                  onCardChange={handleCardChange}
                />
              </StripeProvider>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(4),
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinMedium,
                    fontSize: 14,
                    color: colors.black,
                  }}>
                  Save card
                </Text>

                <Switch
                  value={saveCard}
                  onValueChange={setSaveCard}
                  trackColor={{false: '#ccc', true: colors.orangeColor}}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          )}

          {/* Previously Saved Cards */}
          <View style={{paddingHorizontal: width(4), marginTop: width(4)}}>
            {cardsData?.length > 0 ? (
              cardsData.map((item, index) => {
                const isSelected =
                  wallet?.paymentMethodId === item?.paymentMethodId;

                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#FFA500',
                      borderRadius: 20,
                      padding: width(4),
                      marginBottom: width(3),
                      elevation: 6,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 4},
                      shadowOpacity: 0.4,
                      shadowRadius: 6,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: width(20),
                      }}>
                      <View style={{alignItems: 'center', gap: width(5)}}>
                        <Image
                          source={icons.cardIcon}
                          style={{width: 50, height: 30}}
                          resizeMode="contain"
                        />
                        <Image
                          source={icons.chipIcon}
                          style={{width: 50, height: 30}}
                          resizeMode="contain"
                        />
                      </View>

                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => handleSelectPayment('card', item)}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: colors.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {isSelected && (
                            <View
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: colors.white,
                              }}
                            />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDeleteCard(item)}
                          style={{
                            height: width(6),
                            marginTop: width(2),
                            width: width(6),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 100,
                            backgroundColor: colors.white,
                          }}>
                          <Image
                            source={icons.deleteIcon}
                            resizeMode="contain"
                            style={{height: width(3), width: width(3)}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text
                      style={{
                        color: colors.black,
                        fontSize: 20,
                        letterSpacing: 2,
                        marginVertical: 10,
                      }}>
                      •••• •••• •••• {item?.last4?.toString().slice(-4)}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={{color: colors.white, fontSize: 12}}>
                          Exp Date
                        </Text>
                        <Text style={{color: colors.white, fontSize: 14}}>
                          {`${item?.expMonth} / ${item?.expYear}` || '00/00'}
                        </Text>
                      </View>

                      <View>
                        <Text style={{color: colors.white, fontSize: 12}}>
                          CVV
                        </Text>
                        <Text style={{color: colors.white, fontSize: 14}}>
                          ***
                        </Text>
                      </View>

                      <View>
                        <Text style={{color: colors.white, fontSize: 12}}>
                          Brand Name
                        </Text>
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: 14,
                            fontWeight: '600',
                          }}>
                          {item?.brand?.toUpperCase() || 'Card Holder'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: width(10),
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: colors.black,
                  }}>
                  No payment cards found
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          Icon={modalData.Icon}
          name={modalData.name}
          detail={modalData.detail}
          buttonName={modalData.buttonName}
          onPress={modalData.onPress}
          close={() => {
            if (modalData?.disableClose) return;
            setModalVisible(false);
          }}
          type={modalData.type}
          onConfirm={modalData.onPress}
          onCancel={modalData.onCancel}
        />

        <View
          style={{
            padding: width(4),
            borderTopWidth: 1,
            borderColor: colors.border,
          }}>
          <TouchableOpacity
            disabled={!canSubmit}
            activeOpacity={canSubmit ? 0.7 : 1}
            onPress={handleContinue}
            style={{
              backgroundColor: !canSubmit ? colors.gray : colors.black,
              paddingVertical: width(4),
              borderRadius: 30,
              alignItems: 'center',
              opacity: !canSubmit ? 0.6 : 1,
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontFamily: fontFamily.poppinSemiBold,
              }}>
              Make Payment
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default PaymentOptions;
