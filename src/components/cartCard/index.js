import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {fontFamily, icons, images} from '../../assets';
import ActionBuuton from '../actionButton';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../constants';
import BackButton from '../backIcon';
import {width} from 'react-native-dimension';

const CartCard = ({item}) => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));
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
                color: colors.redish,
                fontFamily: fontFamily.poppinBold,
              }}>
              {item?.foodName}
            </Text>

            {/* Rating · distance · time */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 6,
              }}>
              <Image
                source={icons.yellowStar}
                resizeMode="contain"
                style={{height: width(3), width: width(3)}}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.black,
                  fontFamily: fontFamily.poppinMedium,
                }}>
                {item?.foodRating || '4.8'}{' '}
                {(item?.ratingCount && `(${item?.ratingCount}+)`) || '(120+)'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grey,
                  fontFamily: fontFamily.poppinMedium,
                }}>
                · {item?.distance || '2.8 km away'}
              </Text>
            </View>

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
              <Image
                source={icons.clock}
                resizeMode="contain"
                style={{height: width(3.2), width: width(3.2), marginLeft: 2}}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grey,
                  fontFamily: fontFamily.poppinMedium,
                }}>
                {item?.time || '20mins'}
              </Text>
            </View>

            {/* Quantity selector */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F2F2F2',
                borderRadius: 100,
                paddingHorizontal: width(2),
                paddingVertical: width(1.2),
                marginTop: width(2),
                width: width(40),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={decrement}
                activeOpacity={0.8}
                style={{
                  height: width(8),
                  width: width(8),
                  borderRadius: width(10),
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.red,
                    fontSize: 18,
                    fontFamily: fontFamily.poppinBold,
                  }}>
                  -
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.black,
                  fontFamily: fontFamily.poppinBold,
                }}>
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={increment}
                activeOpacity={0.8}
                style={{
                  height: width(8),
                  width: width(8),
                  borderRadius: width(10),
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.red,
                    fontSize: 18,
                    fontFamily: fontFamily.poppinBold,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{gap: 8, alignItems: 'center'}}>
          <BackButton icon={icons.deleteIcon} border={1} />
          <BackButton icon={icons.share} border={1} />
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

export default CartCard;
