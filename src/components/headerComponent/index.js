import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {width} from 'react-native-dimension';
import {Colors, colors} from '../../constants';
import {fontFamily, icons} from '../../assets';
import {useSelector} from 'react-redux';

const AppHeader = ({
  text,
  goBack,
  notificationsIcon,
  cartIcon,
  onCartIconPress,
  logout,
  drawer,
  address,
  handlePress,
  onPressAddress,
}) => {
  const navigation = useNavigation();
  const {cartData} = useSelector(state => state.CartSlice);

  return (
    <View style={styles.container}>
      {goBack && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.ArrowLeft}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
      )}

      {text && (
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{text}</Text>
        </View>
      )}
      {notificationsIcon && (
        <View style={styles.rightIconWrapper}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.bellIcon}
              resizeMode="contain"
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>
      )}
      {cartIcon && (
        <View style={styles.cartIconWrapper}>
          <TouchableOpacity
            style={styles.cartIconBtn}
            onPress={() => navigation.navigate('CartScreen')}>
            <Image
              source={icons.ShoppingCart}
              resizeMode="contain"
              style={styles.backIcon}
            />
            {cartData.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartData.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayplus,
    position: 'relative',
    paddingHorizontal: 10,
  },

  backBtn: {
    height: width(8),
    width: width(8),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
    zIndex: 10,
  },
  cartIconBtn: {
    height: width(10),
    width: width(10),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
    zIndex: 10,
    borderWidth: 1,
    borderColor: Colors.clay,
    borderRadius: 100,
  },

  backIcon: {
    height: width(5),
    width: width(5),
  },

  textWrapper: {
    position: 'absolute',
    left: 55,
    justifyContent: 'center',
  },
  rightIconWrapper: {
    position: 'absolute',
    right: 55,
    justifyContent: 'center',
  },
  cartIconWrapper: {
    position: 'absolute',
    right: 60,
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.gray,
  },

  title: {
    fontSize: 18,
    fontFamily: fontFamily.poppinBold,
    color: Colors.redish,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.redish,
    width: width(4),
    height: width(4),
    borderRadius: width(2),
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.poppinBold,
  },
});
