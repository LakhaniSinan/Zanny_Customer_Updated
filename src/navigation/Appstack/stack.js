import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNav from './bottomNav';
import ProductDetail from '../../container/app/productDetail';
import ShoppingCart from '../../container/app/shoppingCart';
import Delicacies from '../../container/app/Delicacies';
const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomNav"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomNav" component={BottomNav} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
      <Stack.Screen name="Delicacies" component={Delicacies} />
    </Stack.Navigator>
  );
};

export default AppStack;
