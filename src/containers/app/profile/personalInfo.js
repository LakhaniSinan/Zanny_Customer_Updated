import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import OverLayLoader from '../../../components/loader';
import {helper} from '../../../helper';
import {setUserData} from '../../../redux/slices/Login';
import {
  getCustomerProfile,
  updateCustomerProfile,
} from '../../../services/profile';
import Button from './../../../components/button/index';
import Header from './../../../components/header/index';
import {colors} from './../../../constants/index';
('');

const PersonalInfo = ({navigation}) => {
  const disptach = useDispatch();
  let user = useSelector(state => state.LoginSlice.user);
  const [isVisible, setIsVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    name: '',
    email: '',
    phoneNum: '',
    address: '',
    password: '',
    customerImage: '',
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    setIsVisible(true);
    getCustomerProfile(user._id)
      .then(res => {
        setInputValue({
          name: res?.data?.data?.name,
          email: res?.data?.data?.email,
          phoneNum: res?.data?.data?.phoneNumber,
          address: res?.data?.data?.address,
          customerImage: res?.data?.data?.customerImage,
        });
        setIsVisible(false);
      })
      .catch(err => {
        setIsVisible(false);
      });
  };

  const showAlert = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteAccount()},
      ],
    );
  };
  const handleChangeText = (name, value) => {
    setInputValue({...inputValue, [name]: value});
  };

  const deleteAccount = () => {
    let payload = {
      isActive: 'Deleted',
    };
    setIsVisible(true);
    updateCustomerProfile(user?._id, payload)
      .then(response => {
        if (response.data.status == 'error') {
          setIsVisible(false);
          alert(response?.data.message);
        } else {
          setIsVisible(false);
          alert('Account deleted successfully');
          AsyncStorage.removeItem('user');
          disptach(setUserData(null));
          navigation.navigate('Restaurants');
        }
      })
      .catch(err => {
        setIsVisible(false);
      });
  };

  const handleUpdate = () => {
    const {name, phoneNum, address, customerImage} = inputValue;
    if (customerImage == '') {
      alert('Profile Image is required');
    } else if (name == '') {
      alert('Name is required');
    } else if (phoneNum == '') {
      alert('Phone number is required');
    } else if (address == '') {
      alert('Address is required');
    } else {
      const payload = {
        name,
        phoneNumber: phoneNum,
        address,
        customerImage,
      };
      setIsVisible(true);
      updateCustomerProfile(user?._id, payload)
        .then(response => {
          if (response.data.status == 'error') {
            setIsVisible(false);
            alert(response?.data.message);
          } else {
            alert(response?.data.message);
            setIsVisible(false);
            let newObj = {
              ...response.data.data,
            };
            AsyncStorage.setItem('user', JSON.stringify(newObj));
            disptach(setUserData(newObj));
          }
        })
        .catch(err => {
          setIsVisible(false);
        });
    }
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

    uploadFunction(params);
  };

  const uploadFunction = async params => {
    setIsLoading(true);
    try {
      let imageUrl = await helper.ImageUploadService(params);
      setInputValue({
        ...inputValue,
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
      if (inputValue.customerImage != '') {
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: inputValue?.customerImage}}
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
            <View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={{
                    uri: 'https://amberstore.pk/uploads/101593792-images.jpeg',
                  }}
                  style={{
                    width: width(30),
                    height: width(30),
                    borderRadius: 100,
                  }}
                />
              </View>
              <Text
                style={{
                  color: 'black',
                  marginTop: width(1),
                }}>
                Upload Profile Image
              </Text>
            </View>
          </>
        );
      }
    }
  };
  return (
    <>
      <OverLayLoader isloading={isVisible} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header goBack text={'Personal Information'} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: width(5)}}>
          <View style={{marginTop: width(5)}}>
            <TouchableOpacity
              onPress={handleUploadImage}
              style={{alignSelf: 'center'}}>
              {CheckImage()}
            </TouchableOpacity>
          </View>

          <View style={{marginTop: width(5)}}>
            <Text
              style={{
                marginTop: width(2),
                paddingHorizontal: width(2),
                color: colors.grey,
              }}>
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
                value={inputValue.name}
                placeholderTextColor={colors.grey}
                onChangeText={newText => handleChangeText('name', newText)}
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
                placeholder="user@gmail.com"
                editable={false}
                value={inputValue.email}
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
                value={inputValue.phoneNum}
                onChangeText={newText => handleChangeText('phoneNum', newText)}
                placeholderTextColor={colors.grey}
              />
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: colors.grey,
              }}></View>
          </View>
        </ScrollView>
        <View style={{marginBottom: width(2), color: colors.grey}}>
          <Button heading={'Update Profile'} onPress={handleUpdate} />
          <Button heading={'Delete Account'} onPress={showAlert} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default PersonalInfo;
