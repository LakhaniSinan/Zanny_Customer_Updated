import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AuthStack from './AuthStack';
import {setUserData} from '../redux/slices/Login';
import BottomNavigation from './bottomTab';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        const parsed = stored ? JSON.parse(stored) : null;
        dispatch(setUserData(parsed));
      } catch (_err) {
        dispatch(setUserData(null));
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateUser();
  }, []);

  if (!isHydrated) return null;

  const {user} = useSelector(state => state.LoginSlice);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={user ? 'App' : 'Auth'}
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Auth" component={AuthStack} />
        <RootStack.Screen name="App" component={BottomNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
