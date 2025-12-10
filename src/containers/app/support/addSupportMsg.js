import React, {useState} from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';

import {colors} from '../../../constants';
import OverLayLoader from '../../../components/loader';
import AppHeader from '../../../components/headerComponent';
import CustomInput from '../../../components/customInput';
import ActionBuuton from '../../../components/actionButton';
import CustomModal from '../../../components/customModal';
import {createSupportMessage} from '../../../services/profile';

const AddSupportMsg = ({navigation}) => {
  const user = useSelector(state => state.LoginSlice.user);

  const [msg, setMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    Icon: null,
    name: '',
    detail: '',
    buttonName: 'OK',
    onPress: () => setModalVisible(false),
  });

  const openModal = ({name, detail, buttonName = 'OK', onPress}) => {
    setModalConfig({
      Icon: null,
      name,
      detail,
      buttonName,
      onPress: onPress || (() => setModalVisible(false)),
    });
    setModalVisible(true);
  };

  const handleAddSupportMsg = () => {
    if (!msg.trim()) {
      return openModal({
        name: 'Message Required',
        detail: 'Please enter your message before submitting.',
      });
    }

    const payload = {
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      message: msg,
      type: 'customer',
      userId: user?._id,
      date: new Date(),
    };

    setIsVisible(true);

    createSupportMessage(payload)
      .then(res => {
        setIsVisible(false);

        if (res?.status === 200) {
          openModal({
            name: 'Success',
            detail: res?.data?.message || 'Message sent successfully',
            onPress: () => {
              setModalVisible(false);
              navigation.goBack();
            },
          });
        } else {
          openModal({
            name: 'Error',
            detail: res?.data?.message || 'Something went wrong',
          });
        }
      })
      .catch(() => {
        setIsVisible(false);
        openModal({
          name: 'Error',
          detail: 'Unable to send message. Please try again later.',
        });
      });
  };

  return (
    <>
      <OverLayLoader isloading={isVisible} />

      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <AppHeader goBack text="Help Desk" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: width(4), marginTop: width(4)}}>
            <CustomInput
              placeholder="Enter your message"
              multiline
              value={msg}
              onChangeText={setMsg}
              containerStyle={{height: width(45)}}
              style={{
                textAlignVertical: 'top',
                color: colors.black,
              }}
            />
          </View>
        </ScrollView>

        <View
          style={{
            width: width(92),
            alignSelf: 'center',
            marginBottom: width(6),
          }}>
          <ActionBuuton
            name="Submit"
            height={width(12)}
            fontSize={14}
            bgcColor={colors.redish}
            fontColor={colors.white}
            onPress={handleAddSupportMsg}
          />
        </View>

        {/* ✅ Custom Modal */}
        <CustomModal
          visible={modalVisible}
          Icon={modalConfig.Icon}
          name={modalConfig.name}
          detail={modalConfig.detail}
          buttonName={modalConfig.buttonName}
          onPress={modalConfig.onPress}
          close={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </>
  );
};

export default AddSupportMsg;
