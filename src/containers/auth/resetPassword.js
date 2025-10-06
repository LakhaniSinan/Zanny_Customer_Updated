import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import {width} from 'react-native-dimension';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import {resetPasswordCustomer} from '../../services/auth';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Feather from 'react-native-vector-icons/Feather'

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 10, justifyContent: 'space-evenly'},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: colors.grey,
    textAlign: 'center',
    color:colors.black
  },
  focusCell: {
    borderColor: colors.yellow,
  },
});

const CELL_COUNT = 4;

const ResetPassword = ({navigation, route}) => {
  const [inputValues, setInputValues] = useState({
    otp: '',
    password: '',
  });
  const [value, setValue] = useState('');
  const refrence = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isVisible, setIsVisible] = useState(false);
  const {email} = route?.params;
  const handleChangeInputs = (name, value) => {
    setInputValues({...inputValues, [name]: value});
  };
  const [isSecure,setIsSecure]=useState(true)


  const handleOnPressReset = () => {
    const {otp, password} = inputValues;
    if (otp == '') {
      alert('Verification code  is required');
    } else if (password == '') {
      alert('Password is required');
    } else {
      let params = {
        email,
        otp,
        password,
      };
      setIsVisible(true);
      resetPasswordCustomer(params)
        .then(res => {
          if (res.data.status == 'error') {
            setIsVisible(false);
            alert(res.data.message);
            setIsVisible(false);
          } else {
            setIsVisible(false);
            setInputValues({
              password: '',
              otp: '',
            });
            alert(res.data.message);
            navigation.navigate('Login');
          }
        })
        .catch(err => {
          console.log(err, 'error');
          setIsVisible(false);
        });
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
        <Header text={'Reset Password'} goBack={true} />
        <View style={{marginTop: width(5)}}>
          {/* <Text style={{paddingHorizontal: width(2)}}>Code</Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{margin: width(2)}}
              placeholder="Enter verification code"
              value={inputValues.otp}
              onChangeText={value => handleChangeInputs('otp', value)}
              maxLength={4}
            />
          </View> */}
          <Text
            style={{
              color: colors.grey2,
              fontSize: 18,
              fontWeight: '600',
              alignSelf: 'center',
            }}>
            Verification Code
          </Text>
          <CodeField
            ref={refrence}
            {...props}
            value={inputValues.otp}
            onChangeText={text => handleChangeInputs('otp', text)}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <Text style={{paddingHorizontal: width(2),marginTop:width(4)}}>Password</Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-between",
              paddingRight:width(4)
            }}>
            <View style={{width:"90%"}}>
            <TextInput
              style={{margin: width(2),color:colors.black}}
              placeholder="Enter new password"
              value={inputValues.password}
              placeholderTextColor={colors.grey}
              secureTextEntry={isSecure}
              onChangeText={value => handleChangeInputs('password', value)}
            />
            </View>
            <Feather
            name={isSecure ? 'eye-off':'eye'}
            size={width(5)}
            color={colors.grey}
            onPress={()=>setIsSecure(!isSecure)}
            />
          </View>
        </View>
        <View
          style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
          {isVisible ? (
            <ActivityIndicator size={'large'} color={colors.yellow} />
          ) : (
            <Button heading={'Reset Password'} onPress={handleOnPressReset} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ResetPassword;
