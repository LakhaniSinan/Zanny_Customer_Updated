import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

const ActionBuuton = ({
  name,
  fontColor,
  bgcColor,
  onPress,
  height,
  width,
  fontSize,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: height ? height : 28,
        width: width ? width : 85,
        backgroundColor: bgcColor,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
      }}>
      <Text
        style={{
          fontSize: fontSize ? fontSize : 12,
          fontWeight: 500,
          color: fontColor,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionBuuton;
