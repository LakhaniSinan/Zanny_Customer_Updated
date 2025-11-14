import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WelcomeScreen from '../containers/auth/WelComeScreen';
import { setUserData } from '../redux/slices/Login';
import DrawerNavigation from './drawer';
import Login from '../containers/auth/Login';
import BottomNavigation from './bottomTab';

const Navigation = () => {
  const disptach = useDispatch();
  const { isGetStarted } = useSelector(state => state.GetStarted);
  console.log(isGetStarted, "isGetStartedisGetStartedisGetStarted");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    disptach(setUserData(data));
  };

  return (
    <NavigationContainer>
      {/* <Login /> */}
      {isGetStarted ? <BottomNavigation /> : <WelcomeScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
