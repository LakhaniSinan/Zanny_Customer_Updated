import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../../constants';
import { width } from 'react-native-dimension';

const SectionHeader = ({ onPress, action, name, fontSize, color }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: width(3),
      }}>
      <Text
        style={{
          fontSize: fontSize ? fontSize : 18,
          fontWeight: 500,
          color: color ? color : Colors.black,
        }}>
        {name}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            textDecorationLine: 'underline',
            fontSize: 14,
            fontWeight: 500,
            color: Colors.red,
          }}>
          {action}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
