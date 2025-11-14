import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';
import CustomInput from '../../components/customInput';
import CustomModal from '../../components/customModal';
import PrimaryButton from '../../components/primaryButton';
import {Colors} from '../../constants';
import {sendResetCodeCustomer} from '../../services/auth';
import OverLayLoader from '../../components/loader';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  const showModal = (type, message) => {
    setModalData({
      Icon: type === 'success' ? icons.check : icons.cross,
      name: type === 'success' ? 'Success' : 'Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => {
        setModalVisible(false);
        if (type === 'success') navigation.navigate('ResetPassword', {email});
      },
    });
    setModalVisible(true);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      return showModal('error', 'Please enter your email.');
    }

    setIsLoading(true);
    try {
      const response = await sendResetCodeCustomer({email: email.trim()});

      if (response.status === 200 || response.status === 201) {
        showModal(
          'success',
          'We’ve sent an OTP to your email! If you don’t see it in your inbox, check spam/promotions/junk folder.',
        );
      } else {
        showModal('error', response.data?.message || 'Failed to send OTP.');
      }
    } catch (error) {
      showModal(
        'error',
        error?.response?.data?.message || 'Something went wrong!',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: Colors.white}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: width(3)}}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            height: width(10),
            width: width(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image source={icons.ArrowLeft} style={{height: 20, width: 20}} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: Colors.black,
            marginTop: width(3),
          }}>
          Forgot Password
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: Colors.black,
            width: '90%',
            marginTop: width(1),
          }}>
          Enter the email associated with your account and we’ll send an email
          with code to reset your password
        </Text>

        <View style={{marginTop: width(5)}}>
          <CustomInput
            value={email}
            title={'Email'}
            onChangeText={setEmail}
            placeholder={'Enter your email'}
          />
        </View>
      </ScrollView>

      <View
        style={{
          height: width(20),
          width: '100%',
          padding: width(4),
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        }}>
        <PrimaryButton name={'Next'} onPress={handleForgotPassword} />
      </View>

      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />

      <OverLayLoader isloading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
