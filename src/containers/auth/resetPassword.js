import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch} from 'react-redux';
import {icons} from '../../assets';
import CustomInput from '../../components/customInput';
import CustomModal from '../../components/customModal';
import PrimaryButton from '../../components/primaryButton';
import {Colors} from '../../constants';

const ResetPassword = ({navigation, route}) => {
  const {email} = route.params;

  console.log(email, 'emailemailemailemailemail');

  const dispatch = useDispatch();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorVisible, setErrorVisible] = useState(false);

  const handleSetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorVisible(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorVisible(true);
      return;
    }
    let payload = {password: newPassword, email, type: 'forgot'};

    navigation.navigate('CodeVerification', payload);
  };

  const handleProceed = async () => {};

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: Colors.white}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: width(3)}}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={{
            marginTop: width(3),
            height: width(10),
            width: width(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image source={icons.ArrowLeft} style={{height: 20, width: 20}} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: Colors.black,
            marginTop: width(3),
          }}>
          Set Password
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: Colors.black,
            width: '90%',
            marginTop: width(1),
          }}>
          Enter your new password and confirm to proceed.
        </Text>

        <View style={{marginTop: width(5), gap: 30}}>
          <CustomInput
            title="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            Icon={icons.Hide}
            secureTextEntry
          />

          <CustomInput
            title="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            Icon={icons.Hide}
            secureTextEntry
          />
        </View>
      </ScrollView>

      <View
        style={{
          height: width(20),
          width: '100%',
          padding: width(4),
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        }}>
        <PrimaryButton name="Confirm" onPress={handleSetPassword} />
      </View>

      <CustomModal
        visible={errorVisible}
        Icon={icons.cross}
        colors={Colors.red}
        name="Error"
        detail="Please check your password fields and try again."
        buttonName="Try Again"
        close={() => setErrorVisible(false)}
        onPress={() => setErrorVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
