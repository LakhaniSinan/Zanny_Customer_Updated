import {Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {width} from 'react-native-dimension';
import {Colors} from '../../constants';

const PrimaryButton = ({name, onPress, bgcColor, color, Icon, borderColor}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 90,
        backgroundColor: bgcColor ? bgcColor : Colors.black,
        borderColor: borderColor ? borderColor : Colors.black,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      {Icon && <Image source={Icon} style={{height: 22, width: 22}} />}
      <Text
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: color ? color : Colors.white,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
