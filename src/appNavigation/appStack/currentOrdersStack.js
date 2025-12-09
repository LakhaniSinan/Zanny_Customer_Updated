import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import MyOrdersScreen from '../../containers/app/myOrdersScreen';

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
    </Stack.Navigator>
  );
}

export default CurrentOrdersStack;
