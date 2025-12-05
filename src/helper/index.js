import {check, PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {Linking, Platform, Share} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {constants} from '../constants';
import axios from 'axios';
import {notification} from '../constants/variables';

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
  async handleShare(valueee) {
    try {
      const result = await Share.share({
        message: valueee,
        // url: activeMedia
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
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
          console.log('Geocoding API response status:', data.status);
          console.log('Full API response:', JSON.stringify(data, null, 2));

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

  async ImageUploadService(imagee) {
    const form = new FormData();
    form.append('file', imagee);
    form.append('upload_preset', 'znuys2j4');
    form.append('cloud_name', 'dcmawlfn2');

    return new Promise((resolve, reject) => {
      axios
        .post(`https://api.cloudinary.com/v1_1/dcmawlfn2/image/upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            resolve(response.data.secure_url);
          } else {
            reject('Image uploading failed.');
          }
        })
        .catch(error => {
          reject('Image uploading failed.');
        });
    });
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
