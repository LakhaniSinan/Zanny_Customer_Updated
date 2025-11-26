import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Favourite from '../containers/app/favourite';
import ProductDetail from '../containers/app/productDetail';
import CartScreen from '../containers/app/cartScreen';

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
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
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
    </Stack.Navigator>
  );
}

export default FavouriteStack;
