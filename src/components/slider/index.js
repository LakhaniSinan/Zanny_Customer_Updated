import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, View, Animated} from 'react-native';
import {colors} from '../../constants';
import {fontFamily} from '../../assets';

const {width} = Dimensions.get('window');

const messages = [
  'For better experience, please allow permission',
  'We need location access to serve you better',
  'Don’t worry, your data is safe with us',
];

export default function PermissionSlider() {
  const translateX = useRef(new Animated.Value(width)).current;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const animateMessage = () => {
      translateX.setValue(width); // start from right

      // calculate width of message for speed consistency
      const message = messages[currentMessageIndex];
      const messageLength = message.length;
      const speed = 40; // pixels per second, adjust for smoothness
      const distance = width + messageLength * 8; // approx char width 8px
      const duration = (distance / speed) * 1000; // duration in ms

      Animated.timing(translateX, {
        toValue: -distance,
        duration,
        useNativeDriver: true,
      }).start(() => {
        // immediately move to next message
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      });
    };

    animateMessage();
  }, [currentMessageIndex]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.message,
          {
            transform: [{translateX}],
          },
        ]}>
        {messages[currentMessageIndex]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.red,
    paddingHorizontal: 10,
  },
  message: {
    fontSize: 14,
    fontFamily: fontFamily.poppinBold,
    color: colors.white,
    fontWeight: 'bold',
  },
});
