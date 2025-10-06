import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CustomerPrivateOrders from '../containers/app/customerPrivateOrders';
import PrivateOrderDetail from '../containers/app/privateOrderDetails';


const Stack = createStackNavigator();

function CustomerPrivateOrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerPrivateOrders"
        component={CustomerPrivateOrders}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivateOrderDetail"
        component={PrivateOrderDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default CustomerPrivateOrderStack;
