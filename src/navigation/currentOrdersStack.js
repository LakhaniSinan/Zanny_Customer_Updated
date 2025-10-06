import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Orders from './../containers/app/orders/index';
import OrderDetail from './../containers/app/orderDetails/index';

const Stack = createStackNavigator();

function CurrentOrdersStack() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

export default CurrentOrdersStack;
