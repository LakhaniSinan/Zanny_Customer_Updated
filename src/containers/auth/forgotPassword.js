import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {width} from 'react-native-dimension';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import {sendCode, sendResetCodeCustomer} from '../../services/auth';

const ForgotPassword = ({navigation}) => {
  const [inputValues, setInputValues] = useState({
    email: '',
  });

  const handleChangeInputs = (name, value) => {
    setInputValues({...inputValues, [name]: value});
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleOnPressNext = () => {
    const {email} = inputValues;
    if (email == '') {
      alert('Email is required');
    } else {
      let params = {
        email,
      };
      setIsLoading(true);
      sendResetCodeCustomer(params)
        .then(res => {
          if (res.data.status == 'error') {
            alert(res.data.message);
            setIsLoading(false);
          } else {
            alert(res.data.message);
            navigation.navigate('ResetPassword', {email: email});
            setIsLoading(false);
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err, 'error');
        });
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text={'Forgot Password'} goBack={true} />
        <View style={{marginTop: width(5)}}>
          <Text style={{paddingHorizontal: width(2), color: colors.grey}}>
            Email
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{margin: width(2), color: colors.black}}
              placeholder="Enter your email"
              value={inputValues.email}
              onChangeText={value => handleChangeInputs('email', value)}
              placeholderTextColor={colors.grey}
            />
          </View>
        </View>
        <View
          style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
          {isLoading ? (
            <ActivityIndicator color={colors.yellow} size={'large'} />
          ) : (
            <Button heading={'Next'} onPress={handleOnPressNext} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;
