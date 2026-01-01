import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons} from '../../assets';
import {colors} from '../../constants';
import ActionBuuton from '../actionButton';
import PrimaryButton from '../primaryButton';
import {useNavigation} from '@react-navigation/native';

// Custom Rating Component
const CustomRating = ({rating = 0, starSize = 12, maxStars = 5}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starWidth = width(starSize / 4);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
      {[...Array(maxStars)].map((_, index) => {
        if (index < fullStars) {
          // Filled star
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
              }}
              resizeMode="contain"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          // Half star (showing as filled with reduced opacity)
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
                opacity: 0.6,
              }}
              resizeMode="contain"
            />
          );
        } else {
          // Empty star - using yellowStar with low opacity for empty state
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
                opacity: 0.2,
              }}
              resizeMode="contain"
            />
          );
        }
      })}
    </View>
  );
};

const AllChefsCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: width(3),
        justifyContent: 'space-between',
        paddingBottom: width(4),
      }}>
      <View
        style={{
          height: width(12),
          width: width(12),
          borderRadius: 100,
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: item?.merchantImage}}
          style={{height: '100%', width: '100%'}}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          width: width(50),
        }}>
        <Text style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 16}}>
          {item?.name}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: fontFamily.poppinRegular,
              fontSize: 10,
              marginRight: width(2),
              backgroundColor: '#FAF1EC',
              borderRadius: 100,
              paddingHorizontal: width(3),
              borderWidth: 1,
              borderColor: colors.warn,
              color: '#50555C',
              paddingTop: width(1),
            }}>
            British
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.poppinRegular,
              fontSize: 10,
              marginRight: width(2),
              backgroundColor: '#FAF1EC',
              borderRadius: 100,
              paddingHorizontal: width(3),
              borderWidth: 1,
              borderColor: colors.warn,
              color: '#50555C',
              paddingTop: width(1),
            }}>
            American
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            gap: 4,
          }}>
          <Image
            source={icons.yellowStar}
            style={{height: width(3), width: width(3)}}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.poppinRegular,
              marginTop: width(1),
            }}>
            {'4.8 (120+)  2.8 km away'}
          </Text>
        </View>
        <CustomRating rating={item?.rating || 4.8} starSize={15} />
      </View>
      <View
        style={{
          height: width(20),
        }}>
        <View
          style={{
            height: width(7),
            width: width(28),

            marginTop: width(2),
            paddingHorizontal: width(3),
          }}>
          <PrimaryButton
            name={'Hire'}
            fontSize={10}
            onPress={() =>
              Alert.alert(
                'Coming Soon',
                'This feature is currently under development. Please check back later!',
              )
            }
          />
        </View>
        <View
          style={{
            height: width(7),
            marginTop: width(2),
            width: width(28),

            paddingHorizontal: width(3),
          }}>
          <ActionBuuton
            name={'View Profile'}
            height={width(7)}
            fontSize={10}
            onPress={() => navigation.navigate('AboutChef', item)}
          />
        </View>
      </View>
    </View>
  );
};

export default AllChefsCard;
