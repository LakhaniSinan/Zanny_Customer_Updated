import {View, Text, Image} from 'react-native';
import React from 'react';
import {fontFamily, icons, images} from '../../assets';
import ActionBuuton from '../actionButton';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../constants';
import BackButton from '../backIcon';
import {width} from 'react-native-dimension';

const HistoryCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        marginTop: width(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.grey, // fix
        paddingBottom: width(5),
        marginHorizontal: width(4),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFF',
          borderRadius: width(2),
          paddingRight: width(2),
        }}>
        {/* Left: image + content */}
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image
            source={item?.foodImage}
            resizeMode="cover"
            style={{
              height: width(22),
              width: width(22),
              borderRadius: width(2),
            }}
          />
          <View style={{marginLeft: 8, flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                color: colors.black,
                fontFamily: fontFamily.poppinBold,
              }}>
              {item?.foodName}
            </Text>

            {/* Price row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 6,
              }}>
              <Text
                style={{
                  color: colors.red,
                  fontFamily: fontFamily.poppinBold,
                }}>
                {item?.price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamily.poppinBold,
                  textDecorationLine: 'line-through',
                  color: colors.grey,
                }}>
                {item?.offPrice ? `${item?.offPrice}` : ''}
              </Text>
            </View>

            {/* Status pill */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
                gap: 8,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamily.poppinBold,
                  color: colors.black,
                }}>
                Status
              </Text>
              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 8,
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,165,0,0.15)',
                  borderWidth: 1,
                  borderColor: colors.primaryOrange,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.primaryOrange,
                    fontFamily: fontFamily.poppinBold,
                  }}>
                  {item?.status || 'In progress'}
                </Text>
              </View>
            </View>

            {/* View Details button */}
            <View style={{width: width(60), marginTop: width(2)}}>
              <ActionBuuton
                bgcColor={'#3b0b0b'}
                fontColor={colors.white}
                name={'View Details'}
                onPress={() => navigation.navigate('ProductDetail')}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Made by */}
      <Text
        style={{
          fontSize: 12,
          fontFamily: fontFamily.poppinBold,
          color: colors.black,
          paddingVertical: width(2),
        }}>
        Made by
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={images.cheif}
          resizeMode="cover"
          style={{height: width(10), width: width(10), borderRadius: width(5)}}
        />
        <View style={{marginLeft: 8}}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: fontFamily.poppinBold,
              color: colors.primaryOrange,
            }}>
            Chef
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamily.poppinBold,
                color: colors.black,
              }}>
              {item?.cheifName}
            </Text>
            <Image
              source={icons.objects}
              resizeMode="contain"
              style={{
                height: width(4),
                width: width(4),
                marginBottom: width(1),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
