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
        paddingVertical: width(0.5),
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        <IconSet name={icon} size={22} color={colors.redish} />

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

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(setUserData(null));
  };

  const name =
    user?.name ||
    user?.full_name ||
    `${user?.first_name || 'Timothy'} ${user?.last_name || 'Lankish'}`;

  const email = user?.email || 'timothylank@gmail.com';

  return (
    <View style={{flex: 1, backgroundColor: '#F6F6F6'}}>
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
          }}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={22}
            color={colors.redish}
          />
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              height: 12,
              width: 12,
              borderRadius: 12,
              backgroundColor: colors.orange,
            }}
          />
        </TouchableOpacity>

        {user?.customerImage && (
          <Image
            source={{uri: user?.customerImage}}
            style={{
              height: width(26),
              width: width(26),
              borderRadius: width(13),
              borderWidth: 4,
              borderColor: colors.white,
              marginTop: width(6),
            }}
          />
        )}
        {!user?.customerImage && (
          <Image
            source={images.userAvatar}
            style={{
              height: width(26),
              width: width(26),
              borderRadius: width(13),
              borderWidth: 4,
              borderColor: colors.white,
              marginTop: width(6),
            }}
          />
        )}

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

      <View
        style={{
          marginTop: -width(20),
          marginHorizontal: width(4),
          backgroundColor: colors.white,
          borderRadius: width(5),
          padding: width(5),
          elevation: 8,
          shadowColor: '#0003',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontFamily: fontFamily.poppinBold,
            }}>
            My Account
          </Text>

          <Row
            iconSet={Feather}
            icon="user"
            label="Personal information"
            onPress={() => navigation.navigate('PersonalInfo')}
          />

          <Row iconSet={Feather} icon="credit-card" label="Subscriptions" />

          <Row
            iconSet={Feather}
            icon="file-text"
            label="Special order request"
          />

          <Row iconSet={Feather} icon="shield" label="Privacy Policy" />

          <Row iconSet={Feather} icon="settings" label="Settings" />

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#E5E5E5',
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
              backgroundColor: '#E5E5E5',
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
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;
