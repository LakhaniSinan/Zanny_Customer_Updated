import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../constants';

const OrderCards = ({orders, title, type}) => {
  const navigation = useNavigation();

  return (
    <>
      <FlatList
        data={orders}
        renderItem={({item}) => (
          <TouchableOpacity
            style={cardsStyle.cardContainer}
            onPress={() =>
              navigation.navigate('OrderDetails', {orderData: item, type})
            }>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: width(1),
              }}>
              <Text style={cardsStyle.detailTitle}>Restaurant Name:</Text>
              <Text style={cardsStyle.detailValue}>{item.restName}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: width(1),
              }}>
              <Text style={cardsStyle.detailTitle}>Order ID:</Text>
              <Text style={cardsStyle.detailValue}>{item.orderId}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: width(1),
              }}>
              <Text style={cardsStyle.detailTitle}>
                Distance To Restaurant:
              </Text>
              <Text style={cardsStyle.detailValue}>{item.distanceToRest}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: width(1),
              }}>
              <Text style={cardsStyle.detailTitle}>
                Distance From Restaurant To Customer
              </Text>
              <Text style={cardsStyle.detailValue}>
                {item.distanceFromRestToCust}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

const cardsStyle = StyleSheet.create({
  cardContainer: {
    borderWidth: width(0.1),
    marginHorizontal: width(3),
    marginVertical: width(2),
    paddingHorizontal: width(2),
    paddingVertical: width(4.2),
    paddingHorizontal: width(5),
    borderRadius: 5,
    borderColor: colors.pinkColor,
  },
  detailTitle: {
    fontWeight: '300',
    color: colors.green,
    fontSize: 13,
  },
  detailValue: {
    fontWeight: '300',
    color: 'black',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default OrderCards;
