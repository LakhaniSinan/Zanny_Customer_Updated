import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NotificationPopup from 'react-native-push-notification-popup';
import {Provider} from 'react-redux';
import {images} from './src/assets';
import ConfirmationModal from './src/components/confirmationModal';
import {colors, constants} from './src/constants';
import {notification} from './src/constants/variables';
import Navigation from './src/navigation';
import store from './src/redux/index';
import SplachScreen from './src/components/splashScreen';

const App = () => {
  const [termsAccepted, setTermsAccepted] = useState(null);
  const [isloading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

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

  const handleAccepted = () => {
    setTermsAccepted(true);
  };

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        {showSplash ? <SplachScreen /> : <Navigation />}
        <ConfirmationModal
          ref={ref => {
            constants.confirmationModal = ref;
          }}
        />
        <NotificationPopup ref={ref => (notification.popup = ref)} />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
