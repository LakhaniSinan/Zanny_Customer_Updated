import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {fontFamily} from '../../assets';

const ActionBuuton = ({
  name,
  fontColor,
  bgcColor,
  onPress,
  height,
  fontSize,
  styleProps,
  borderRadius,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styleProps,
        backgroundColor: bgcColor,
        borderRadius: borderRadius ? borderRadius : 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        height: height ? height : 40,
      }}>
      <Text
        style={{
          fontSize: fontSize ? fontSize : 12,
          fontFamily: fontFamily.poppinBold,
          color: fontColor,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionBuuton;
