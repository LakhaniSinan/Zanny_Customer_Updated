import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';
import {Colors} from '../../constants';

const Category = ({item, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image source={icons.rice} style={styles.icon} resizeMode="contain" />
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(Category);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width(2),
    paddingRight: 14,
    paddingVertical: 6,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: Colors.orange,
    backgroundColor: Colors.background,
    
  },
  iconWrapper: {
    height: 28,
    width: 28,
    marginLeft: 6,
    borderRadius: 100,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 15,
    width: 15,
  },
  title: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.black,
  },
});
