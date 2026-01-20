import ImageResizer from '@bam.tech/react-native-image-resizer';
import axios from 'axios';
import {Alert, Linking, Platform, Share} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {notification} from '../constants/variables';

export const helper = {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => {
          console.log('Location error:', error.code, error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    });
  },

  async checkLocation() {
    try {
      if (Platform.OS === 'android') {
        let status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (status === RESULTS.DENIED) {
          status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        return status; // granted | denied | blocked
      }

      // iOS
      let status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (status === RESULTS.DENIED) {
        status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }

      return status; // granted | denied | blocked
    } catch (e) {
      console.log('checkLocation error:', e);
      return RESULTS.BLOCKED;
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

  async requestLocationPermission() {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const status = await request(permission);
      return status; // granted | denied | blocked
    } catch (error) {
      console.log('Request location error:', error);
      return RESULTS.UNAVAILABLE;
    }
  },

  async getLocationAddress(lat, lng) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA`;

      const res = await axios.get(url);

      if (res.data?.status === 'OK') {
        return res?.data?.results[0]?.formatted_address;
      }

      return '';
    } catch (e) {
      console.log('Geocode error:', e?.message);
      return '';
    }
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
  async getDistanceInKm(lat1, lon1, lat2, lon2) {
    const toRad = value => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  },
};
