import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {
  default as Icon,
  default as MaterialCommunityIcons,
} from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {colors} from '../../constants';
import {setUserData} from '../../redux/slices/Login';

const DrawerItem = props => {
  const {title, focused, iconName, user, translatedTitle, navigation} = props;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setTimeout(async () => {
      await AsyncStorage.removeItem('user');
      dispatch(setUserData(null));
      navigation.navigate('AuthStack');
    }, 500);
  };
  const renderIcon = () => {
    switch (iconName) {
      case 'Restaurants':
        return (
          <Icon
            style={{marginRight: 10, marginLeft: 10}}
            name="food"
            color={colors.yellow}
            size={22}
          />
        );
      case 'Orders':
        return (
          <Foundation
            name="clipboard-notes"
            style={{marginRight: 10, marginLeft: 10}}
            color={colors.yellow}
            size={22}
          />
        );
      case 'Private Orders':
        return (
          <Foundation
            name="clipboard-notes"
            style={{marginRight: 10, marginLeft: 10}}
            color={colors.yellow}
            size={22}
          />
        );
      case 'Address':
        return (
          <Entypo
            style={{marginRight: 10, marginLeft: width(3)}}
            name="location"
            color={colors.yellow}
            size={22}
          />
        );
      case 'FAQs':
        return (
          <Entypo
            style={{marginRight: 10, marginLeft: width(3)}}
            name="location"
            color={colors.yellow}
            size={22}
          />
        );
      case 'Support':
        return (
          <AntDesign
            style={{marginRight: 10, marginLeft: width(3)}}
            name="customerservice"
            color={colors.yellow}
            size={22}
          />
        );
      case 'Settings':
        return (
          <IonIcons
            style={{marginRight: 10, marginLeft: width(3)}}
            name="settings"
            color={colors.yellow}
            size={22}
          />
        );
      case 'Profile':
        return (
          <IonIcons
            style={{marginRight: 10, marginLeft: width(3)}}
            name="people"
            color={colors.yellow}
            size={22}
          />
        );
      case 'Log out':
        return (
          <MaterialCommunityIcons
            style={{marginRight: 10, marginLeft: width(4)}}
            name="logout"
            color={colors.yellow}
            size={22}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={{height: 50}}
      onPress={() =>
        iconName == 'Log out' ? handleLogout() : navigation.navigate(iconName)
      }>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{width: '20%'}}>{renderIcon()}</View>
        <Text style={{color: 'black', fontWeight: '600'}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DrawerItem;
