import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {FlatList, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {icons} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import BackButton from '../../../components/backIcon';
import CartCard from '../../../components/cartCard';
import {colors} from '../../../constants';
import AppHeader from '../../../components/headerComponent';

const parsePriceToNumber = price => {
  if (typeof price === 'number') {
    return price;
  }
  if (!price) {
    return 0;
  }
  const numeric = String(price).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numeric);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const CartScreen = () => {
  const navigation = useNavigation();
  const cartData = useSelector(state => state.CartSlice.cartData) || [];
  const addresses = useSelector(state => state.AddressSlice.address) || [];

  const addressLine =
    addresses?.[0]?.address ||
    addresses?.[0]?.full_address ||
    'Kawungcarang road no 28...';

  const {subTotal, delivery, total} = useMemo(() => {
    const sub = cartData.reduce((sum, item) => {
      const q = item?.quantity ?? 1;
      return sum + parsePriceToNumber(item?.price) * q;
    }, 0);
    const deliveryFee = 20; // as per UI example
    return {subTotal: sub, delivery: deliveryFee, total: sub + deliveryFee};
  }, [cartData]);

  const renderItem = ({item, index}) => <CartCard item={item} index={index} />;

  console.log(total, 'totaltotaltotaltotaltotal');

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader goBack={true} notificationsIcon={true} text="Cart" />
      <FlatList
        data={cartData}
        keyExtractor={(_, index) => `cart-item-${index}`}
        renderItem={renderItem}
        ListFooterComponent={
          <View style={{paddingBottom: width(30)}}>
            <View
              style={{
                marginHorizontal: width(4),
                marginTop: width(4),
                padding: width(3),
                borderRadius: width(3),
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black,
                      fontWeight: '700',
                      marginBottom: 4,
                    }}>
                    Delivery Address
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      color: colors.graydark,
                      maxWidth: '85%',
                    }}>
                    {addressLine}
                  </Text>
                </View>
                <View style={{width: width(22), height: width(9)}}>
                  <ActionBuuton
                    name="Change"
                    bgcColor={colors.redish}
                    fontColor={colors.white}
                    onPress={() => navigation.navigate('SelectAddress')}
                    fontSize={12}
                    height={width(9)}
                  />
                </View>
              </View>
            </View>

            {/* Payment Summary */}
            <View
              style={{
                marginHorizontal: width(4),
                marginTop: width(5),
                padding: width(4),
                backgroundColor: colors.white,
                borderRadius: width(3),
                borderWidth: 1,
                borderColor: colors.border,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontWeight: '700',
                  marginBottom: width(3),
                }}>
                Payment Summary
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: width(2),
                }}>
                <Text style={{color: colors.graydark, fontSize: 14}}>
                  Sub Total
                </Text>
                <Text
                  style={{
                    color: colors.redish,
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  £{subTotal.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: width(2),
                }}>
                <Text style={{color: colors.graydark, fontSize: 14}}>
                  Delivery
                </Text>
                <Text
                  style={{
                    color: colors.redish,
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  £{delivery.toFixed(0)}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: width(2),
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  Total Price
                </Text>
                <Text
                  style={{
                    color: colors.redish,
                    fontSize: 18,
                    fontWeight: '800',
                  }}>
                  £{total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        }
      />

      {/* Bottom CTA */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: width(4),
          paddingHorizontal: width(4),
        }}>
        <View style={{height: width(12)}}>
          <ActionBuuton
            name="Proceed to Payment"
            bgcColor={colors.black}
            fontColor={colors.white}
            onPress={() => navigation.navigate('Payment')}
            fontSize={14}
            height={width(12)}
          />
        </View>
      </View>
    </View>
  );
};

export default CartScreen;
