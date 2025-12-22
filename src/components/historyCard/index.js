import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons} from '../../assets';
import {colors} from '../../constants';
import ActionButton from '../actionButton';

const HistoryCard = ({item, handleAddToCart}) => {
  const navigation = useNavigation();

  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {bg: 'rgba(255,165,0,0.2)', color: '#FFA500'};
      case 'accepted':
        return {bg: 'rgba(30,144,255,0.2)', color: '#1E90FF'};
      case 'cancelled':
        return {bg: 'rgba(255,69,0,0.2)', color: '#FF4500'};
      case 'completed':
      case 'delivered':
        return {bg: 'rgba(50,205,50,0.2)', color: '#32CD32'};
      default:
        return {bg: 'rgba(144,238,144,0.3)', color: '#32CD32'};
    }
  };

  const statusStyle = getStatusStyle(item?.status);
  const product = item?.order?.[0];

  return (
    <View
      style={{
        backgroundColor: colors.white,
        marginHorizontal: width(4),
        paddingVertical: width(2),
        marginTop: width(4),
        borderRadius: width(3),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: product?.image}}
          style={{
            width: width(35),
            height: width(35),
            borderRadius: width(3),
          }}
        />

        <View style={{flex: 1, marginLeft: width(3)}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontFamily: fontFamily.poppinBold,
              color: '#7a1f1f',
            }}>
            {product?.name}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamily.poppinBold,
                color: colors.primaryOrange,
              }}>
              £{product?.price}
            </Text>

            {product?.oldPrice && (
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 13,
                  color: colors.grey,
                  textDecorationLine: 'line-through',
                }}>
                £{product?.oldPrice}
              </Text>
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: fontFamily.poppinSemiBold,
                marginRight: 6,
              }}>
              Status
            </Text>

            <View
              style={{
                backgroundColor: statusStyle.bg,
                paddingHorizontal: width(4),
                paddingVertical: 1,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: statusStyle.color,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamily.poppinBold,
                  color: statusStyle.color,
                }}>
                {item?.status}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: width(45),
              marginTop: width(3),
            }}>
            {item?.status === 'Completed' || item?.status === 'Delivered' ? (
              <ActionButton
                bgcColor="#3b0b0b"
                fontColor={colors.white}
                name="Order again"
                fontSize={12}
                onPress={() => handleAddToCart(item)}
              />
            ) : (
              <ActionButton
                bgcColor="#3b0b0b"
                fontColor={colors.white}
                name="View details"
                fontSize={10}
                onPress={() => navigation.navigate('OrderDetail', item)}
              />
            )}
          </View>
        </View>
      </View>

      <View style={{marginTop: width(4)}}>
        <Text
          style={{
            fontSize: 12,
            color: colors.black,
            fontFamily: fontFamily.poppinSemiBold,
            marginBottom: 6,
          }}>
          Made by
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: product?.merchant?.merchantImage}}
            style={{
              width: width(9),
              height: width(9),
              borderRadius: width(4.5),
            }}
          />

          <View style={{marginLeft: 8}}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: fontFamily.poppinBold,
                color: colors.primaryOrange,
              }}>
              Chef
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fontFamily.poppinBold,
                  color: colors.black,
                }}>
                {product?.merchant?.name}
              </Text>

              <Image
                source={icons.objects}
                style={{
                  width: 14,
                  height: 14,
                  marginLeft: 3,
                  marginBottom: 5,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
