import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {width, height} from 'react-native-dimension';
import {colors} from '../../constants';

const CartImage = ({imageUrl, imgContainer, imgStyle}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={imgContainer}>
      <Image
        onLoadEnd={() => setImageLoading(false)}
        source={{uri: imageUrl}}
        style={imgStyle}
        resizeMode="cover"
      />
      {imageLoading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}>
          <ActivityIndicator size={'large'} color={colors.yellow} />
        </View>
      )}
    </View>
  );
};

export default CartImage;
