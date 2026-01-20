import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';
import {Colors} from '../../constants';
import PrimaryButton from '../primaryButton';

const HireCheifCard = ({item, handleHireChef}) => {
  return (
    <View
      style={{
        height: 280,
        maxWidth: 180,
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 19,
        paddingBottom: width(3),
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
        source={{uri: item?.merchantImage}}
        style={{
          width: '100%',
          height: 100,
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
          source={{uri: item?.merchantImage}}
          style={{height: 68, width: 68, borderRadius: 100}}
          resizeMode="cover"
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
          <Text
            width={width(20)}
            numberOfLines={1}
            style={{fontSize: 14, fontWeight: 600, color: Colors.black}}>
            {item?.name}
          </Text>
          <Image source={icons.objects} style={{height: 14, width: 14}} />
        </View>
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
            5.0
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
            100%
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
          name={'Hire'}
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
