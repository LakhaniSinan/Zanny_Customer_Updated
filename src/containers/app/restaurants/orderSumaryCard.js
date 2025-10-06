import React from 'react';
import { View, Text } from 'react-native';
import styles from './style';
import Foundation from 'react-native-vector-icons/Foundation';
import { width } from 'react-native-dimension';
import { AppContext } from '../../../context';
import { colors } from './../../../constants/index';
import { useSelector } from 'react-redux';
const OrderSummaryCard = ({ orderType, orderBill, charges, serviceCharges }) => {
  let cartData = useSelector(state => state.CartSlice.cartData);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: width(4),
          marginVertical: width(3),
        }}>
        <Foundation
          name="clipboard-notes"
          color={colors.yellow}
          size={22}
          onPress={() => navigation.navigate('Addresses')}
        />
        <Text style={styles.heading}>Order Summary</Text>
      </View>
      <View style={{ marginVertical: width(4) }}>
        {cartData.length > 0 &&
          cartData.map(item => {
            return (
              <View
                style={{
                  marginHorizontal: width(4),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ color: 'black' }}>
                  {item.selectedQty} x {item.name}
                </Text>
                <Text style={{ color: 'black' }}>
                  £{item.discount > 0 ? item.discount : item.price}
                </Text>
              </View>
            );
          })}
        <View
          style={{
            borderWidth: .5,
            borderColor: '#000',
            marginVertical: 10,
            marginHorizontal: width(4),
          }}
        />
      </View>
      <View
        style={{
          marginHorizontal: width(4),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: 'black' }}>Sub total</Text>
        <Text style={{ color: 'black' }}>£{orderBill.subTotal}</Text>
      </View>
      <View
        style={{
          marginHorizontal: width(4),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: 'black' }}>Service Charges</Text>
        <Text style={{ color: 'black' }}>£{serviceCharges?.toFixed(2)}</Text>
      </View>
      {orderType !== "pickup" && <View
        style={{
          marginHorizontal: width(4),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: 'black' }}>Delivery Charges</Text>
        <Text style={{ color: 'black' }}>£{charges}</Text>
      </View>}
    </View>
  );
};

export default OrderSummaryCard;
