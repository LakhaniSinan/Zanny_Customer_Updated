import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import restaurants from '../../containers/app/restaurants';
const Stack = createStackNavigator();

function OrderStack() {
  const user = useSelector(state => state.LoginSlice.user);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllRestaurants"
        component={restaurants}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default OrderStack;
