import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../../components/button';
import CustomInput from '../../../components/customInput';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {Colors} from '../../../constants';
import {helper} from '../../../helper';
import {setUserData} from '../../../redux/slices/Login';
import {
  getCustomerProfile,
  updateCustomerProfile,
} from '../../../services/profile';

function PersonalInfo({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.LoginSlice.user);

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [inputValue, setInputValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNum: '',
    customerImage: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setIsVisible(true);
    getCustomerProfile(user?._id)
      .then(res => {
        let d = res?.data?.data;
        console.log(d, 'ddddddddddddddddddddddd');

        setInputValue({
          firstName: d?.name?.split(' ')[0] ?? '',
          lastName: d?.name?.split(' ')[1] ?? '',
          email: d?.email ?? '',
          phoneNum: d?.phoneNumber ?? '',
          customerImage: d?.customerImage ?? '',
        });
        setIsVisible(false);
      })
      .catch(() => setIsVisible(false));
  };

  const handleChange = (name, value) => {
    setInputValue(prev => ({...prev, [name]: value}));
  };

  const handleUploadImage = async () => {
    try {
      const img = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      const params = {
        uri: img.path,
        type: img.mime,
        name: 'profile.jpg',
      };

      uploadToServer(params);
    } catch (e) {}
  };

  const uploadToServer = async img => {
    try {
      setIsLoadingImage(true);

      let url = await helper.ImageUploadService(img);

      setInputValue(prev => ({
        ...prev,
        customerImage: url,
      }));

      setIsLoadingImage(false);
    } catch (e) {
      setIsLoadingImage(false);
    }
  };

  const handleUpdate = () => {
    const {firstName, lastName, phoneNum, customerImage} = inputValue;

    if (!customerImage) return alert('Please upload profile image');
    if (!firstName) return alert('First name is required');
    if (!lastName) return alert('Last name is required');
    if (!phoneNum) return alert('Phone number required');

    const payload = {
      name: `${firstName} ${lastName}`,
      phoneNumber: phoneNum,
      customerImage,
    };

    setIsVisible(true);

    updateCustomerProfile(user?._id, payload)
      .then(res => {
        alert(res?.data?.message);
        AsyncStorage.setItem('user', JSON.stringify(res?.data?.data));
        dispatch(setUserData(res?.data?.data));
        setIsVisible(false);
      })
      .catch(e => {
        setIsVisible(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <OverLayLoader isloading={isVisible} />

      <AppHeader
        goBack={true}
        text="Personal Information"
        notificationsIcon={true}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: width(8),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{position: 'relative'}}>
            <Image
              source={{
                uri: inputValue.customerImage,
              }}
              style={{
                width: width(25),
                height: width(25),
                borderRadius: 100,
              }}
            />

            <TouchableOpacity
              onPress={handleUploadImage}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: Colors.black,
                padding: width(1.8),
                borderRadius: 50,
              }}>
              <Text style={{color: Colors.white}}>✎</Text>
            </TouchableOpacity>

            {isLoadingImage && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#00000030',
                  borderRadius: 100,
                }}>
                <ActivityIndicator size="large" color={Colors.black} />
              </View>
            )}
          </View>

          <Text
            style={{
              marginTop: width(2),
              color: Colors.grey,
              fontSize: width(3.2),
            }}>
            Choose a Memoji or upload an image.
          </Text>

          <View
            style={{
              marginTop: width(3),
              flexDirection: 'row',
              gap: width(3),
            }}>
            {[1, 2, 3, 4].map((i, index) => (
              <Image
                key={index}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
                }}
                style={{
                  width: width(12),
                  height: width(12),
                  borderRadius: 100,
                }}
              />
            ))}

            <TouchableOpacity
              onPress={handleUploadImage}
              style={{
                width: width(12),
                height: width(12),
                borderRadius: 100,
                borderWidth: 1,
                borderColor: Colors.grey,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: width(7), color: Colors.grey}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingHorizontal: width(4), marginTop: width(5)}}>
          <CustomInput
            title="First Name"
            placeholder="Enter first name"
            value={inputValue.firstName}
            onChangeText={v => handleChange('firstName', v)}
          />

          <CustomInput
            title="Last Name"
            placeholder="Enter last name"
            value={inputValue.lastName}
            onChangeText={v => handleChange('lastName', v)}
            containerStyle={{marginTop: width(3)}}
          />

          <CustomInput
            title="Email"
            value={inputValue.email}
            editable={false}
            containerStyle={{marginTop: width(3)}}
          />

          <CustomInput
            title="Phone Number"
            placeholder="Enter phone"
            value={inputValue.phoneNum}
            onChangeText={v => handleChange('phoneNum', v)}
            keyboardType="number-pad"
            containerStyle={{marginTop: width(3)}}
          />
        </View>

        <View style={{paddingHorizontal: width(4), marginTop: width(6)}}>
          <Button heading="Update Info" onPress={handleUpdate} />
        </View>

        <View style={{height: width(10)}} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default PersonalInfo;
