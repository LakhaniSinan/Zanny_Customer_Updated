import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {
  CardField,
  createPaymentMethod,
  StripeProvider,
} from '@stripe/stripe-react-native';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
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
  deletePaymentCard,
  getPaymentCardById,
} from '../../../services/paymentCard';

const PaymentOptions = ({navigation}) => {
  const dispatch = useDispatch();
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );
  const [isCardValid, setIsCardValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentCards, setPaymentCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [cardFieldKey, setCardFieldKey] = useState(0);
  const {user} = useSelector(state => state.LoginSlice);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
    disableClose: false,
  });

  const showModal = (type, message) => {
    setModalData({
      Icon: type === 'success' ? icons.check : icons.cross,
      name: type === 'success' ? 'Success' : 'Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
      disableClose: false,
    });
    setModalVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserPaymentCards();
    }, []),
  );

  const getUserPaymentCards = async () => {
    try {
      setIsLoading(true);
      const response = await getPaymentCardById(user?._id);
      const cards = response?.data?.cards || [];
      if (response?.status === 200 || response?.status === 201) {
        setPaymentCards(cards);
      }
    } catch (error) {
      console.error('Error fetching payment cards:', error);
      showModal('error', 'Failed to fetch payment cards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPayment = async (method, cardItem = null) => {
    setSelectedMethod(method);

    if (method === 'card' && cardItem) {
      dispatch(setCurrentPaymentCard(cardItem));
      dispatch(setPaymentType('Card'));
      await AsyncStorage.setItem('paymentCard', JSON.stringify(cardItem));
      await AsyncStorage.setItem('paymentType', JSON.stringify('Card'));
      setModalData({
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
      return;
    }

    if (method === 'google') {
      dispatch(setPaymentType('GooglePay'));
      await AsyncStorage.setItem('paymentType', JSON.stringify('GooglePay'));
      navigation.goBack();
      return;
    }

    if (method === 'apple') {
      dispatch(setPaymentType('ApplePay'));
      await AsyncStorage.setItem('paymentType', JSON.stringify('ApplePay'));
      navigation.goBack();
      return;
    }
  };

  const handleCardChange = details => {
    setIsCardValid(details.complete);
    setCardDetails(details);
  };

  const handleSaveCard = () => {
    if (!isCardValid || !cardDetails) {
      showModal('error', 'Please enter complete card details');
      return;
    }

    const detailsToSave = cardDetails;
    setCardFieldKey(prev => prev + 1); // reset CardField
    setCardDetails(null);
    setIsCardValid(false);
    createTokenForStripe(detailsToSave);
  };

  const createTokenForStripe = async details => {
    try {
      setIsLoading(true);

      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: details,
      });

      if (error) {
        showModal('error', error.message);
        return;
      }

      let payload = {
        paymentId: paymentMethod.id,
        email: user?.email,
        userId: user?._id,
      };

      const response = await addPaymentCard(payload);

      if (response.status === 200 || response.status === 201) {
        getUserPaymentCards();
        showModal('success', 'Card added successfully');
      } else {
        showModal('error', response.data.message);
      }
    } catch (error) {
      console.log('Error creating payment method:', error);
      showModal('error', 'Something went wrong while adding card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = cardItem => {
    setModalData({
      type: 'confirmation',
      Icon: icons.alertIcon,
      name: 'Confirmation',
      detail: 'Are you sure you want to delete this card?',
      onConfirm: async () => {
        try {
          setIsLoading(true);
          const response = await deletePaymentCard({
            paymentId: cardItem?.paymentMethodId,
            userId: user?._id,
          });

          if (response.status === 200 || response.status === 201) {
            getUserPaymentCards();
            showModal('success', response.data.message);
          } else {
            showModal('error', response.data.message);
          }
        } catch (err) {
          console.error('Delete card error:', err);
          showModal('error', 'Something went wrong while deleting card');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const PaymentMethodItem = ({icon, label, selected, onPress}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: width(3),
        paddingHorizontal: width(4),
        justifyContent: 'space-between',
        backgroundColor: selected ? '#f0f0f0' : colors.white,
        borderRadius: 10,
        marginVertical: 4,
      }}
      onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={icon}
          style={{height: width(7), width: width(7)}}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 14,
            color: colors.black,
            fontFamily: fontFamily.poppinSemiBold,
            marginLeft: width(3),
          }}>
          {label}
        </Text>
      </View>
      {selected && (
        <View
          style={{
            height: width(4),
            width: width(4),
            borderRadius: 100,
            backgroundColor: colors.redish,
          }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <AppHeader text="Payment Options" goBack />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <ScrollView style={{flex: 1}}>
          {/* Select Credit/Debit Card */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: width(4),
              marginTop: width(4),
            }}>
            <TouchableOpacity
              onPress={() => setSelectedPaymentType('card')}
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
                    source={icons.cardIcon}
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
                  Credit Card / Debit Card
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
                {selectedPaymentType === 'card' && (
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

          {/* Stripe Card Input */}
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
              <TouchableOpacity
                disabled={!isCardValid || isLoading}
                onPress={handleSaveCard}
                style={{
                  marginTop: width(4),
                  backgroundColor:
                    !isCardValid || isLoading ? colors.gray : colors.redish,
                  paddingVertical: width(3),
                  borderRadius: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: fontFamily.poppinSemiBold,
                    fontSize: 14,
                  }}>
                  {isLoading ? 'Saving...' : 'Save Card'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Previously Saved Cards */}
          <View style={{paddingHorizontal: width(4), marginTop: width(4)}}>
            <Text
              style={{
                fontFamily: fontFamily.poppinMedium,
                fontSize: 12,
                paddingBottom: width(2),
              }}>
              Previously Saved Cards
            </Text>
            {paymentCards.length > 0 ? (
              paymentCards.map((item, index) => {
                const isSelected = wallet?._id === item?._id;
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
                          style={{
                            width: 50,
                            height: 30,
                            resizeMode: 'contain',
                          }}
                        />
                        <Image
                          source={icons.chipIcon}
                          style={{width: 50, height: 30, resizeMode: 'contain'}}
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

          {/* Google Pay */}
          {/* <PaymentMethodItem
          icon={icons.google}
          label="Google Pay"
          selected={selectedMethod === 'google'}
          onPress={() => handleSelectPayment('google')}
        /> */}

          {/* Apple Pay (iOS Only) */}
          {/* {Platform.OS === 'ios' && (
          <PaymentMethodItem
            icon={icons.apple}
            label="Apple Pay"
            selected={selectedMethod === 'apple'}
            onPress={() => handleSelectPayment('apple')}
          />
        )} */}
        </ScrollView>
        <CustomModal
          visible={modalVisible}
          Icon={modalData.Icon}
          name={modalData.name}
          detail={modalData.detail}
          buttonName={modalData.buttonName}
          onPress={modalData.onPress}
          close={() => {
            if (modalData?.disableClose) {
              return;
            }
            setModalVisible(false);
          }}
          type={modalData.type} // ← ye missing tha
          onConfirm={modalData.onPress} // ← ye bhi pass karein
          onCancel={modalData.onCancel} // ← aur ye
        />
      </SafeAreaView>
    </>
  );
};

export default PaymentOptions;
