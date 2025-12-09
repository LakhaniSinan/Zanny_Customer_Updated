import {View, Text, Image} from 'react-native';
import React from 'react';
import {width} from 'react-native-dimension';
import {Colors} from '../../constants';

const ChefsCard = ({item}) => {
  console.log(item, '');

  return (
    <View
      style={{
        backgroundColor: Colors.clayLite,
        borderRadius: 10,
        elevation: 5,
        marginRight: width(2),
        paddingBottom: width(2),
        overflow: 'hidden',
      }}>
      <Image
        source={{uri: item?.image}}
        resizeMode="cover"
        style={{height: width(20), width: width(25)}}
      />
      <View style={{marginTop: 12}}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: Colors.black,
            textAlign: 'center',
          }}>
          {item?.name}
        </Text>
      </View>
    </View>
  );
};

export default ChefsCard;
