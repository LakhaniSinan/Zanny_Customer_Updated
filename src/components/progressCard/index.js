import React from 'react';
import {Image, Text, View} from 'react-native';
import {Colors} from '../../constants';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';

const ProgressCard = ({item}) => {
  return (
    <View>
      <View
        style={{
          height: width(11),
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: width(5),
        }}>
        <View
          style={{
            height: 45,
            width: 43,
            backgroundColor: Colors.clayDark,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <Image
            source={icons.kcal}
            style={{height: 25, width: 23}}
            resizeMode="contain"
          />
        </View>
        <View style={{gap: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width(74),
              marginLeft: 12,
              marginTop: 2,
            }}>
            <Text style={{fontSize: 14, fontWeight: 500}}>{item?.name}</Text>
            <Text style={{fontSize: 14, fontWeight: 500}}>{item?.amount}gm</Text>
          </View>
          <View
            style={{
              width: width(74),
              height: 8,
              borderRadius: 50,
              marginLeft: 12,
              backgroundColor: Colors.clayDark,
            }}>
            <View
              style={{
                width: `£${item?.amount}%`,
                height: 7,
                backgroundColor: Colors.grayplus,
                borderRadius: 500,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProgressCard;
