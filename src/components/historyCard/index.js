import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../assets';
import { colors } from '../../constants';
import ActionButton from '../actionButton';
import { useDispatch, useSelector } from 'react-redux';

const HistoryCard = ({ item, handleAddToCart }) => {
  console.log(item, 'itemitemitemitemitemitemitemmaskmdalsdmasd');

  const navigation = useNavigation();

  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: 'rgba(255,165,0,0.2)', color: '#FFA500' };
      case 'accepted':
        return { bg: 'rgba(30,144,255,0.2)', color: '#1E90FF' };
      case 'rejected':
        return { bg: 'rgba(255,69,0,0.2)', color: '#FF4500' };
      case 'completed':
        return { bg: 'rgba(50,205,50,0.2)', color: '#32CD32' };
      default:
        return { bg: 'rgba(144,238,144,0.3)', color: '#32CD32' };
    }
  };

  const statusStyle = getStatusStyle(item?.status);
  const { user } = useSelector(state => state.LoginSlice);
  const { cartData } = useSelector(state => state.CartSlice);
  const dispatch = useDispatch();
  
  return (
    <View
      style={{
        marginTop: width(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        paddingBottom: width(4),
        marginHorizontal: width(4),
        backgroundColor: colors.white,
        borderRadius: width(2),
        padding: width(3),
      }}>
      {/* ================= TOP SUMMARY ================= */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.poppinBold,
            color: colors.black,
          }}>
          Order #{item?.orderCode}
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
            {item?.status}
          </Text>
        </View>
      </View>

      {/* DATE */}
      <Text
        style={{
          marginTop: 3,
          fontSize: 12,
          color: colors.grey,
          fontFamily: fontFamily.poppin,
        }}>
        {item?.date}
      </Text>

      {/* ================= PRODUCTS LIST ================= */}
      <FlatList
        data={item?.order}
        scrollEnabled={false}
        keyExtractor={(i, index) => index.toString()}
        style={{ marginTop: width(3) }}
        renderItem={({ item: product }) => {
          console.log(product, 'productproductproductproductproductasd');

          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: width(3),
              }}>
              <Image
                source={{ uri: product?.image }}
                style={{
                  height: width(18),
                  width: width(18),
                  borderRadius: width(2),
                }}
                resizeMode="cover"
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fontFamily.poppinBold,
                    color: colors.black,
                  }}>
                  {product?.name}
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 12,
                    color: colors.grey,
                    fontFamily: fontFamily.poppin,
                  }}>
                  Qty: {product?.quantity || product?.selectedQty}
                </Text>

                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 14,
                    fontFamily: fontFamily.poppinBold,
                    color: colors.black,
                  }}>
                  £{product?.price}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View
        style={{
          marginTop: width(2),
          paddingVertical: width(2),
          borderTopWidth: 1,
          borderColor: colors.lightGrey,
        }}>
        {item?.promoData !== null && (
          <View style={{}}>
            <Text
              style={{
                alignSelf: 'flex-end',
                fontSize: 14,
                fontFamily: fontFamily.poppinBold,
                color: colors.black,
              }}>
              Promo Code: {item?.promoData?.promoCode}
            </Text>
            <Text
              style={{
                alignSelf: 'flex-end',
                fontSize: 14,
                fontFamily: fontFamily.poppinBold,
                color: colors.black,
              }}>
              Promo Discount : {item?.promoData?.discount} %OFF
            </Text>
          </View>
        )}
        <Text
          style={{
            alignSelf: 'flex-end',
            fontSize: 14,
            fontFamily: fontFamily.poppinBold,
            color: colors.black,
          }}>
          Total Paid: £{item?.totalBill}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: width(2),
        }}>
        <Image
          source={{ uri: item?.order[0]?.merchant?.merchantImage }}
          style={{
            height: width(10),
            width: width(10),
            borderRadius: width(5),
          }}
        />
        <View style={{ marginLeft: 8 }}>
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
            {item?.order[0]?.merchant?.name}
          </Text>
        </View>
      </View>

      {/* ================= BUTTON ================= */}
      {item?.status == 'Completed' && (
        <View style={{ marginTop: width(3) }}>
          <ActionButton
            bgcColor={'#3b0b0b'}
            fontColor={colors.white}
            name={'Order Again'}
            onPress={() => handleAddToCart(item)}
          />
        </View>
      )}
      {item?.status !== 'Completed' && (
        <View style={{ marginTop: width(3) }}>
          <ActionButton
            bgcColor={'#3b0b0b'}
            fontColor={colors.white}
            name={'View details'}
            onPress={() => navigation.navigate('OrderDetail', item)}
          />
        </View>
      )}
    </View>
  );
};

export default HistoryCard;
