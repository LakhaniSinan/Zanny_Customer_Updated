import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';
import CustomModal from '../../components/customModal';
import OverLayLoader from '../../components/loader';
import PrimaryButton from '../../components/primaryButton';
import {Colors} from '../../constants';
import {
  registerCustomer,
  resetPasswordCustomer,
  sendCode,
} from '../../services/auth';

const CELL_COUNT = 4;

const CodeVerification = ({navigation, route}) => {
  const [value, setValue] = useState('');
  const data = route?.params;

  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const m = String(Math.floor(timer / 60)).padStart(2, '0');
    const s = String(timer % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const showError = message => {
    setModalData({
      Icon: icons.cross,
      name: 'Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const showSuccess = (message, navigateToLogin = false) => {
    setModalData({
      Icon: icons.check,
      name: 'Success',
      detail: message,
      buttonName: navigateToLogin ? 'Proceed to Login' : 'Okay',
      onPress: () => {
        setModalVisible(false);
        if (navigateToLogin) navigation.replace('Login');
      },
    });
    setModalVisible(true);
  };

  const VerifyCode = async () => {
    if (!value.trim()) return showError('Please enter the OTP.');

    let payload = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
      code: value,
    };

    try {
      setIsLoading(true);
      const response = await registerCustomer(payload);

      if (response.status === 200 || response.status === 201) {
        setValue('');
        showSuccess(response.data.message, true);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPass = async () => {
    if (!value.trim()) return showError('Please enter the OTP.');

    let payload = {
      email: data?.email,
      otp: value,
      password: data?.password,
    };

    console.log(payload, 'payloadpayloadpayloadpayloadpayload');

    try {
      setIsLoading(true);
      const response = await resetPasswordCustomer(payload);

      if (response.status === 200 || response.status === 201) {
        setValue('');
        showSuccess('Password reset successfully!', true);
      } else {
        showError(response.data?.message || 'Reset failed.');
      }
    } catch (error) {
      showError(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      const response = await sendCode({email: data?.email});

      if (response.status === 200 || response.status === 201) {
        setTimer(60);
        showSuccess('A new OTP has been sent to your email.');
      }
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <TouchableOpacity
        style={{
          height: width(13),
          width: width(13),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => navigation.goBack()}>
        <Image source={icons.ArrowLeft} style={{height: 20, width: 20}} />
      </TouchableOpacity>

      <View style={{marginLeft: 15}}>
        <Text style={{fontSize: 24, fontWeight: '500', color: Colors.black}}>
          Verify OTP
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: Colors.grayyy,
            marginTop: width(2),
          }}>
          Enter the OTP that was sent to your email.
        </Text>
      </View>

      <View style={{paddingHorizontal: 65, marginTop: 40}}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          renderCell={({index, symbol, isFocused}) => (
            <View
              key={index}
              style={{
                width: 48,
                height: 48,
                borderWidth: 1,
                borderRadius: 13,
                borderColor: isFocused ? Colors.grayyy : Colors.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 20, fontWeight: '500', color: Colors.black}}>
                {symbol || (isFocused ? <Cursor /> : '')}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={{gap: 5, alignItems: 'center', marginTop: 30}}>
        <Text style={{fontSize: 12, fontWeight: '400', color: Colors.grayyy}}>
          A code has been sent to your email
        </Text>

        {timer > 0 ? (
          <Text style={{fontSize: 14, fontWeight: '500', color: Colors.orange}}>
            Resend in {formatTime()}
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <Text
              style={{fontSize: 14, fontWeight: '500', color: Colors.orange}}>
              Resend Code
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{height: width(15), margin: width(4)}}>
        <PrimaryButton
          name="Verify Code"
          onPress={data?.type === 'forgot' ? handleForgotPass : VerifyCode}
        />
      </View>

      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onConfirm={modalData.onPress}
        close={() => setModalVisible(false)}
      />

      <OverLayLoader isloading={isLoading} />
    </View>
  );
};

export default CodeVerification;
