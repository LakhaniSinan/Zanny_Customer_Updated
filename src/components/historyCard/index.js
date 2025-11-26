import {View, Text, Image} from 'react-native';
import React from 'react';
import {fontFamily, icons, images} from '../../assets';
import ActionBuuton from '../actionButton';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../constants';
import {width} from 'react-native-dimension';

const HistoryCard = ({item}) => {
  const navigation = useNavigation();
  const data = item?.order[0];
  console.log(item, 'itemitemitemitemitemlkasndkla');

  const hasDiscount = data?.discount && data?.discount < data?.price;
  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {bg: 'rgba(255,165,0,0.2)', color: '#FFA500'};
      case 'accepted':
        return {bg: 'rgba(30,144,255,0.2)', color: '#1E90FF'};
      case 'rejected':
        return {bg: 'rgba(255,69,0,0.2)', color: '#FF4500'};
      case 'completed':
        return {bg: 'rgba(50,205,50,0.2)', color: '#32CD32'};
      default:
        return {bg: 'rgba(144,238,144,0.3)', color: '#32CD32'};
    }
  };

  const statusStyle = getStatusStyle(item?.status);

  return (
    <View
      style={{
        marginTop: width(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        paddingBottom: width(5),
        marginHorizontal: width(4),
        backgroundColor: colors.white,
        borderRadius: width(2),
        padding: width(3),
      }}>
      {/* Top Row: Image + Info */}
      <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
        <Image
          source={{uri: data?.image}}
          resizeMode="cover"
          style={{
            height: width(22),
            width: width(22),
            borderRadius: width(2),
          }}
        />

        <View style={{flex: 1}}>
          {/* Name */}
          <Text
            style={{
              fontSize: 16,
              color: colors.black,
              fontFamily: fontFamily.poppinBold,
            }}>
            {data?.name}
          </Text>

          {/* Price */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            {hasDiscount ? (
              <>
                <Text
                  style={{
                    color: colors.red,
                    fontFamily: fontFamily.poppinBold,
                    fontSize: 16,
                  }}>
                  £{data?.discount}
                </Text>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 12,
                    textDecorationLine: 'line-through',
                    color: colors.grey,
                    fontFamily: fontFamily.poppin,
                  }}>
                  £{data?.price}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fontFamily.poppinBold,
                  fontSize: 16,
                }}>
                £{data?.price}
              </Text>
            )}
          </View>

          {/* Status */}
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
                backgroundColor: statusStyle.bg,
                borderWidth: 1,
                borderColor: statusStyle.color,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: statusStyle.color,
                  fontFamily: fontFamily.poppinBold,
                }}>
                {item?.status || 'Delivered'}
              </Text>
            </View>
          </View>

          {/* Button */}
          <View style={{width: width(50), marginTop: width(3)}}>
            {item?.status === 'Completed' ? (
              <ActionBuuton
                bgcColor={'#3b0b0b'}
                fontColor={colors.white}
                name={'View details'}
                onPress={() => navigation.navigate('OrderDetail', item)}
              />
            ) : (
              <ActionBuuton
                bgcColor={'#3b0b0b'}
                fontColor={colors.white}
                name={'Order again'}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: data?._id})
                }
              />
            )}
          </View>
        </View>
      </View>

      {/* Chef Info */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: width(3),
        }}>
        <Image
          source={{uri: item?.merchantDetails?.merchantImage || ''}}
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
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.poppinBold,
              color: colors.black,
            }}>
            {item?.merchantDetails?.name || 'Leanne Wayne'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
