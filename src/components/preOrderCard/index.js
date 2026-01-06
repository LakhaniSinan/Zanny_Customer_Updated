import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons, images} from '../../assets';
import {Colors, colors} from '../../constants';
import PrimaryButton from '../primaryButton';

const PreOrderCard = ({
  item,
  type,
  ischeckout,
  onCustomizePress,
  handleSelectToCheckout,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}) => {
  return (
    <View
      style={{
        marginVertical: width(2),
        marginHorizontal: width(4),
        padding: width(3),
        backgroundColor: colors.white,
        borderRadius: width(2),
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayyy,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item?.image}}
          style={{height: width(32), width: width(32), borderRadius: 8}}
          resizeMode="cover"
        />
        <View style={{flex: 1, marginLeft: width(3)}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamily.poppinBold,
              color: colors.redish,
            }}>
            {item.name}
          </Text>

          {type !== 'reOccuring' && (
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
          )}

          {/* Price & Time */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            {item?.discount > 0 ? (
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: colors.grey,
                }}>
                {item?.discount}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: fontFamily.poppinBold,
                  color: colors.red,
                  marginTop: 5,
                }}>
                £{item.price}
              </Text>
            )}
            <Image
              source={icons.clock}
              style={{height: width(4), width: width(4)}}
            />
            <Text
              style={{
                color: colors.grey,
              }}>
              {item?.merchant?.deliveryTimmings} mins
            </Text>
          </View>
          <View
            style={{
              height: width(10),
              width: width(30),
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: width(1),
              alignItems: 'center',
              backgroundColor: '#F4F4F4',
              borderRadius: 100,
              borderWidth: 1,
              borderColor: colors.border,
            }}>
            <TouchableOpacity
              onPress={() => handleDecreaseQuantity(item)}
              style={{
                height: width(8),
                width: width(8),
                backgroundColor: colors.white,
                borderRadius: 100,
                borderColor: colors.red,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinBold,
                  color: colors.black,
                  fontSize: 14,
                }}>
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: fontFamily.poppinBold,
                color: colors.black,
                fontSize: 14,
                width: 40,
                textAlign: 'center',
              }}>
              {item?.selectedQty}
            </Text>
            <TouchableOpacity
              onPress={() => handleIncreaseQuantity(item)}
              style={{
                height: width(8),
                width: width(8),
                backgroundColor: colors.white,
                borderRadius: 100,
                borderColor: colors.red,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinBold,
                  color: colors.black,
                  fontSize: 14,
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          {type === 'reOccuring' && (
            <View
              style={{
                height: width(10),
                width: width(30),
                marginTop: width(2),
              }}>
              <PrimaryButton
                name={'Customize'}
                bgcColor={colors.redish}
                color={colors.white}
                onPress={
                  onCustomizePress ||
                  (() =>
                    Alert.alert(
                      'Coming Soon',
                      'This feature is currently under development. Please check back later!',
                    ))
                }
              />
            </View>
          )}
        </View>

        {(type !== 'checkout' || ischeckout) && (
          <TouchableOpacity
            onPress={() => handleSelectToCheckout(item)}
            style={{
              backgroundColor: item.isSelected ? colors.redish : colors.white,
              height: width(5),
              width: width(5),
              borderRadius: width(1),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.redish,
            }}>
            {item.isSelected && (
              <Image
                source={icons.tickIcon}
                resizeMode="contain"
                style={{height: '60%', width: '60%'}}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: width(3),
        }}>
        <Image
          source={
            item?.merchant?.merchantImage
              ? {uri: item?.merchant?.merchantImage}
              : images.cheif
          }
          style={{height: width(10), width: width(10), borderRadius: width(5)}}
          resizeMode="cover"
        />
        <View style={{marginLeft: 8}}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: fontFamily.poppinBold,
              color: colors.primaryOrange,
            }}>
            Made by
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.poppinBold,
              color: colors.black,
            }}>
            {item?.merchant?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PreOrderCard;
