import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AuthSelection from '../../container/auth/authSelection';
import ForgetPassword from '../../container/auth/forgetPassword';
import Verification from '../../container/auth/forgetPassword/verification';
import LoginScreen from '../../container/auth/loginScreen';
import SignUpScreen from '../../container/auth/signUp';
import VerificationScreen from '../../container/auth/verify';
import WelcomeScreen from '../../container/auth/welcome';
import SetPassword from '../../container/auth/forgetPassword/setPassword';
const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="AuthSelection" component={AuthSelection} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="SetPassword" component={SetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
