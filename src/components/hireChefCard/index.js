import {View, Text, Image, Alert} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';
import {icons} from '../../assets';
import PrimaryButton from '../primaryButton';
import {width} from 'react-native-dimension';

const HireCheifCard = ({item}) => {
  return (
    <View
      style={{
        height: 285,
        width: 210,
        backgroundColor: Colors.white,
        borderRadius: 19,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
      <Image
        source={item?.thumnail}
        style={{
          width: 210,
          height: 98,
          borderTopRightRadius: 19,
          borderTopLeftRadius: 19,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          borderRadius: 100,
          borderWidth: 3,
          width: 73,
          position: 'absolute',
          marginTop: 65,
          marginLeft: 65,
          borderColor: Colors.white,
        }}>
        <Image
          source={item?.cheifProfileImage}
          style={{height: 68, width: 68, borderRadius: 100}}
        />
      </View>
      <View
        style={{
          marginTop: 42,
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          }}>
          <Text style={{fontSize: 14, fontWeight: 600, color: Colors.black}}>
            {item?.cheifName}
          </Text>
          <Image source={icons.objects} style={{height: 14, width: 14}} />
        </View>
        <Text style={{fontSize: 10, fontWeight: 400, color: Colors.black}}>
          {item?.place}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 17,
          alignSelf: 'center',
          marginTop: 15,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 14, fontWeight: 500, color: Colors.black}}>
            {item?.services}
          </Text>
          <Text style={{fontSize: 8, fontWeight: 400}}>Customer Service</Text>
        </View>
        <View
          style={{
            height: 30,
            borderWidth: 1,
            borderColor: Colors.softgray,
          }}
        />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 14, fontWeight: 500, color: Colors.black}}>
            {item?.rating}
          </Text>
          <Text style={{fontSize: 8, fontWeight: 400}}>Response Rate</Text>
        </View>
      </View>
      <View
        style={{
          height: width(10),
          width: width(40),
          width: '100%',
          marginTop: width(2),
          paddingHorizontal: width(3),
        }}>
        <PrimaryButton
          name={'Hair'}
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'This feature is currently under development. Please check back later!',
            )
          }
        />
      </View>
    </View>
  );
};

export default HireCheifCard;
