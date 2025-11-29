import React, {memo} from 'react';
import {Image, Modal, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {Colors} from '../../constants';
import PrimaryButton from '../primaryButton';

const CustomModal = ({
  type,
  visible = false,
  onPress = () => {},
  onConfirm = null,
  onCancel = null,
  name = '',
  detail = '',
  buttonName = 'OK',
  close = () => {},
  color,
  colors,
  Icon,
}) => {
  const primaryAction = onConfirm || onPress;
  const cancelAction = onCancel || close;
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {Icon && <Image source={Icon} style={styles.icon} />}
          <Text style={[styles.title, {color: color || Colors.black}]}>
            {name}
          </Text>

          <Text style={[styles.detail, {color: colors || Colors.grayyy}]}>
            {detail}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            {type === 'confirmation' && (
              <View style={styles.btnWrapper}>
                <PrimaryButton name={'Cancel'} onPress={cancelAction} />
              </View>
            )}
            <View style={styles.btnWrapper}>
              <PrimaryButton name={buttonName} onPress={primaryAction} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(CustomModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  container: {
    width: width(90),
    height: width(100),
    backgroundColor: Colors.white,
    borderRadius: 14,
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width(3),
    gap: 25,
  },
  icon: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  btnWrapper: {
    width: '45%',
    marginTop: width(6),
    height: width(15),
  },
});
