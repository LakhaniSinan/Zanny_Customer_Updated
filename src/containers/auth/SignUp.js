import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import ImageCropPicker from 'react-native-image-crop-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../components/button';
import Header from '../../components/header';
import OverLayLoader from '../../components/loader';
import {colors} from '../../constants';
import {helper} from '../../helper';
import {sendCode} from '../../services/auth';

const SignUp = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    customerImage: '',
    fcm: '',
  });

  const [isSecure, setIsSecure] = useState(true);
  const [isSecureConfirm, setIsSecureConfirm] = useState(true);

  const handleChangeInputs = (name, value) => {
    setInputValues({...inputValues, [name]: value});
  };

  useEffect(() => {
    setInputValues({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      customerImage: '',
    });
  }, []);

  const handleSubmit = () => {
    const {name, email, password, phoneNumber, customerImage, fcm} =
      inputValues;
    if (name == '') {
      alert('Name is required');
    } else if (email == '') {
      alert('Email is required');
    } else if (password == '') {
      alert('Password is required');
    } else if (phoneNumber == '') {
      alert('Phone number is required');
    } else {
      let params = {
        email,
      };
      setIsVisible(true);
      sendCode(params)
        .then(res => {
          if (res.data.status == 'error') {
            alert(res.data.message);
            setIsVisible(false);
          } else {
            setIsVisible(false);
            alert(res.data.message);
            navigation.navigate('CodeVerification', {data: inputValues});
          }
        })
        .catch(err => {
          setIsVisible(false);
          console.log(err, 'errrror');
        });
    }
  };

  useEffect(() => {
    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      checkPermission();
    }
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      checkPermission();
    } catch (error) {}
  };

  const checkPermission = async () => {
    try {
      let enabled = await messaging().hasPermission();
      if (enabled) {
        getToken();
      } else {
        requestUserPermission();
      }
    } catch (error) {}
  };

  const getToken = async () => {
    let token = await messaging().getToken();
    setInputValues({...inputValues, fcm: token});
  };

  const handleUploadImage = async () => {
    let resssss = await ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });

    let params = {
      uri: resssss.path,
      type: resssss.mime,
      name: resssss.path,
    };

    console.log(params, 'paramsparamsparams');

    uploadFunction(params);
  };

  const uploadFunction = async params => {
    setIsLoading(true);
    try {
      let imageUrl = await helper.ImageUploadService(params);
      setInputValues({
        ...inputValues,
        customerImage: imageUrl,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'error');
    }
  };

  const CheckImage = () => {
    if (isloading) {
      return (
        <View
          style={{
            width: width(30),
            height: width(30),
            borderRadius: 100,
          }}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <ActivityIndicator size={'large'} color={colors.yellow} />
          </View>
        </View>
      );
    } else {
      if (inputValues.customerImage != '') {
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: inputValues?.customerImage}}
              style={{
                width: width(30),
                height: width(30),
                borderRadius: 100,
              }}
            />
          </View>
        );
      } else {
        return (
          <>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: width(10),
                borderRadius: 100,
                borderWidth: 0.3,
                borderColor: colors.grey,
                width: width(30),
                height: width(30),
                marginLeft: width(2),
              }}>
              <Entypo name="camera" size={30} color="black" />
            </View>
            <Text
              style={{
                color: 'black',
                marginTop: width(1),
              }}>
              Upload Profile Image
            </Text>
          </>
        );
      }
    }
  };

  return (
    <>
      <OverLayLoader isloading={isVisible} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header goBack text={'Sign Up'} />
        <ScrollView
          style={{marginBottom: width(5)}}
          showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', marginTop: width(3)}}>
            <Text style={{fontSize: 24, fontWeight: '600', color: colors.grey}}>
              Zannys Food
            </Text>
          </View>
          <View style={{marginTop: width(3)}}>
            <TouchableOpacity
              onPress={handleUploadImage}
              style={{alignSelf: 'center'}}>
              {CheckImage()}
            </TouchableOpacity>
          </View>

          <View style={{marginTop: width(5)}}>
            <Text style={{paddingHorizontal: width(2), color: colors.grey}}>
              Name
            </Text>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: colors.grey,
              }}>
              <TextInput
                style={{margin: width(2), color: colors.black}}
                placeholder="Enter your name"
                value={inputValues.name}
                onChangeText={value => handleChangeInputs('name', value)}
                placeholderTextColor={colors.grey}
              />
            </View>
            <Text
              style={{
                marginTop: width(2),
                paddingHorizontal: width(2),
                color: colors.grey,
              }}>
              Email
            </Text>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: colors.grey,
              }}>
              <TextInput
                style={{margin: width(2), color: colors.black}}
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
              Phone Number
            </Text>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: colors.grey,
              }}>
              <TextInput
                style={{margin: width(2), color: colors.black}}
                placeholder="Enter your phone number"
                keyboardType="numeric"
                value={inputValues.phoneNumber}
                onChangeText={value => handleChangeInputs('phoneNumber', value)}
                placeholderTextColor={colors.grey}
              />
            </View>

            <Text
              style={{
                marginTop: width(5),
                paddingHorizontal: width(2),
                color: colors.grey,
              }}>
              Password
            </Text>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: colors.grey,
                marginTop: width(2),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: width(4),
              }}>
              <View style={{width: '90%'}}>
                <TextInput
                  style={{margin: width(2), color: colors.black}}
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
          <View
            style={{
              marginTop: width(5),
              marginHorizontal: width(2),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: colors.grey}}>Already have an Account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  marginLeft: width(2),
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  fontWeight: '600',
                  color: colors.grey,
                }}>
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View
          style={{
            justifyContent: 'flex-end',
            marginVertical: width(2),
          }}>
          {isVisible ? (
            <ActivityIndicator color={colors.yellow} size={'large'} />
          ) : (
            <Button heading={'Sign Up'} onPress={handleSubmit} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default SignUp;
