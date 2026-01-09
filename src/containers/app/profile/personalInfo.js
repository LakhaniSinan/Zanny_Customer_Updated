import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import CustomModal from '../../../components/customModal';
import {colors, Colors} from '../../../constants';
import {helper} from '../../../helper';
import {setUserData} from '../../../redux/slices/Login';
import {
  getCustomerProfile,
  updateCustomerProfile,
} from '../../../services/profile';
import {icons} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';

function PersonalInfo({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.LoginSlice.user);

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [modalData, setModalData] = useState({
    Icon: '',
    title: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

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
      showModal('Error', 'Failed to upload image');
    }
  };

  // ---------- Helper to show CustomModal ----------
  const showModal = (icon, title, detail, buttonName = 'Okay', onPress) => {
    setModalData({
      Icon: icon,
      title,
      detail,
      buttonName,
      onPress: onPress || (() => setModalVisible(false)),
    });
    setModalVisible(true);
  };

  const handleUpdate = () => {
    const {firstName, lastName, phoneNum, customerImage} = inputValue;

    if (!customerImage)
      return showModal(
        icons.cross,
        'Validation Error',
        'Please upload profile image',
      );
    if (!firstName)
      return showModal(
        icons.cross,
        'Validation Error',
        'First name is required',
      );
    if (!lastName)
      return showModal(
        icons.cross,
        'Validation Error',
        'Last name is required',
      );
    if (!phoneNum)
      return showModal(
        icons.cross,
        'Validation Error',
        'Phone number required',
      );

    const payload = {
      name: `${firstName} ${lastName}`,
      phoneNumber: phoneNum,
      customerImage,
    };

    setIsVisible(true);

    updateCustomerProfile(user?._id, payload)
      .then(res => {
        AsyncStorage.setItem('user', JSON.stringify(res?.data?.data));
        dispatch(setUserData(res?.data?.data));
        setIsVisible(false);
        showModal(icons.check, 'Success', res?.data?.message, 'Okay');
      })
      .catch(e => {
        setIsVisible(false);
        showModal(icons.cross, 'Error', 'Failed to update profile');
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
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
            <View
              style={{
                position: 'relative',
                borderRadius: 100,
                backgroundColor: colors.border,
              }}>
              <Image
                source={{uri: inputValue.customerImage}}
                resizeMode="cover"
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
          </View>

          <View style={{paddingHorizontal: width(4), marginTop: width(5)}}>
            <CustomInput
              title="First Name"
              placeholder="Enter first name"
              value={inputValue.firstName}
              onChangeText={v => handleChange('firstName', v)}
            />
            <View style={{height:width(4)}}/>

            <CustomInput
              title="Last Name"
              placeholder="Enter last name"
              value={inputValue.lastName}
              onChangeText={v => handleChange('lastName', v)}
              containerStyle={{marginTop: width(3)}}
            />

            <View style={{height:width(4)}}/>
            <CustomInput
              title="Email"
              value={inputValue.email}
              editable={false}
              containerStyle={{marginTop: width(3)}}
            />

            <View style={{height:width(4)}}/>
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
            <ActionBuuton
              name="Update Info"
              height={50}
              fontSize={14}
              bgcColor={colors.black}
              fontColor={colors.white}
              onPress={handleUpdate}
            />
          </View>
          <View style={{height: width(10)}} />
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          Icon={modalData.Icon}
          name={modalData.title}
          detail={modalData.detail}
          buttonName={modalData.buttonName}
          onPress={modalData.onPress}
          close={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PersonalInfo;
