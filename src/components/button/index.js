import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';

const Button = ({heading, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
            backgroundColor: colors.black,
          marginHorizontal: width(4),
          paddingVertical: 10,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom:width(2)
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>{heading}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
