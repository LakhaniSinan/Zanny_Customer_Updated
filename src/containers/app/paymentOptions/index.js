import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import {width} from 'react-native-dimension';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
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
import {
  CardField,
  createToken,
  createPaymentMethod,
  StripeProvider,
} from '@stripe/stripe-react-native';
import {fontFamily, icons, images} from '../../../assets';

const PaymentOptions = ({navigation}) => {
  const dispatch = useDispatch();
  const [seletedPaymentType, setSeletedPaymentType] = useState('');
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );
  const [isCardValid, setIsCardValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentCards, setPaymentCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);
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
      alert('Card Selected Successfully');
      navigation.goBack();
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
    if (details.complete) {
      createTokenForStripe(details);
    }
  };

  const createTokenForStripe = async details => {
    try {
      setIsLoading(true);

      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: details, // <- THIS WAS WRONG EARLIER
      });

      if (error) {
        console.log('Payment Method Error:', error);
        return;
      }

      console.log('PaymentMethod:', paymentMethod);

      let payload = {
        paymentId: paymentMethod.id, // <- TOKEN NAHI PAYMENT METHOD
        email: user?.email,
        userId: user?._id,
      };

      const response = await addPaymentCard(payload);

      if (response.status === 200 || response.status === 201) {
        getUserPaymentCards();
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.log('Error creating payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PaymentMethodItem = ({icon, label, selected, onPress}) => (
    <TouchableOpacity style={styles.methodRow} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Image
          source={icon}
          style={{height: width(7), width: width(7)}}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.methodLabel}>{label}</Text>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  const handleDeleteCard = cardId => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoading(true);
            const response = await deletePaymentCard({
              paymentId: cardId?.paymentMethodId,
              userId: user?._id,
            });

            if (response.status === 200 || response.status === 201) {
              getUserPaymentCards(); // refresh list after delete
              Alert.alert('Success', response.data.message);
            } else {
              Alert.alert('Error', response.data.message);
            }
          } catch (err) {
            console.error('Delete card error:', err);
            Alert.alert('Something went wrong while deleting card');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <>
      <OverLayLoader isloading={isLoading} />

      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <AppHeader text="Payment Options" goBack />
        <View
          style={{
            height: width(20),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: width(4),
          }}>
          <TouchableOpacity
            onPress={() => setSeletedPaymentType('card')}
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
              {seletedPaymentType == 'card' && (
                <View
                  style={{
                    height: width(3),
                    width: width(3),
                    backgroundColor: colors.redish,
                    borderRadius: 100,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Stripe Card Input */}
        {seletedPaymentType == 'card' && (
          <View style={{paddingHorizontal: width(4)}}>
            <Text style={{fontFamily: fontFamily.poppinMedium, fontSize: 12}}>
              Add Card Details
            </Text>
            <StripeProvider
              publishableKey={STRIPE_PUBLISH_TEST}
              merchantIdentifier="merchant.com.yourapp">
              <CardField
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
          </View>
        )}
        <View style={{paddingHorizontal: width(4), marginTop: width(2)}}>
          <Text
            style={{
              fontFamily: fontFamily.poppinMedium,
              fontSize: 12,
              paddingBottom: width(2),
            }}>
            Previously Saved Card
          </Text>
          {paymentCards.length > 0 ? (
            paymentCards.map((item, index) => {
              const isSelected = wallet?._id === item?._id; // check if current card is selected

              return (
                <View
                  key={index + 12}
                  style={{
                    backgroundColor: '#FFA500', // Orange color for card
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
                  {/* Top row: Chip + Brand + Radio Button */}
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
                          marginRight: 10,
                        }}
                      />
                      <Image
                        source={icons.chipIcon}
                        style={{width: 50, height: 30, resizeMode: 'contain'}}
                      />
                    </View>

                    {/* Radio Button */}
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={() => handleSelectPayment('card', item)} // select card on press
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

                  {/* Card Number */}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 20,
                      letterSpacing: 2,
                      marginVertical: 10,
                    }}>
                    •••• •••• •••• {item?.last4?.toString().slice(-4)}
                  </Text>

                  {/* Bottom row: Expiry + CVV + Name */}
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
                        {item?.brand.toUpperCase() || 'Card Holder'}
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
                style={{fontWeight: 'bold', fontSize: 16, color: colors.black}}>
                No payment cards found
              </Text>
            </View>
          )}
        </View>
        {/* Apple Pay (iOS Only) */}
        {Platform.OS === 'ios' && (
          <PaymentMethodItem
            icon={icons.apple}
            label="Apple Pay"
            selected={selectedMethod === 'apple'}
            onPress={() => handleSelectPayment('apple')}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default PaymentOptions;
