import React, {useState} from 'react';
import {width} from 'react-native-dimension';
import Modal from 'react-native-modal';

let data = {};

const CommonModal = React.forwardRef((props, ref) => {
  const [isVisible, ModalVisibility] = useState(false);

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      data = params;
      ModalVisibility(true);
    },
    hide() {
      ModalVisibility(false);
    },
  }));
  return (
    <Modal
      style={{
        padding: 0,
        // ...(props.type !== 'products' && {height: '100%'}),
        bottom: 0,
        margin: 0,
        width: '100%',
        position: 'absolute',
        ...(props.type !== 'questions' && {backgroundColor: '#f0f4f7'}),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      onBackdropPress={() => {
        ModalVisibility(false);

        // if (props.type == 'products') {

        // }
        // propsData = {}
      }}>
      {props.children}
    </Modal>
  );
});

export default CommonModal;
