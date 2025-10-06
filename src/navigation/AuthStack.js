import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Restaurants from '../containers/app/restaurants';
import TermsAndConditions from '../containers/app/termsAndConditions';
import UserAllergies from '../containers/app/userAllergies';
import CodeVerification from '../containers/auth/Codeverification';
import ForgotPassword from '../containers/auth/forgotPassword';
import Login from '../containers/auth/Login';
import ResetPassword from '../containers/auth/resetPassword';
import SignUp from '../containers/auth/SignUp';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="TermsAndConditions"
        component={TermsAndConditions}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SignUp"
        component={SignUp}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CodeVerification"
        component={CodeVerification}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ResetPassword"
        component={ResetPassword}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="UserAllergies"
        component={UserAllergies}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="AllRestaurants"
        component={Restaurants}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
