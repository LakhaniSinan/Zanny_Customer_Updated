import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet,ActivityIndicator} from 'react-native';
import Header from '../../components/header';
import Button from '../../components/button';
import {registerCustomer} from '../../services/auth';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {width} from 'react-native-dimension';
import OverLayLoader from '../../components/loader';
import {colors} from '../../constants';

const CodeVerification = ({navigation, route}) => {
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const data = route?.params?.data;

  const VerifyCode = () => {
    let payload = {
      ...data,
      code: value,
    };
    if (value === '') {
      alert('Please fill the field');
    } else {
      setIsVisible(true);
      registerCustomer(payload)
        .then(response => {
          if (response.data.status == 'error') {
            alert(response.data.message);
            setIsVisible(false);
          } else {
            setIsVisible(false);
            alert(response.data.message);
            setValue('');
            navigation.replace('Login');
          }
        })
        .catch(err => {
          setIsVisible(false);
          alert(err.data.status);
        });
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
        <Header goBack text={"Verify Code"} />
        <Text style={{textAlign: 'center', fontSize: 20, marginTop: width(20),color:colors.black}}>
          Enter code
        </Text>
        <View>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}

            keyboardType="number-pad"
            textInputStyle={{color:"black"}}
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
        </View>
        <View style={{justifyContent: 'flex-end', flex: 1,marginBottom:width(2)}}>
          {isVisible ? (
            <ActivityIndicator size={'large'} color={colors.yellow} />
          ) : (
            <Button heading="Verify" onPress={VerifyCode} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: width(10), marginHorizontal: width(20)},
  cell: {
    width: width(10),
    height: width(10),
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#00000030',
    textAlign: 'center',
    color:"black"
  },
  focusCell: {
    borderColor: '#000',
  },
});

export default CodeVerification;
