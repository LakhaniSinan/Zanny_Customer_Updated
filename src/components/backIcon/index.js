import {TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {colors} from '../../constants';
const BackButton = ({icon, onPress, border, height, width}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: height ? height : 44,
        width: width ? width : 44,
        borderRadius: 100,
        borderWidth: border,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
      }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{height: 22, width: 22}}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
