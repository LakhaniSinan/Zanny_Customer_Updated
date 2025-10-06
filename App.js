import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import Navigation from './src/navigation';
import store from './src/redux/index';
import ConfirmationModal from './src/components/confirmationModal';
import {colors, constants} from './src/constants';
import TermsAndConditions from './src/containers/app/termsAndConditions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationPopup from 'react-native-push-notification-popup';
import {
  ActivityIndicator,
  View,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {images} from './src/assets';
import {notification} from './src/constants/variables';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    }, 2000);
  }, []);

  const getTerms = async () => {
    let data = await AsyncStorage.getItem('termsAccepted');
    if (data) {
      setTermsAccepted(JSON.parse(data));
    } else {
    }
  };

  if (isloading && !termsAccepted) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={colors.yellow} />
      </View>
    );
  }

  const handleAccepted = () => {
    setTermsAccepted(true);
  };

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        {showSplash ? (
          <SafeAreaView style={{flex: 1}}>
            <Image
              source={images.splashScreen}
              style={{height: '100%', width: '100%'}}
            />
          </SafeAreaView>
        ) : termsAccepted ? (
          <Navigation />
        ) : (
          <TermsAndConditions handleAccepted={handleAccepted} />
        )}
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
