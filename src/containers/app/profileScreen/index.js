// Updated Profile Screen UI based on provided design

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants';
import {fontFamily, images} from '../../../assets';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setUserData} from '../../../redux/slices/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Row = ({iconSet: IconSet, icon, label, onPress, right}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: width(3.5),
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        {IconSet && <IconSet name={icon} size={22} color={colors.redish} />}

        <Text
          style={{
            fontSize: 16,
            color: colors.black,
            fontFamily: fontFamily.poppinMedium,
          }}>
          {label}
        </Text>
      </View>

      {right ?? (
        <Feather name="chevron-right" size={20} color={colors.graydark} />
      )}
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.LoginSlice.user) || {};

  const [pushEnabled, setPushEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(false);

  const name =
    user?.name ||
    user?.full_name ||
    `${user?.first_name || 'Timothy'} ${user?.last_name || 'Lankish'}`;
  const email = user?.email || 'timothylank@gmail.com';

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch {}
    dispatch(setUserData(null));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      {/* Top Section */}
      <View
        style={{
          backgroundColor: colors.redish,
          paddingTop: width(12),
          paddingBottom: width(20),
          alignItems: 'center',
          borderBottomLeftRadius: width(8),
          borderBottomRightRadius: width(8),
        }}>
        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            fontFamily: fontFamily.poppinBold,
          }}>
          Profile
        </Text>

        {/* Notification Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            right: width(4),
            top: width(12),
            height: 44,
            width: 44,
            borderRadius: 44,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={22}
            color={colors.redish}
          />
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              height: 10,
              width: 10,
              borderRadius: 10,
              backgroundColor: colors.orange,
            }}
          />
        </TouchableOpacity>

        {/* Profile Image */}
        <Image
          source={images.userAvatar}
          resizeMode="cover"
          style={{
            height: width(22),
            width: width(22),
            borderRadius: width(11),
            marginTop: width(6),
            borderWidth: 3,
            borderColor: colors.white,
          }}
        />

        {/* Name + Email */}
        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            marginTop: width(4),
            fontFamily: fontFamily.poppinBold,
          }}>
          {name}
        </Text>
        <Text
          style={{
            color: colors.white,
            opacity: 0.85,
            fontSize: 15,
            marginTop: 2,
            fontFamily: fontFamily.poppinRegular,
          }}>
          {email}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: width(8)}}
        showsVerticalScrollIndicator={false}>
        {/* White Card Section */}
        <View
          style={{
            marginTop: -width(12),
            marginHorizontal: width(4),
            padding: width(5),
            backgroundColor: colors.white,
            borderRadius: width(4),
            elevation: 4,
            shadowColor: '#0003',
          }}>
          {/* My Account */}
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontFamily: fontFamily.poppinBold,
              marginBottom: width(3),
            }}>
            My Account
          </Text>

          <Row
            iconSet={Feather}
            icon="user"
            label="Personal information"
            onPress={() => navigation.navigate('PersonalInfo')}
          />
          <Row
            iconSet={Feather}
            icon="credit-card"
            label="Subscriptions"
            onPress={() => {}}
          />
          <Row
            iconSet={Feather}
            icon="file-text"
            label="Special order request"
            onPress={() => {}}
          />
          <Row
            iconSet={Feather}
            icon="shield"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <Row
            iconSet={Feather}
            icon="settings"
            label="Settings"
            onPress={() => {}}
          />

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: width(3),
            }}
          />

          {/* Notifications */}
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontFamily: fontFamily.poppinBold,
              marginBottom: width(2),
            }}>
            Notifications
          </Text>

          <Row
            iconSet={Feather}
            icon="bell"
            label="Push Notifications"
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{false: colors.softgray, true: colors.green}}
                thumbColor={colors.white}
              />
            }
          />

          <Row
            iconSet={Feather}
            icon="bell-off"
            label="Promotional Notifications"
            right={
              <Switch
                value={promoEnabled}
                onValueChange={setPromoEnabled}
                trackColor={{false: colors.softgray, true: colors.green}}
                thumbColor={colors.white}
              />
            }
          />

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: width(3),
            }}
          />

          {/* More */}
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontFamily: fontFamily.poppinBold,
              marginBottom: width(2),
            }}>
            More
          </Text>

          <Row
            iconSet={Feather}
            icon="info"
            label="Help Center"
            onPress={() => navigation.navigate('Support')}
          />

          <Row
            iconSet={AntDesign}
            icon="logout"
            label="Log Out"
            onPress={logout}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
