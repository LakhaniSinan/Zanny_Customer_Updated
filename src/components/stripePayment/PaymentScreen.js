import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CardField,
  StripeProvider,
  useStripe,
} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {icons} from '../../assets';
import {colors, STRIPE_PUBLISH_TEST} from '../../constants';
import {setCurrentPaymentCard} from '../../redux/slices/paymentCard';
import {setPaymentType} from '../../redux/slices/PaymentType';
import {getPaymentCardById} from '../../services/paymentCard';
import CustomModal from '../customModal';
import AppHeader from '../headerComponent';

const PaymentScreen = ({navigation, route}) => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  const [selectedMethod, setSelectedMethod] = useState('card'); // 'card' | 'google' | 'apple'
  const [cardDetails, setCardDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    title: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  const showError = message => {
    setModalData({
      Icon: icons.cross,
      title: 'Validation Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const onPayPress = async () => {
    if (selectedMethod === 'card') {
      // Validate card details
      if (!cardDetails?.complete) {
        Alert.alert('Error', 'Please enter valid card details');
        return;
      }
      // TODO: Call backend to create PaymentIntent, get clientSecret
      const clientSecret = await fetchClientSecretFromYourBackend(); // implement this

      setIsProcessing(true);
      const {paymentIntent, error} = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            // optionally add billing details
          },
        },
      });
      setIsProcessing(false);

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Payment succeeded', `ID: ${paymentIntent.id}`);
      }
    } else if (selectedMethod === 'google') {
      // Follow behaviour from Payment Options: select Google Pay as payment method
      // and return to previous screen (so order flow can continue using Google Pay)
      try {
        const payload = {cardNo: 'Google Pay'};
        await AsyncStorage.setItem('paymentCard', JSON.stringify(payload));
        await AsyncStorage.setItem('paymentType', JSON.stringify('Card'));
        dispatch(setCurrentPaymentCard(payload));
        dispatch(setPaymentType('Card'));
        Alert.alert('Selected', 'Google Pay selected');
        if (navigation && navigation.goBack) navigation.goBack();
      } catch (e) {
        console.log('Google select error', e);
      }
    } else if (selectedMethod === 'apple') {
      // Follow behaviour from Payment Options: select Apple Pay as payment method
      try {
        const payload = {cardNo: 'Apple Pay'};
        await AsyncStorage.setItem('paymentCard', JSON.stringify(payload));
        await AsyncStorage.setItem('paymentType', JSON.stringify('Card'));
        dispatch(setCurrentPaymentCard(payload));
        // keep payment type as Card (same as selecting saved card)
        dispatch(setPaymentType('Card'));
        Alert.alert('Selected', 'Apple Pay selected');
        if (navigation && navigation.goBack) navigation.goBack();
      } catch (e) {
        console.log('Apple select error', e);
      }
    }
  };

  const handleSelectGoogle = async () => {
    try {
      const payload = {cardNo: 'Google Pay'};
      await AsyncStorage.setItem('paymentCard', JSON.stringify(payload));
      await AsyncStorage.setItem('paymentType', JSON.stringify('Card'));
      dispatch(setCurrentPaymentCard(payload));
      dispatch(setPaymentType('Card'));
      Alert.alert('Selected', 'Google Pay selected');
      if (navigation && navigation.goBack) navigation.goBack();
    } catch (e) {
      console.log('Google select error', e);
    }
  };

  const handleSelectApple = async () => {
    try {
      const payload = {cardNo: 'Apple Pay'};
      await AsyncStorage.setItem('paymentCard', JSON.stringify(payload));
      await AsyncStorage.setItem('paymentType', JSON.stringify('Card'));
      dispatch(setCurrentPaymentCard(payload));
      dispatch(setPaymentType('Card'));
      Alert.alert('Selected', 'Apple Pay selected');
      if (navigation && navigation.goBack) navigation.goBack();
    } catch (e) {
      console.log('Apple select error', e);
    }
  };
  useEffect(() => {
    clientCards();
  }, []);

  const clientCards = async () => {
    try {
      const response = await getPaymentCardById(user?._id);
      console.log(response?.data, 'datadatadatadatadatadataasds121');
    } catch (error) {
      console.log(error, 'errorerrorerrorerrorerroralskdas');
    }
  };

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISH_TEST}
      merchantIdentifier="merchant.com.zannycustomer" // required for Apple Pay
    >
      <AppHeader goBack text="Payment" />
      <View style={styles.wrapper}>
        {/* Payment method selection */}
        <PaymentMethodItem
          icon={icons.cardIcon}
          label="Credit / Debit Card"
          selected={selectedMethod === 'card'}
          onPress={() => setSelectedMethod('card')}
        />
        <PaymentMethodItem
          icon={icons.Google}
          label="Google Pay"
          selected={selectedMethod === 'google'}
          onPress={handleSelectGoogle}
        />
        <PaymentMethodItem
          icon={icons.apple}
          label="Apple Pay"
          selected={selectedMethod === 'apple'}
          onPress={handleSelectApple}
        />

        {/* Card Input when card selected */}
        {selectedMethod === 'card' && (
          <View style={styles.cardFieldContainer}>
            <CardField
              postalCodeEnabled={false}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={styles.cardField}
              style={styles.cardContainer}
              onCardChange={setCardDetails}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.payButton}
          onPress={onPayPress}
          disabled={isProcessing}>
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.title}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />
    </StripeProvider>
  );
};

const PaymentMethodItem = ({icon, label, selected, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.methodRow}
      onPress={onPress}
      activeOpacity={0.7}>
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
};

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: colors.white, padding: 16},
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconWrapper: {
    width: width(10),
    height: width(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  methodLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#4A1F1F',
    fontWeight: '600',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#000',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  cardFieldContainer: {
    marginVertical: 20,
  },
  cardContainer: {
    height: 50,
    marginVertical: 10,
  },
  cardField: {
    backgroundColor: '#F7F7F7',
  },
  payButton: {
    backgroundColor: colors.themeColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;
