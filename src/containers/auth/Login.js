import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch} from 'react-redux';
import {icons} from '../../assets';
import CustomInput from '../../components/customInput';
import CustomModal from '../../components/customModal';
import OverLayLoader from '../../components/loader';
import PrimaryButton from '../../components/primaryButton';
import {Colors, colors} from '../../constants';
import {setUserData} from '../../redux/slices/Login';
import {loginCustomer, socialLogin} from '../../services/auth';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [isRemberChecked, setIsRemberChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
    fcm: '',
  });
  console.log(inputValues, 'inputValuesinputValuesinputValues');

  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  const showModal = (type, message, callback) => {
    setModalData({
      Icon: type === 'success' ? icons.check : icons.cross,
      name: type === 'success' ? 'Success' : 'Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => {
        setModalVisible(false);
        if (callback) callback();
      },
    });
    setModalVisible(true);
  };

  const handleChangeInputs = (name, value) => {
    setInputValues(prev => ({...prev, [name]: value}));
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        Platform.OS === 'android'
          ? '929084652852-7bbnc57abdai3ho7lh2sqk6371jdp9r4.apps.googleusercontent.com'
          : '929084652852-294nak4mtq2cvtguqeq84o8ci9h38stq.apps.googleusercontent.com',
      profileImageSize: 120,
    });
  }, []);

  useEffect(() => {
    // request(PERMISSIONS.IOS.NOTIFICATIONS).then(status => {
    //   console.log('Notification permission status:', status);
    // });
    requestUserPermission();
  }, []);
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('NOTIFICATION PERMISSION GRANTED');
        await initFCM();
      } else {
        console.log('NOTIFICATION PERMISSION DENIED');
      }
    } catch (error) {
      console.log('PERMISSION ERROR:', error);
    }
  };

  const initFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    setInputValues(prev => ({...prev, fcm: token}));
    messaging().onTokenRefresh(newToken =>
      setInputValues(prev => ({...prev, fcm: newToken})),
    );
  };

  const onPressLogin = async () => {
    const {email, password, fcm} = inputValues;

    if (!email) return showModal('error', 'Email is required');
    if (!password) return showModal('error', 'Password is required');

    setIsVisible(true);
    try {
      const response = await loginCustomer({email, password, fcm});
      if (response.data.status === 'error') {
        showModal('error', response.data.message);
      } else {
        const user = response.data.data.userDetails;
        await AsyncStorage.setItem('user_token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        dispatch(setUserData(user));
        navigation.reset({
          index: 0,
          routes: [
            {name: 'BottomStack', state: {index: 0, routes: [{name: 'Home'}]}},
          ],
        });
      }
    } catch (err) {
      showModal('error', 'Login failed. Please try again.');
      console.log('Login error', err);
    } finally {
      setIsVisible(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsVisible(true);

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const userInfo = await GoogleSignin.signIn();
      const googleUser = userInfo?.data?.user;
      console.log(userInfo, 'Google sign-in response');

      const payload = {
        customerImage: googleUser?.photo,
        email: googleUser?.email,
        fcm: inputValues.fcm,
        isActive: 'Active',
        name: googleUser?.name,
        password: null,
      };
      console.log(payload, 'Google login payload');

      const response = await socialLogin(payload);
      if (response.status === 200 || response.status === 201) {
        const user = {
          ...response.data.data.userDetails,
          customerImage: googleUser?.photo,
        };
        await AsyncStorage.setItem('user_token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        dispatch(setUserData(user));
        navigation.reset({
          index: 0,
          routes: [
            {name: 'BottomStack', state: {index: 0, routes: [{name: 'Home'}]}},
          ],
        });
      } else {
        showModal('error', response?.data?.message || 'Google login failed');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED)
        showModal('error', 'You cancelled the Google login process.');
      else if (error.code === statusCodes.IN_PROGRESS)
        console.log('Sign-in in progress');
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        showModal('error', 'Play services not available or outdated.');
      else showModal('error', 'Google Sign-In error');
    } finally {
      setIsVisible(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsVisible(true);

      // Check if Apple Auth is available on this device
      if (!appleAuth.isSupported) {
        showModal('error', 'Apple Sign-In is not supported on this device');
        setIsVisible(false);
        return;
      }

      // Try using imported constants, fallback to numeric values if undefined
      const LOGIN_OPERATION = AppleAuthRequestOperation?.LOGIN ?? 0;
      const EMAIL_SCOPE = AppleAuthRequestScope?.EMAIL ?? 0;
      const FULL_NAME_SCOPE = AppleAuthRequestScope?.FULL_NAME ?? 1;
      const AUTHORIZED_STATE = AppleAuthCredentialState?.AUTHORIZED ?? 1;

      const appleResponse = await appleAuth.performRequest({
        requestedOperation: LOGIN_OPERATION,
        requestedScopes: [EMAIL_SCOPE, FULL_NAME_SCOPE],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleResponse.user,
      );
      if (credentialState === AUTHORIZED_STATE) {
        const {email, fullName, identityToken} = appleResponse;
        const payload = {
          name: fullName,
          email: email || '',
          identityToken,
          image: '',
        };
        const response = await socialLogin(payload);
        if (response.status === 200 || response.status === 201) {
          const user = response.data.data.userDetails;
          await AsyncStorage.setItem('user_token', response.data.data.token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          dispatch(setUserData(user));
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'BottomStack',
                state: {index: 0, routes: [{name: 'Home'}]},
              },
            ],
          });
        } else
          showModal('error', response?.data?.message || 'Apple login failed');
      } else showModal('error', 'Apple authorization failed');
    } catch (err) {
      console.log(err, 'errerrerrerrerrerrerrerrqewd');

      if (err.code === 'ERR_REQUEST_CANCELED' || err.code === 1001) {
        // User cancelled, don't show error
        console.log('Apple Sign-In cancelled by user');
      } else if (err.code === 1000 || err.message?.includes('error 1000')) {
        // Error 1000: Configuration issue
        showModal(
          'error',
          'Apple Sign-In is not properly configured. Please ensure:\n\n1. "Sign in with Apple" capability is enabled in Xcode\n2. App is configured in Apple Developer portal\n3. Testing on a real device (not simulator)',
        );
      } else {
        showModal(
          'error',
          err.message || 'Apple Sign-In error. Please try again.',
        );
        console.log('Apple Sign-In error', err);
      }
    } finally {
      setIsVisible(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'BottomStack',
                state: {index: 0, routes: [{name: 'Home'}]},
              },
            ],
          })
        }
        style={{
          height: width(13),
          width: width(13),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={icons.ArrowLeft}
          resizeMode="contain"
          style={{height: width(5), width: width(5)}}
        />
      </TouchableOpacity>

      {/* Header */}
      <View style={{marginLeft: 15, marginTop: 15}}>
        <Text style={{fontSize: 24, fontWeight: '500', color: Colors.black}}>
          Welcome Back
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: Colors.black,
            marginTop: 4,
          }}>
          Sign in to enjoy your favourite meals
        </Text>
      </View>

      {/* Inputs */}
      <View style={{paddingHorizontal: width(3), marginTop: width(10)}}>
        <CustomInput
          title="Email"
          placeholder="Type your email"
          onChangeText={v => handleChangeInputs('email', v)}
          value={inputValues.email}
        />
      </View>
      <View style={{paddingHorizontal: width(3), marginTop: width(2)}}>
        <CustomInput
          title="Password"
          placeholder="Type your password"
          onChangeText={v => handleChangeInputs('password', v)}
          value={inputValues.password}
          Icon={icons.Hide}
        />
      </View>

      {/* Remember Me / Forgot */}
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: width(10),
          paddingHorizontal: width(3),
        }}>
        <TouchableOpacity
          onPress={() => setIsRemberChecked(!isRemberChecked)}
          style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <View
            style={{
              height: width(5),
              width: width(5),
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}>
            {isRemberChecked && (
              <Image
                source={icons.Checkbox}
                resizeMode="cover"
                style={{height: '100%', width: '100%'}}
              />
            )}
          </View>
          <Text style={{fontSize: 12, fontWeight: 400, color: Colors.black}}>
            Remember me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: Colors.black,
              textDecorationLine: 'underline',
            }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: width(15),
          width: '100%',
          marginTop: width(6),
          paddingHorizontal: width(3),
        }}>
        <PrimaryButton name="login" onPress={onPressLogin} />
      </View>

      {/* Or Divider */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <View style={{flex: 1, height: 1, backgroundColor: Colors.softgray}} />
        <Text style={{marginHorizontal: 10}}>Or</Text>
        <View style={{flex: 1, height: 1, backgroundColor: Colors.softgray}} />
      </View>

      {/* Google Login Button */}
      <View
        style={{
          height: width(15),
          width: '100%',
          marginTop: width(2),
          paddingHorizontal: width(3),
        }}>
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: Colors.white,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
          <Image
            source={icons.Google}
            resizeMode="contain"
            style={{height: width(6), width: width(6)}}
          />
          <Text style={{fontSize: 16, fontWeight: '500', color: Colors.black}}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      {/* Apple Login Button - iOS Only */}
      {/* {Platform.OS === 'ios' && (
        <View
          style={{
            height: width(15),
            width: '100%',
            marginTop: width(2),
            paddingHorizontal: width(3),
          }}>
          <TouchableOpacity
            onPress={handleAppleLogin}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: Colors.black,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.black,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <Image
              source={icons.apple}
              resizeMode="contain"
              style={{height: width(6), width: width(6)}}
            />
            <Text
              style={{fontSize: 16, fontWeight: '500', color: Colors.white}}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>
      )} */}

      {/* Register Link */}
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          marginTop: width(3),
        }}>
        <Text style={{fontSize: 13, fontWeight: 500, color: Colors.grayyy}}>
          Don’t have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: Colors.black,
              textDecorationLine: 'underline',
            }}>
            Register
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loader & Modal */}
      <OverLayLoader isloading={isVisible} />
      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />
    </View>
  );
};

export default Login;
