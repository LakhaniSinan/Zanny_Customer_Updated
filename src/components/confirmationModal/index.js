import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {width} from 'react-native-dimension';
import Modal from 'react-native-modal';
import {colors} from '../../constants';
let propsData = {};

const ConfirmationModal = React.forwardRef((props, ref) => {
  const [isVisible, ModalVisibility] = useState(false);

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      propsData = params;
      ModalVisibility(true);
    },
    backdropPress() {
      ModalVisibility(false);
    },
  }));

  const {message, PosText, PosPress, NegText, NegPress} = propsData;
  return (
    <Modal
      style={{alignSelf: 'center', alignItems: 'center'}}
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      backdropOpacity={0.5}
      useNativeDriver={true}
      // onBackdropPress={() => props.hideModal}
      hideModalContentWhileAnimating={true}>
      <View
        style={{
          width: width(86),
          backgroundColor: 'white',
          borderRadius: width(2),
          padding: width(8),
        }}>
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            marginVertical: width(2),
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          {message}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: width(2),
            justifyContent: 'space-around',
          }}>
          {NegText && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.yellow,
                paddingVertical: width(3),
                paddingHorizontal: width(6),
                borderRadius: 10,
              }}
              onPress={() => {
                ModalVisibility(false), NegPress;
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {NegText}
              </Text>
            </TouchableOpacity>
          )}
          {PosText && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.yellow,
                paddingVertical: width(3),
                paddingHorizontal: width(6),
                borderRadius: 10,
              }}
              onPress={() => {
                PosPress(), ModalVisibility(false);
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {PosText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
});

export default ConfirmationModal;
