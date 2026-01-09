import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import WelcomeScreen from '../containers/auth/WelComeScreen';
import {setUserData} from '../redux/slices/Login';
import {CustomerStack} from './appStack';

const Navigation = () => {
  const dispatch = useDispatch();
  const {isGetStarted} = useSelector(state => state.GetStarted);
  const [isHydrated, setIsHydrated] = useState(false);
  const navigationRef = useRef(null);

  const linking = {
    prefixes: [
      'https://zannysfood.com',
      'https://www.zannysfood.com',
      'zannysfood://',
    ],
    config: {
      screens: {
        CustomerStack: {
          screens: {
            BottomStack: {
              screens: {
                Home: 'home',
              },
            },
            ProductDetail: {
              path: 'app/ProductDetail/:productId',
              parse: {
                productId: productId => productId,
              },
            },
          },
        },
      },
    },
  };

  // Handle deep links manually to ensure proper navigation
  useEffect(() => {
    if (!isHydrated || !isGetStarted || !navigationRef.current) return;

    const handleDeepLink = url => {
      if (!url || !navigationRef.current) return;

      console.log('Deep link received:', url);

      // Extract productId from URL - handle both full URLs and paths
      let productId = null;
      const fullUrlMatch = url.match(/app\/ProductDetail\/([^/?]+)/);
      const pathMatch = url.match(/ProductDetail\/([^/?]+)/);

      if (fullUrlMatch) {
        productId = fullUrlMatch[1];
      } else if (pathMatch) {
        productId = pathMatch[1];
      }

      if (productId) {
        console.log('Navigating to ProductDetail with productId:', productId);

        // Navigate to ProductDetail - it will be pushed on top of the current stack
        // Since CustomerStack has BottomStack as initial route, it should already be in the stack
        // So ProductDetail will be pushed on top, allowing users to go back to BottomStack
        try {
          navigationRef.current.navigate('ProductDetail', {
            productId: productId,
          });
        } catch (error) {
          console.log('Navigation error:', error);
          // Fallback: use CommonActions to ensure proper navigation state
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'ProductDetail',
              params: {
                productId: productId,
              },
            }),
          );
        }
      }
    };

    // Handle initial URL (when app is opened from a deep link)
    const checkInitialURL = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          console.log('Initial URL:', url);
          // Delay to ensure navigation is ready
          setTimeout(() => {
            handleDeepLink(url);
          }, 1000);
        }
      } catch (error) {
        console.log('Error getting initial URL:', error);
      }
    };

    checkInitialURL();

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', event => {
      console.log('URL event:', event.url);
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, [isHydrated, isGetStarted]);

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
    <NavigationContainer ref={navigationRef} linking={linking}>
      {isGetStarted ? <CustomerStack /> : <WelcomeScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
