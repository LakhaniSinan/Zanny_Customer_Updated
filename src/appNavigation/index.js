import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import WelcomeScreen from '../containers/auth/WelComeScreen';
import {setUserData} from '../redux/slices/Login';
import {CustomerStack} from './appStack';

const Navigation = () => {
  const dispatch = useDispatch();
  const {isGetStarted} = useSelector(state => state.GetStarted);
  const [isHydrated, setIsHydrated] = useState(false);

  const linking = {
    prefixes: [
      'https://zannysfood.com',
      'https://www.zannysfood.com',
      'zannysfood://',
    ],
    config: {
      screens: {
        ProductDetail: 'app/ProductDetail/:productId',
      },
    },
  };

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

  return (
    <NavigationContainer linking={linking}>
      {isGetStarted ? <CustomerStack /> : <WelcomeScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
