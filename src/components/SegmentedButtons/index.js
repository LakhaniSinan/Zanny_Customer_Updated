import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';
import {width} from 'react-native-dimension';

const SegmentedButtons = ({item, backgroundColor, color}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColor ? backgroundColor : Colors.softgray,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width(6),
        paddingVertical: width(2),
        borderRadius: 100,
        margin: width(1),
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: color ? color : Colors.black,
        }}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default SegmentedButtons;
