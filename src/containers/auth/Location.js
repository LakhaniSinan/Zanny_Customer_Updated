import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {ChangeScreen} from './SignUp';
import Button from '../../components/button';
import Geolocation from 'react-native-geolocation-service';

const Location = () => {
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {},
      error => {
        // See error code charts below.
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const onPress = () => {
    alert('Api call');
  };

  return (
    <SafeAreaView>
      <Button heading={'Next'} onPress={onPress} />
    </SafeAreaView>
  );
};
export default Location;
