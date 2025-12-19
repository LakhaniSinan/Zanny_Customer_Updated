import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';

import {fontFamily, icons, images} from '../../../assets';
import CustomModal from '../../../components/customModal';
import {colors} from '../../../constants';
import {setUserData} from '../../../redux/slices/Login';
import {setCartData} from '../../../redux/slices/Cart';
import {setCurrentPaymentCard} from '../../../redux/slices/paymentCard';
import {setCurrentLocation} from '../../../redux/slices/Location';

const Row = ({activeOpacity = 0.7, iconSet, label, right, onPress}) => (
  <TouchableOpacity
    activeOpacity={activeOpacity}
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: width(1.2),
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
      <Image
        source={iconSet}
        style={{height: width(5), width: width(5)}}
        resizeMode="contain"
        color={colors.redish}
      />
      <Text
        style={{
          fontSize: 16,
          color: colors.black,
          fontFamily: fontFamily.poppinMedium,
        }}>
        {label}
      </Text>
    </View>
    {right}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(false);

  // ✅ Custom Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: null,
    title: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  useEffect(() => {
    if (!user) navigation.replace('Login');
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(setUserData(null));
    navigation.replace('Login');
    dispatch(setUserData(null));
    await AsyncStorage.removeItem('cartData');
    dispatch(setCartData([]));
    await AsyncStorage.removeItem('userCurrentAddress');
    dispatch(setCurrentLocation(null));
    dispatch(setCurrentPaymentCard(null));
  };

  // ✅ SHOW "COMING SOON" MODAL
  const showComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'This feature is currently under development. Please check back later!',
    );
  };

  const name = user?.name || 'Guest User';
  const email = user?.email || 'example@email.com';

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F6F6F6'}}>
      {/* HEADER */}
      <View
        style={{
          height: width(90),
          backgroundColor: colors.red,
          alignItems: 'center',
          paddingTop: width(5),
        }}>
        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            fontFamily: fontFamily.poppinBold,
          }}>
          Profile
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            top: width(5),
            right: width(4),
            height: 45,
            width: 45,
            borderRadius: 45,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 6,
          }}
          onPress={showComingSoon}>
          <Image
            source={icons.notificationsRed}
            style={{height: width(8), width: width(8)}}
          />
        </TouchableOpacity>

        <Image
          source={
            user?.customerImage ? {uri: user.customerImage} : images.userAvatar
          }
          style={{
            height: width(26),
            width: width(26),
            borderRadius: width(13),
            borderWidth: 4,
            borderColor: colors.white,
            marginTop: width(6),
          }}
        />

        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            marginTop: width(3),
            fontFamily: fontFamily.poppinBold,
          }}>
          {name}
        </Text>

        <Text
          style={{
            color: colors.white,
            opacity: 0.85,
            fontSize: 15,
            marginTop: 4,
            fontFamily: fontFamily.poppinRegular,
          }}>
          {email}
        </Text>
      </View>

      {/* CARD */}
      <View
        style={{
          marginTop: -width(20),
          marginHorizontal: width(4),
          backgroundColor: colors.white,
          borderRadius: width(5),
          padding: width(5),
          elevation: 8,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: fontFamily.poppinBold,
            marginBottom: width(2),
          }}>
          My Account
        </Text>

        <Row
          iconSet={icons.profileIcon}
          label="Personal information"
          onPress={() => navigation.navigate('PersonalInfo')}
        />

        <Row
          iconSet={icons.subscriptionIcon}
          label="Subscriptions"
          onPress={showComingSoon}
        />

        <Row
          iconSet={icons.specialIcon}
          icon="file-text"
          label="Special order request"
          onPress={showComingSoon}
        />

        <Row
          iconSet={icons.privacyIcon}
          label="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />

        <Row
          iconSet={icons.allergiesIcon}
          label="Settings"
          onPress={showComingSoon}
        />

        <View
          style={{height: 1, backgroundColor: '#E5E5E5', marginVertical: 20}}
        />

        <Text
          style={{
            fontSize: 18,
            fontFamily: fontFamily.poppinBold,
            marginBottom: width(2),
          }}>
          Notifications
        </Text>

        <Row
          iconSet={icons.notificationsRed}
          label="Push Notifications"
          activeOpacity={1}
          right={
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{false: colors.softgray, true: colors.green}}
            />
          }
        />

        <Row
          iconSet={icons.notificationsRed}
          label="Promotional Notifications"
          activeOpacity={1}
          right={
            <Switch
              value={promoEnabled}
              onValueChange={setPromoEnabled}
              trackColor={{false: colors.softgray, true: colors.green}}
            />
          }
        />

        <View
          style={{height: 1, backgroundColor: '#E5E5E5', marginVertical: 20}}
        />
        <Row
          iconSet={icons.personalfo}
          label="Help Center"
          onPress={() => navigation.navigate('Support')}
        />

        <Row iconSet={icons.logoutIcon} label="Log Out" onPress={logout} />
      </View>

      {/* ✅ CUSTOM MODAL */}
      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.title}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />

      <View style={{height: width(4)}} />
    </ScrollView>
  );
};

export default ProfileScreen;
