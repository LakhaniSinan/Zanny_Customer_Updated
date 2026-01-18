import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Linking, Platform, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import Modal from 'react-native-modal';
import {fontFamily, images} from '../../assets';
import {colors} from '../../constants';
import PrimaryButton from '../primaryButton';
import {exitApp} from '@logicwind/react-native-exit-app';

let propsData = {};

const UpdatePopUp = React.forwardRef((props, ref) => {
  const {handleButton} = props;
  const [isVisible, ModalVisibility] = useState(false);
  const navigation = useNavigation();

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      ModalVisibility(true);
    },
    backdropPress() {
      ModalVisibility(false);
    },
  }));

  return (
    <Modal
      style={{alignSelf: 'center', alignItems: 'center'}}
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}>
      <View
        style={{
          width: width(86),
          backgroundColor: 'white',
          borderRadius: width(2),
          padding: width(8),
        }}>
        <View
          style={{
            alignSelf: 'center',
            height: width(25),
            width: width(25),
            backgroundColor: colors.white,
          }}>
          <Image
            source={images.appLogo}
            resizeMode="contain"
            style={{
              height: width(25),
              width: width(25),
              borderRadius: 100,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: width(4),
            fontFamily: fontFamily.poppinBold,
            color: colors.black,
            textAlign: 'center',
            marginTop: width(5),
          }}>
          New Features Available!
        </Text>
        <Text
          style={{
            fontSize: width(2.5),
            fontFamily: fontFamily.poppinBold,
            color: colors.black,
            textAlign: 'center',
            marginTop: width(5),
          }}>
          A new version brings performance boosts and exciting features. Please
          update to continue.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: width(5),
          }}>
          <View
            style={{
              width: '45%',
              marginTop: width(6),
              height: width(15),
            }}>
            <PrimaryButton
              name={'Cancel'}
              onPress={() => {
                ModalVisibility(false);
                setTimeout(() => {
                  exitApp();
                }, 1000);
              }}
            />
          </View>
          <View
            style={{
              width: '45%',
              marginTop: width(6),
              height: width(15),
            }}>
            <PrimaryButton
              name={'Update'}
              onPress={() => {
                Platform.OS == 'android'
                  ? Linking.openURL(
                      'https://play.google.com/store/apps/details?id=com.zanny_customer',
                    )
                  : Linking.openURL(
                      'https://apps.apple.com/pk/app/zannys-food-customers/id1670808100',
                    );
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default UpdatePopUp;
