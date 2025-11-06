import {View, Image} from 'react-native';
import React from 'react';
import {images} from '../../assets';
import {Colors} from '../../constants';
const SplachScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
      }}>
      <Image source={images.appLogo} style={{width: 208, height: 82}} />
    </View>
  );
};

export default SplachScreen;
