import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Orders from './../containers/app/orders/index';
import OrderDetail from './../containers/app/orderDetails/index';
import MyOrdersScreen from '../containers/app/myOrdersScreen';
import CartScreen from '../containers/app/cartScreen';
import ProductDetail from '../containers/app/productDetail';

const Stack = createStackNavigator();

function CurrentOrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyOrdersScreen"
        component={MyOrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyOrders"
        component={Orders}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default CurrentOrdersStack;
