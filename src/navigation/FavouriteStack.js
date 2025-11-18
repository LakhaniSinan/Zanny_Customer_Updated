import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Favourite from '../containers/app/favourite';

const Stack = createStackNavigator();

function FavouriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favourite"
        component={Favourite}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default FavouriteStack;
