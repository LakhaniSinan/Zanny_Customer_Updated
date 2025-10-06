import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { width } from 'react-native-dimension';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { images } from '../../assets';
import Button from '../../components/button';
import Header from '../../components/header';
import { colors } from '../../constants';
import { setUserData } from '../../redux/slices/Login';
import { loginCustomer, socialLogin } from '../../services/auth';

import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isSecure, setIsSecure] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
    fcm: '',
  });

  const handleChangeInputs = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        Platform.OS == 'android'
          ? '929084652852-7bbnc57abdai3ho7lh2sqk6371jdp9r4.apps.googleusercontent.com'
          : '929084652852-294nak4mtq2cvtguqeq84o8ci9h38stq.apps.googleusercontent.com',
      profileImageSize: 120,
    });
  }, []);

  const requestNotificationPermissions = () => {
    checkNotifications()
      .then(({ status }) => {
        if (status !== 'granted') {
          requestNotifications(['alert', 'sound']).then(
            ({ status: statusssss, settings }) => {
              if (Platform.OS == 'ios') {
                requestUserPermission();
              } else {
                checkPermission();
              }
            },
          );
        } else {
          if (Platform.OS == 'ios') {
            requestUserPermission();
          } else {
            checkPermission();
          }
        }
      })
      .catch(errorrrr => {
        console.log(errorrrr, 'NOTIFICATION_ERRORRRRR');
      });
  };

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      checkPermission();
    } catch (error) {
      console.log(error, 'erorroorororoorororororo');
    }
  };

  const checkPermission = async () => {
    try {
      let enabled = await messaging().hasPermission();
      if (enabled) {
        let token = await messaging().getToken();
        setInputValues({ ...inputValues, fcm: token });
      } else {
        requestUserPermission();
      }
    } catch (error) {
      console.log(error, 'immmmmmmmmmmmmmmmmmmmm');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestNotificationPermissions();
    }, 1000);
  }, []);

  const getToken = async () => {
    let token = await messaging().getToken();
    setInputValues({ ...inputValues, fcm: token });
  };

  const onPress = () => {
    const { email, password, fcm } = inputValues;
    if (email === '') {
      Alert.alert('Email is required');
    } else if (password === '') {
      Alert.alert('Password is required');
    } else {
      let payload = { email, password, fcm };
      setIsVisible(true);
      loginCustomer(payload)
        .then(response => {
          if (response.data.status === 'error') {
            setIsVisible(false);
            Alert.alert(response?.data?.message);
          } else {
            setInputValues({ email: '', password: '' });
            let newObj = { ...response.data.data.userDetails };
            console.log(newObj, 'newObjnewObjnewObjnewObj');
            AsyncStorage.setItem('user_token', response.data.data.token);
            AsyncStorage.setItem('user', JSON.stringify(newObj));
            dispatch(setUserData(newObj));
            navigation.reset({
              index: 0,
              routes: [{ name: 'UserAllergies' }],
            });
            setIsVisible(false);
          }
        })
        .catch(err => {
          console.log(err, 'Login error');
          setIsVisible(false);
        });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsVisible(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let payload = {
        customerImage: userInfo?.data?.user?.photo,
        email: userInfo?.data?.user?.email,
        fcm: inputValues.fcm,
        isActive: 'Active',
        name: userInfo?.data?.user?.name,
        password: null,
      };
      if (userInfo.type == 'success') {
        const response = await socialLogin(payload);

        if (response.status == 200 || response.status == 201) {
          let newObj = {
            ...response.data.data.userDetails,
            customerImage: userInfo?.data?.user?.photo,
          };

          AsyncStorage.setItem('user_token', response.data.data.token);
          AsyncStorage.setItem('user', JSON.stringify(newObj));
          dispatch(setUserData(newObj));

          navigation.reset({
            index: 0,
            routes: [{ name: 'UserAllergies' }],
          });
        } else {
          console.log(response.data, 'responseresponseresponse');
          Alert.alert(response?.data?.message);
        }
      } else {
        Alert.alert('Google login canclled')
      }

    } catch (error) {
      setIsVisible(false);
      console.log(error, 'Google Sign-In error');

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
        Alert.alert(
          'Login Cancelled',
          'You cancelled the Google login process.',
        );
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation (e.g., sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Some other error occurred', error);
      }
    } finally {
      setIsVisible(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        const { email, fullName, identityToken, nonce } =
          appleAuthRequestResponse;
        console.log(
          appleAuthRequestResponse,
          'appleAuthRequestResponseappleAuthRequestResponse',
        );

        let params = {
          name: fullName,
          email: '',
          // fcm: inputVal.token,
          image: '',
          identityToken,
        };
        let params2 = {
          identityToken,
        };
        const response = await socialLogin(email == null ? params2 : params);
        setIsVisible(false);
        if (response.status == 200 || response.status == 201) {
          let newObj = {
            ...response.data.data.userDetails,
          };
          AsyncStorage.setItem('user_token', response.data.data.token);
          AsyncStorage.setItem('user', JSON.stringify(newObj));
          dispatch(setUserData(newObj));
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserAllergies' }],
          });
        } else {
          Alert.alert(response?.data?.message);
        }
      } else {
        console.log('errrrrr');
      }
    } catch (error) {
      console.log('errrrrr', error);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <Header text={'Sign In'} goBack />
        <View style={{ alignItems: 'center', marginTop: width(3) }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colors.grey }}>
            Zannys Food
          </Text>
        </View>
        <View style={{ marginTop: width(5) }}>
          <Text style={{ paddingHorizontal: width(2), color: colors.grey }}>
            Email
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(3),
            }}>
            <TextInput
              style={{ margin: width(2), color: colors.black }}
              placeholder="Enter your email"
              value={inputValues.email}
              onChangeText={value => handleChangeInputs('email', value)}
              placeholderTextColor={colors.grey}
            />
          </View>
          <Text
            style={{
              marginTop: width(2),
              paddingHorizontal: width(2),
              color: colors.grey,
            }}>
            Password
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(3),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: width(4),
            }}>
            <View style={{ width: '90%' }}>
              <TextInput
                style={{ margin: width(2), color: colors.black }}
                placeholder="Enter your password"
                secureTextEntry={isSecure}
                value={inputValues.password}
                onChangeText={value => handleChangeInputs('password', value)}
                placeholderTextColor={colors.grey}
              />
            </View>
            <Feather
              name={isSecure ? 'eye-off' : 'eye'}
              size={width(5)}
              color={colors.grey}
              onPress={() => setIsSecure(!isSecure)}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{
            alignSelf: 'flex-end',
            marginRight: width(5),
            marginBottom: width(5),
            marginTop: width(3),
          }}>
          <Text
            style={{
              fontSize: 16,
              textDecorationLine: 'underline',
              fontWeight: '600',
              color: colors.grey,
            }}>
            Forgot Password
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: width(5),
            marginHorizontal: width(2),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{ color: colors.black }}>Don't have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={{
                marginLeft: width(2),
                fontSize: 16,
                textDecorationLine: 'underline',
                fontWeight: '600',
                color: colors.grey,
              }}>
              Register Here
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: width(3),
          }}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={{
              height: width(18),
              width: width(18),
            }}>
            <Image
              source={images.googleIcon}
              resizeMode="contain"
              style={{ height: '100%', width: '100%' }}
            />
          </TouchableOpacity>
          {Platform.OS == 'ios' && (
            <TouchableOpacity
              onPress={handleAppleLogin}
              style={{
                height: width(14),
                width: width(14),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: width(2),
                shadowColor: '#000',
                padding: width(2),
                borderRadius: 100,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: colors.white,
                alignSelf: 'center',
              }}>
              <Image
                source={images.appleIcon}
                resizeMode="contain"
                style={{ height: '100%', width: '100%' }}
              />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{ justifyContent: 'flex-end', flex: 1, marginBottom: width(2) }}>
          {isVisible ? (
            <ActivityIndicator color={colors.yellow} size={'large'} />
          ) : (
            <Button heading={'Sign In'} onPress={onPress} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Login;