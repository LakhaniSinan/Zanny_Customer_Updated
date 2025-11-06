import React from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import {Colors} from '../../constants';
import {width} from 'react-native-dimension';

const CustomInput = ({onChangeText, value, placeholder, title, Icon}) => {
  return (
    <View style={{gap: 12}}>
      <Text style={{fontSize: 14, fontWeight: 400, color: Colors.black}}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          height: 58,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: Colors.softgray,
          alignItems: 'center',
          paddingHorizontal: width(2),
        }}>
        <TextInput
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayyy}
          style={{
            paddingLeft: 20,
            flex: 1,
          }}
        />
        {Icon && (
          <View style={{marginLeft: 12}}>
            <Image
              source={Icon}
              resizeMode="contain"
              style={{height: 18, width: 18}}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomInput;
