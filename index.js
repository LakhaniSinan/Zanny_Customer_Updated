/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import {helper} from './src/helper';

setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.log('Background Message:', remoteMessage);

  // Show local notification using your helper
  helper.notificationCall(
    remoteMessage.data?.title,
    remoteMessage.data?.body,
  );
});
AppRegistry.registerComponent(appName, () => App);
