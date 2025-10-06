import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Restaurants from './../containers/app/restaurants/index';
import Products from './../containers/app/restaurants/products';
import Cart from './../containers/app/restaurants/cart';
import Checkout from './../containers/app/restaurants/checkout';
import Allergies from '../containers/app/allergies';
import UserQuestions from './../containers/app/userQuestions/index';
import Address from '../containers/app/address';
import AddEditAddress from '../containers/app/address/addEditAddress';
import PaymentCard from '../containers/app/paymentCard';
import AddEditPaymentCard from '../containers/app/paymentCard/addEditPaymentCard';
import PrivateOrder from '../containers/app/privateOrder';
import SearchScreen from '../containers/app/searchScreen';
import UserAllergies from '../containers/app/userAllergies';
import {useSelector} from 'react-redux';
import Reviews from '../containers/app/restaurants/reviews';
import PaymentOptions from '../containers/app/paymentOptions';
const Stack = createStackNavigator();

function OrderStack() {
  const user = useSelector(state => state.LoginSlice.user);
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="UserAllergies"
          component={UserAllergies}
          options={{
            headerShown: false,
          }}
        />
      <Stack.Screen
        name="AllRestaurants"
        component={Restaurants}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentCard"
        component={PaymentCard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEditPaymentCard"
        component={AddEditPaymentCard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEditAddress"
        component={AddEditAddress}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivateOrder"
        component={PrivateOrder}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentOptions"
        component={PaymentOptions}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default OrderStack;
