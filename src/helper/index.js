import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { Linking, Platform } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { constants } from '../constants';
import axios from 'axios';
import { notification } from '../constants/variables';

export const helper = {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, error => reject(error => { }), {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    }).catch(err => {
      console.log(err, 'errrr');
    });
  },

  async checkLocation() {
    if (Platform.OS == 'android') {
      return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        async status => {
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            console.log('DENIED');
            let result = await request(
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            );
            console.log(result, 'resultresultresult');
            if (result === 'granted') {
              return 'granted';
            } else if (result == 'blocked') {
              constants?.confirmationModal.isVisible({
                message:
                  'Please turn On your Location from settings in order to get Resturants Near You',
                NegText: 'Later',
                PosText: 'Open Settings',
                PosPress: () => Linking.openSettings(),
              });
            } else {
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            }
          } else if (status == 'blocked') {
            console.log('BLOCKED');
            return 'blocked';
          } else {
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          }
        },
      );
    } else {
      return await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async status => {
          console.log(status, 'STATUS_IOS');
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            console.log('DENIED');
            let result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            console.log(result, 'resultresultresult');
            if (result === 'granted') {
              return 'granted';
            } else if (result == 'blocked') {
              constants?.confirmationModal.isVisible({
                message:
                  'Please turn On your Location from settings in order to get Resturants Near You',
                NegText: 'Later',
                PosText: 'Open Settings',
                PosPress: () => Linking.openSettings(),
              });
            } else {
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            }
          } else if (status == 'blocked') {
            console.log('BLOCKED');
            return 'blocked';
          } else {
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          }
        })
        .catch(err => {
          console.log(err, 'err');
        });
    }
  },

  async getLocationAddress(lat, long) {
    return new Promise((resolve, reject) => {
      Geocoder.init('AIzaSyDgm3VBE9YF9fIYqHU6Cue4OfJBtJBlxj4');
      Geocoder.from(lat, long)
        .then(json => resolve(json))
        .catch(error => reject(error));
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
