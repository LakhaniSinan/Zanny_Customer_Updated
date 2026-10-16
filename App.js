
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NotificationPopup from 'react-native-push-notification-popup';
import {Provider} from 'react-redux';
import ConfirmationModal from './src/components/confirmationModal';
import {colors, constants} from './src/constants';
import {notification} from './src/constants/variables';

import {LogBox} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Navigation from './src/appNavigation';
import SplachScreen from './src/components/splashScreen';
import store from './src/redux/index';
LogBox.ignoreLogs(['useInsertionEffect must not schedule updates']);
LogBox.ignoreLogs(['Encountered two children with the same key']);
const App = () => {
  const [termsAccepted, setTermsAccepted] = useState(null);

  const [isloading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = store.dispatch;

  useEffect(() => {
    getTerms();
    setTimeout(() => {
      setShowSplash(false);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }, 4000);
  }, []);

  const getTerms = async () => {
    let data = await AsyncStorage.getItem('termsAccepted');
    if (data) {
      setTermsAccepted(JSON.parse(data));
    } else {
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
          <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
            {showSplash ? <SplachScreen /> : <Navigation />}
          </SafeAreaView>
          <ConfirmationModal
            ref={ref => {
              constants.confirmationModal = ref;
            }}
          />
          <NotificationPopup ref={ref => (notification.popup = ref)} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
