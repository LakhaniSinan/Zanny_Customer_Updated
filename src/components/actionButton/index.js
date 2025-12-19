import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {fontFamily} from '../../assets';

const ActionBuuton = ({
  name,
  fontColor,
  bgcColor,
  onPress,
  height,
  customStyle,
  fontSize,
  textStyle,
  fontWeight,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        ...customStyle,
        backgroundColor: bgcColor,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        height: height ? height : 40,
      }}>
      <Text
        style={{
          ...textStyle,
          fontSize: fontSize ? fontSize : 12,
          fontFamily: fontWeight ? fontWeight : fontFamily.poppinBold,
          color: fontColor,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionBuuton;
