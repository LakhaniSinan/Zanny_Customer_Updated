import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {icons} from '../../assets';
import CustomInput from '../../components/customInput';
import PrimaryButton from '../../components/primaryButton';
import {Colors} from '../../constants';
import {setUserData} from '../../redux/slices/Login';

import messaging from '@react-native-firebase/messaging';
import {statusCodes} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';
import {loginCustomer, socialLogin} from '../../services/auth';

import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import OverLayLoader from '../../components/loader';
import AppHeader from '../../components/headerComponent';
import {CommonActions} from '@react-navigation/native';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [isSecure, setIsSecure] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
    fcm: '',
  });

  const handleChangeInputs = (name, value) => {
    setInputValues({...inputValues, [name]: value});
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
      .then(({status}) => {
        if (status !== 'granted') {
          requestNotifications(['alert', 'sound']).then(
            ({status: statusssss, settings}) => {
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
        setInputValues({...inputValues, fcm: token});
      } else {
        requestUserPermission();
      }
    } catch (error) {
      console.log(error, 'immmmmmmmmmmmmmmmmmmmm');
    }
  };

  useEffect(() => {
    getToken;
    setTimeout(() => {
      requestNotificationPermissions();
    }, 1000);
  }, []);

  const getToken = async () => {
    let token = await messaging().getToken();
    setInputValues({...inputValues, fcm: token});
  };

  const onPress = () => {
    const {email, password, fcm} = inputValues;
    if (email === '') {
      Alert.alert('Email is required');
    } else if (password === '') {
      Alert.alert('Password is required');
    } else {
      let payload = {email, password, fcm};
      setIsVisible(true);
      loginCustomer(payload)
        .then(response => {
          console.log(response, 'responseresponseresponseresponseresponse');

          if (response.data.status === 'error') {
            setIsVisible(false);
            Alert.alert(response?.data?.message);
          } else {
            setInputValues({email: '', password: ''});
            let newObj = {...response.data.data.userDetails};
            console.log(newObj, 'newObjnewObjnewObjnewObj');
            AsyncStorage.setItem('user_token', response.data.data.token);
            AsyncStorage.setItem('user', JSON.stringify(newObj));
            dispatch(setUserData(newObj));
            navigation.reset({
              index: 0,
              routes: [{name: 'UserAllergies'}],
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
            routes: [{name: 'UserAllergies'}],
          });
        } else {
          console.log(response.data, 'responseresponseresponse');
          Alert.alert(response?.data?.message);
        }
      } else {
        Alert.alert('Google login canclled');
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
        const {email, fullName, identityToken, nonce} =
          appleAuthRequestResponse;

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
          // navigation.reset({
          //   index: 0,
          //   routes: [{name: 'UserAllergies'}],
          // });
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
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <TouchableOpacity
        style={{
          height: width(13),
          width: width(13),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'BottomStack',
                state: {
                  index: 0,
                  routes: [{name: 'Home'}],
                },
              },
            ],
          });
        }}>
        <Image
          source={icons.ArrowLeft}
          resizeMode="contain"
          style={{
            height: width(5),
            width: width(5),
          }}
        />
      </TouchableOpacity>
      <View style={{marginLeft: 15}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 15,
          }}>
          <Text style={{fontSize: 24, fontWeight: 500, color: Colors.black}}>
            Welcome Back
          </Text>
          <Image
            source={icons.hi}
            resizeMode="contain"
            style={{height: 24, width: 24}}
          />
        </View>
        <Text style={{fontSize: 12, fontWeight: 400, color: Colors.black}}>
          Sign in to enjoy your favourite meals
        </Text>
      </View>
      <View style={{paddingHorizontal: width(3), marginTop: width(10)}}>
        <CustomInput
          title={'Email'}
          placeholder={'Type your email'}
          onChangeText={v => handleChangeInputs('email', v)}
          value={inputValues.email}
        />
      </View>
      <View style={{paddingHorizontal: width(3), marginTop: width(2)}}>
        <CustomInput
          title={'Password'}
          placeholder={'Type your password'}
          onChangeText={v => handleChangeInputs('password', v)}
          value={inputValues.password}
          Icon={icons.Hide}
        />
      </View>

      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: width(10),
          paddingHorizontal: width(3),
        }}>
        <View style={{flexDirection: 'row', gap: 8}}>
          <Image
            source={icons.Checkbox}
            resizeMode="contain"
            style={{height: 15, width: 15}}
          />
          <Text style={{fontSize: 12, fontWeight: 400, color: Colors.black}}>
            Remember me
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 400,
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
        <PrimaryButton name={'login'} onPress={onPress} />
      </View>
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
      <View
        style={{
          height: width(15),
          width: '100%',
          marginTop: width(2),
          paddingHorizontal: width(3),
        }}>
        <PrimaryButton
          name={'Continue with Google'}
          bgcColor={Colors.white}
          color={Colors.black}
          Icon={icons.Google}
          borderColor={Colors.border}
          onPress={handleGoogleLogin}
        />
      </View>
      {Platform.OS == 'ios' && (
        <View
          style={{
            height: width(15),
            width: '100%',
            marginTop: width(2),
            paddingHorizontal: width(3),
          }}>
          <PrimaryButton
            name={'Continue with Apple'}
            bgcColor={Colors.white}
            color={Colors.black}
            borderColor={Colors.border}
            Icon={icons.apple}
            onPress={handleAppleLogin}
          />
        </View>
      )}
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
      <OverLayLoader isloading={isVisible} />
    </View>
  );
};

export default Login;
