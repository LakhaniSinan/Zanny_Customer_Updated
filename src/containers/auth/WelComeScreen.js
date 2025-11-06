import React from 'react';
import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {images} from '../../assets';
import PrimaryButton from '../../components/primaryButton';
import {Colors} from '../../constants';
import {setGetStarted} from '../../redux/slices/GetStarted';

const WelcomeScreen = ({navigation}) => {
  const disptach = useDispatch();
  const handleGetStarted = () => {
    disptach(setGetStarted(true));
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{backgroundColor: 'red'}}>
        <Image
          source={images.women}
          style={{height: 600, width: width(100)}}
          resizeMode="cover"
        />
      </View>
      <LinearGradient
        colors={[
          Colors.linear,
          Colors.orangelite,
          Colors.orangelite,
          'rgba(255, 255, 255, 0)',
        ]}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        style={{
          height: width(100),
          width: width(100),
          position: 'absolute',
          bottom: 0,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 100,
          }}>
          <Text
            style={{
              fontSize: 42,
              fontWeight: 500,
              color: Colors.white,
              textAlign: 'center',
            }}>
            Discover Food You’ll Love
          </Text>
          <View style={{width: 220}}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 400,
                textAlign: 'center',
                color: Colors.white,
              }}>
              Explore personalized meal options that match your taste and
              lifestyle.
            </Text>
          </View>
          <View
            style={{
              height: width(15),
              width: '100%',
              marginTop: width(2),
              paddingHorizontal: width(3),
            }}>
            <PrimaryButton name={'Get Started'} onPress={handleGetStarted} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default WelcomeScreen;
