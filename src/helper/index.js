import axios from 'axios';
import {Alert, Linking, Platform, Share} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS} from 'react-native-permissions';
import {notification} from '../constants/variables';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export const helper = {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, error => reject(error => {}), {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    });
  },

  async checkLocation() {
    if (Platform.OS == 'android') {
      return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        async status => {
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            return 'denied';
          } else if (status == 'blocked') {
            return 'blocked';
          }
        },
      );
    } else {
      return await Geolocation.requestAuthorization('whenInUse')
        .then(async status => {
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            return 'denied';
          } else if (status == 'blocked') {
            return 'blocked';
          }
        })
        .catch(err => {
          console.log(err, 'err');
        });
    }
  },
  /**
   * Share helper
   * valueee: main text message or object with { title?, text? }
   * options: { webLink, deepLink, title }
   */
  async handleShare(valueee, options = {}) {
    try {
      const title =
        options.title ||
        (typeof valueee === 'string' ? null : valueee.title) ||
        '';
      const text = typeof valueee === 'string' ? valueee : valueee.text || '';

      // prefer webLink for url (receivers expect https links), include deepLink in message as fallback
      const webLink = options.webLink || options.url;
      const deepLink = options.deepLink;

      let message = text || '';
      if (webLink) {
        message += (message ? '\n\n' : '') + webLink;
      }
      if (deepLink) {
        message += '\n\nOpen in app: ' + deepLink;
      }

      console.log(
        'Sharing message, title=',
        title,
        'webLink=',
        webLink,
        'deepLink=',
        deepLink,
      );

      const payload = {
        message,
      };
      if (title) payload.title = title;
      // Some platforms accept `url` separately
      if (webLink) payload.url = webLink;

      const result = await Share.share(payload);
      console.log('Share result', result);

      if (result.action === Share.dismissedAction) {
        // dismissed — show fallback
        if (deepLink) {
          Alert.alert('Open app', 'Open the product in app?', [
            {text: 'Open App', onPress: () => Linking.openURL(deepLink)},
            {text: 'Cancel', style: 'cancel'},
          ]);
        }
      }
    } catch (error) {
      console.log('Share error', error);
      // Fallback: show link and option to open app or copy link (if clipboard lib installed)
      const deepLink = options?.deepLink || options?.url;
      if (deepLink) {
        let ClipboardLib = null;
        try {
          // try optional clipboard package if installed
          // eslint-disable-next-line global-require
          ClipboardLib = require('@react-native-clipboard/clipboard').default;
        } catch (e) {
          ClipboardLib = null;
        }

        const buttons = [
          {text: 'Open App', onPress: () => Linking.openURL(deepLink)},
          {text: 'Cancel', style: 'cancel'},
        ];
        if (ClipboardLib) {
          buttons.unshift({
            text: 'Copy Link',
            onPress: () => ClipboardLib.setString(deepLink),
          });
        }

        Alert.alert(
          'Share failed',
          'You can open or copy the link manually.',
          buttons,
        );
      } else {
        Alert.alert('Share failed', error.message || String(error));
      }
    }
  },

  async getLocationAddress(lat, lng) {
    return new Promise((resolve, reject) => {
      console.log(`Attempting geocoding for coordinates: ${lat}, ${lng}`);

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA`;

      axios
        .get(url)
        .then(response => {
          const data = response.data;

          if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].formatted_address;
            console.log('Geocoding successful:', location);
            resolve(location);
          } else if (data.status === 'ZERO_RESULTS') {
            console.log('No results found for these coordinates');
            reject('No address found for these coordinates');
          } else if (data.status === 'REQUEST_DENIED') {
            console.log('API request denied:', data.error_message);
            reject(`API request denied: ${data.error_message}`);
          } else if (data.status === 'OVER_QUERY_LIMIT') {
            console.log('API quota exceeded');
            reject('API quota exceeded. Please try again later.');
          } else if (data.status === 'INVALID_REQUEST') {
            console.log('Invalid request parameters');
            reject('Invalid coordinates provided');
          } else {
            console.log('Geocoding failed - API response:', data);
            reject(
              `Geocoding failed. Status: ${data.status}, Error: ${
                data.error_message || 'Unknown error'
              }`,
            );
          }
        })
        .catch(error => {
          console.log(
            'Geocoding request error:',
            error.response?.data || error.message,
          );
          if (error.response?.status === 403) {
            reject('API key is invalid or restricted');
          } else if (error.response?.status === 429) {
            reject('Too many requests. Please try again later.');
          } else {
            reject(`Geocoding request failed. Network error: ${error.message}`);
          }
        });
    });
  },

  async resizeImage(image) {
    try {
      const resized = await ImageResizer.createResizedImage(
        image.uri,
        800,
        800,
        'JPEG',
        80,
        0,
      );

      return {
        uri: resized.uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      };
    } catch (err) {
      console.log('Resize error:', err);
      throw err;
    }
  },
  async ImageUploadService(imagee) {
    try {
      const resizedImage = await helper.resizeImage(imagee);

      const form = new FormData();
      form.append('file', resizedImage);
      form.append('upload_preset', 'znuys2j4');
      form.append('cloud_name', 'dcmawlfn2');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dcmawlfn2/image/upload',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.secure_url;
    } catch (error) {
      console.log('Upload error:', error);
      throw error;
    }
  },

  async notificationCall(titleee, bodyyy, handlePress) {
    return notification?.popup?.show({
      onPress: () => {
        if (handlePress) handlePress();
      },
      // appIconSource: require('../assets/launch_screen.png'),
      appTitle: 'Zanny Food App',
      timeText: 'Now',
      title: titleee,
      body: bodyyy,
      slideOutTime: 4000,
    });
  },
};
