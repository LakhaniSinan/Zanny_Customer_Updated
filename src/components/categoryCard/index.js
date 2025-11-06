import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../constants';

const Category = props => {
  const item = props.item;
  return (
    <TouchableOpacity
      style={{
        height: 40,
        width: 'auto',
        borderWidth: 1,
        borderColor: Colors.orange,
        borderRadius: 56,
        backgroundColor: Colors.orange,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
        backgroundColor: Colors.background,
      }}>
      <View
        style={{
          height: 28,
          width: 28,
          backgroundColor: Colors.white,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          left: 7,
        }}>
        <Image source={item?.cateIcon} style={{height: 15, width: 15}} />
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 500,
          paddingLeft: 12,
          color: Colors.black,
        }}>
        {item?.cateName}
      </Text>
    </TouchableOpacity>
  );
};

export default Category;
