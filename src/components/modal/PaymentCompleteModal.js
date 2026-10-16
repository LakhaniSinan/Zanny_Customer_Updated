import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {width} from 'react-native-dimension';

import {fontFamily, icons} from '../../assets';
import {colors} from '../../constants';

/**
 * Centered success dialog — payment complete.
 * Okay → caller should reset navigation to Home (e.g. BottomStack index 0).
 */
const PaymentCompleteModal = ({visible, onOkay}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Image
              source={icons.check}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Payment Complete</Text>
          <Text style={styles.subtitle}>Payment complete</Text>

          <Text style={styles.info}>
            Update about your order would be sent to your email
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onOkay}
            activeOpacity={0.85}>
            <Text style={styles.buttonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width(6),
  },
  card: {
    width: '100%',
    maxWidth: width(88),
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: width(6),
    paddingTop: width(8),
    paddingBottom: width(6),
    alignItems: 'center',
  },
  iconCircle: {
    width: width(18),
    height: width(18),
    borderRadius: 999,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width(5),
  },
  checkIcon: {
    width: width(9),
    height: width(9),
  },
  title: {
    fontFamily: fontFamily.poppinBold,
    fontSize: 22,
    color: colors.black,
    textAlign: 'center',
    marginBottom: width(2),
  },
  subtitle: {
    fontFamily: fontFamily.poppinMedium,
    fontSize: 14,
    color: colors.grayyy,
    textAlign: 'center',
    marginBottom: width(5),
  },
  info: {
    fontFamily: fontFamily.poppinRegular,
    fontSize: 13,
    color: colors.graydark,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: width(7),
    paddingHorizontal: width(2),
  },
  button: {
    width: '100%',
    backgroundColor: colors.black,
    paddingVertical: width(3.5),
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: 16,
    color: colors.white,
  },
});

export default PaymentCompleteModal;
