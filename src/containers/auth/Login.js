import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {requestNotifications} from 'react-native-permissions';
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
      const {status} = await requestNotifications(['alert', 'sound', 'badge']);

      if (status === 'granted') {
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
    const messagingInstance = getMessaging();
    const token = await getToken(messagingInstance);
    setInputValues(prev => ({...prev, fcm: token}));
    onTokenRefresh(messagingInstance, newToken =>
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
      console.log('[GOOGLE] 1. start');

      await GoogleSignin.hasPlayServices();
      console.log('[GOOGLE] 2. play services OK');

      const result = await GoogleSignin.signIn();
      console.log(
        '[GOOGLE] 3. signIn result:',
        JSON.stringify(result, null, 2),
      );

      // v13+: cancel karne par throw nahi hota, type 'cancelled' aata hai
      if (result?.type !== 'success') {
        console.log('[GOOGLE] 3b. not success, type =', result?.type);
        showModal('error', 'You cancelled the Google login process.');
        return;
      }

      const {user, idToken} = result.data;
      console.log('[GOOGLE] 4. user:', user?.email, user?.name);

      if (!user?.email) {
        console.log('[GOOGLE] 4b. email missing in google response');
        showModal('error', 'Could not get email from Google account.');
        return;
      }

      const payload = {
        customerImage: user.photo,
        email: user.email,
        fcm: inputValues.fcm,
        isActive: 'Active',
        name: user.name,
        password: null,
        // idToken, // backend verify kare to uncomment karein
      };
      console.log('[GOOGLE] 5. payload:', JSON.stringify(payload, null, 2));

      const response = await socialLogin(payload);
      console.log('[GOOGLE] 6. API status:', response?.status);
      console.log(
        '[GOOGLE] 7. API data:',
        JSON.stringify(response?.data, null, 2),
      );

      const isHttpOk = response?.status === 200 || response?.status === 201;
      const isBackendError = response?.data?.status === 'error';

      if (isHttpOk && !isBackendError) {
        const userDetails = {
          ...response.data.data.userDetails,
          customerImage: user.photo,
        };

        await AsyncStorage.setItem('user_token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(setUserData(userDetails));
        console.log('[GOOGLE] 8. login success, navigating');

        navigation.reset({
          index: 0,
          routes: [
            {name: 'BottomStack', state: {index: 0, routes: [{name: 'Home'}]}},
          ],
        });
      } else {
        console.log('[GOOGLE] 8b. backend rejected:', response?.data?.message);
        showModal('error', response?.data?.message || 'Google login failed');
      }
    } catch (error) {
      console.log('[GOOGLE] ERROR code:', error?.code);
      console.log('[GOOGLE] ERROR message:', error?.message);
      console.log('[GOOGLE] ERROR http status:', error?.response?.status);
      console.log(
        '[GOOGLE] ERROR http data:',
        JSON.stringify(error?.response?.data, null, 2),
      );
      console.log('[GOOGLE] ERROR full:', error);

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        showModal('error', 'You cancelled the Google login process.');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        console.log('[GOOGLE] sign-in already in progress');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showModal('error', 'Play services not available or outdated.');
      } else if (error?.message === 'Network Error') {
        showModal(
          'error',
          'Server se connect nahi ho paa raha. Internet ya server check karein.',
        );
      } else {
        showModal(
          'error',
          error?.response?.data?.message ||
            error?.message ||
            'Google Sign-In error',
        );
      }
    } finally {
      setIsVisible(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleResponse.user,
      );
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
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
      showModal('error', 'Apple Sign-In error');
      console.log('Apple Sign-In error', err);
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
      {/* Social Login Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: width(5),
          marginTop: width(2),
        }}>
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={{
            height: width(13),
            width: '90%',
            borderRadius: width(7),
            flexDirection: 'row',
            gap: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.Google}
            resizeMode="contain"
            style={{height: width(6), width: width(6)}}
          />
          <Text style={{fontSize: 13, color: Colors.black}}>
            Login With Google
          </Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={handleAppleLogin}
            style={{
              height: width(13),
              width: '90%',
              borderRadius: width(7),
              flexDirection: 'row',
              gap: 10,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.apple}
              resizeMode="contain"
              style={{height: width(6), width: width(6)}}
            />
            <Text style={{fontSize: 13, color: Colors.black}}>
              Login With Apple
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Or Divider */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <View style={{flex: 1, height: 1, backgroundColor: Colors.softgray}} />
        <Text style={{marginHorizontal: 10, color: Colors.gray}}>Or</Text>
        <View style={{flex: 1, height: 1, backgroundColor: Colors.softgray}} />
      </View>

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
