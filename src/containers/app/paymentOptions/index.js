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
  getPaymentCardById,
} from '../../../services/paymentCard';
import {
  CardField,
  createToken,
  StripeProvider,
} from '@stripe/stripe-react-native';
import {icons} from '../../../assets';

const PaymentOptions = ({navigation}) => {
  const dispatch = useDispatch();
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );
  const [isCardValid, setIsCardValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null); // 'card' | 'google' | 'apple'
  const [paymentCards, setPaymentCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);
  // Fetch saved cards
  useFocusEffect(
    React.useCallback(() => {
      getUserPaymentCards();
    }, []),
  );

  const getUserPaymentCards = async () => {
    setIsLoading(true);
    getPaymentCardById(user._id)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status === 'ok') {
          const cards = response?.data?.data;
          const updated = cards.map(item => ({
            ...item,
            isSelected: wallet?._id === item._id,
          }));
          setPaymentCards(updated);
        }
      })
      .catch(() => setIsLoading(false));
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
    if (!details.complete) return;
    try {
      setIsLoading(true);
      const tokenResponse = await createToken({type: 'Card', ...details});
      if (tokenResponse.error) {
        console.error('Token creation failed', tokenResponse.error);
        return;
      }
      console.log(
        tokenResponse.token,
        'tokenResponsetokentokenResponsetokentokenResponsetoken',
      );
      let payload = {
        cardName: tokenResponse.token?.card?.brand,
        cardNo: tokenResponse.token?.card.last4,
        expiryMonth: tokenResponse.token?.card.expMonth,
        expiryYear: tokenResponse.token?.card.expYear,
        userId: user?._id,
      };
      const response = await addPaymentCard(payload);
      if (response.status == 200 || response.status == 201) {
        getUserPaymentCards();
      } else {
        alert('Error', response.data.message);
      }
      console.log(response, 'responseresponseresponseresponseresponse');
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating token:', error);
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

  return (
    <>
      <OverLayLoader isloading={isLoading} />

      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <AppHeader text="Payment Options" goBack />

        {/* Stripe Card Input */}
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
            }}
            style={{
              width: '92%',
              height: 60,
              alignSelf: 'center',
              marginTop: width(4),
            }}
            onCardChange={handleCardChange}
          />
        </StripeProvider>

        {/* Add New Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: width(4),
            marginHorizontal: width(2),
            justifyContent: 'space-between',
          }}
          onPress={() =>
            navigation.navigate('AddEditPaymentCard', {type: 'add'})
          }>
          <Text style={{color: colors.black, fontWeight: '600'}}>
            Add Credit or Debit Card
          </Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            color={colors.black}
          />
        </TouchableOpacity>

        {/* Saved Cards */}
        {paymentCards.length > 0 ? (
          paymentCards.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: width(2),
                marginHorizontal: width(2),
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: colors.orangeColor,
                  borderRadius: 12,
                  padding: width(4),
                  marginRight: width(2),
                  elevation: 3,
                }}
                onPress={() =>
                  navigation.navigate('AddEditPaymentCard', {
                    type: 'edit',
                    detail: item,
                  })
                }>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {item?.cardName}
                </Text>
                <Text style={{color: colors.white, marginTop: 4, fontSize: 14}}>
                  •••• {item?.cardNo.toString().slice(12, 16)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPayment('card', item)}
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.black,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: item?.isSelected
                    ? colors.yellow
                    : colors.white,
                }}
              />
            </View>
          ))
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
