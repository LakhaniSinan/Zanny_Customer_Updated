import { View, Text, Image } from 'react-native';
import React from 'react';
import { icons, images } from '../../assets';
import ActionBuuton from '../actionButton';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants';
import BackButton from '../backIcon';

const FoodCard = ({ item, heartIcon }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        alignSelf: 'center',
        marginTop: 15,
        borderBottomWidth: 1,
        borderBlockColor: colors.grey,
        paddingBottom: 22,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={item?.foodImage}
            resizeMode="contain"
            style={{ height: 109, width: 112 }}
          />
          <View style={{ marginLeft: 8 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 500,
              color: colors.redish
            }}>
              {item?.foodName}
            </Text>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 5 }}>
              <Image
                source={icons.yellowStar}
                resizeMode="contain"
                style={{ height: 12, width: 12 }}
              />
              <Text style={{ fontSize: 12, fontWeight: 400 }}>
                {item?.foodRating}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.orangeDark,
                }}>
                {item?.price}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {item?.offPrice}
              </Text>
              <Image
                source={icons.clock}
                resizeMode="contain"
                style={{ height: 13, width: 13 }}
              />
              <Text style={{ fontSize: 12, fontWeight: 400 }}>{item?.time}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 12 }}>
              <ActionBuuton
                bgcColor={colors.black}
                fontColor={colors.white}
                name={'View Details'}
                onPress={() => navigation.navigate('ProductDetail')}
              />
              <ActionBuuton
                bgcColor={colors.white}
                fontColor={colors.black}
                name={'Add to cart'}
              />
            </View>
          </View>
        </View>
        <View style={{ gap: 5, marginTop: -20 }}>
          <BackButton icon={icons.heartBrown} border={1} height={38} width={38} />
          <BackButton icon={icons.share} border={1} height={38} width={38} />
        </View>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: colors.black,
          paddingVertical: 10,
        }}>
        Made by
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={images.cheif}
          resizeMode="contain"
          style={{ height: 34, width: 34 }}
        />
        <View style={{ marginLeft: 8 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: colors.primaryOrange,
            }}>
            Chef
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: colors.black }}>
              {item?.cheifName}
            </Text>
            <Image
              source={icons.objects}
              resizeMode="contain"
              style={{ height: 15, width: 15 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;
