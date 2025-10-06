import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {width} from 'react-native-dimension';
import {useDispatch} from 'react-redux';
import {setUserData} from '../../redux/slices/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Header = ({
  skip,
  text,
  goBack,
  cart,
  logout,
  handlePress,
  drawer,
  address,
  onPressAddress,
}) => {
  let cartData = useSelector(state => state.CartSlice.cartData);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const logUserOut = async () => {
    GoogleSignin.signOut();
    setTimeout(async () => {
      await AsyncStorage.removeItem('user');
      dispatch(setUserData(null));
      navigation.navigate('AuthStack');
    }, 500);
  };
  return (
    <View>
      <View
        style={{
          height: 60,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: width(3),
          backgroundColor: colors.orangeColor,
        }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {text}
          </Text>
        </View>
        {address && (
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'flex-start', right: width(30)}}
            onPress={onPressAddress}>
            <Text
              style={{
                color: colors.white,
                fontSize: 12,
                fontWeight: '400',
              }}>
              {address.slice(0, 50)}...
            </Text>
          </TouchableOpacity>
        )}

        {drawer && (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{position: 'absolute', left: width(4)}}>
            <Octicons name="three-bars" size={22} color="white" />
          </TouchableOpacity>
        )}
        {cart && (
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <FontAwesome
              name="shopping-cart"
              size={22}
              color="white"
              style={{marginRight: width(4)}}
            />
            <View
              style={{
                position: 'absolute',
                top: -3,
                right: width(3),
                height: 15,
                width: 15,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                elevation: 5,
                backgroundColor: colors.yellow,
                borderRadius: 200,
              }}>
              <Text style={{color: 'white', fontSize: 7}}>
                {cartData?.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {goBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', left: width(4)}}>
            <AntDesign name="arrowleft" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
        {logout && (
          <TouchableOpacity
            onPress={logUserOut}
            style={{position: 'absolute', right: 10}}>
            <MaterialIcons
              onPress={handlePress}
              color={colors.white}
              name="logout"
              size={24}
            />
          </TouchableOpacity>
        )}
        {skip && (
          <TouchableOpacity
            onPress={() => navigation.replace('AllRestaurants')}
            style={{position: 'absolute', right: 10}}>
            <Text
              style={{
                olor: 'white',
                fontWeight: '700',
                fontSize: 16,
                color: 'white',
              }}>
              skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
