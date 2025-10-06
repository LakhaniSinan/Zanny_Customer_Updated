import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useState} from 'react';
import { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TurboModuleRegistry,
} from 'react-native';
import {width} from 'react-native-dimension';
import { color } from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import Button from '../../../components/button';
import Header from '../../../components/header';
import {colors} from '../../../constants';
import {setUserData} from '../../../redux/slices/Login';
import { changePasswordCustomer } from '../../../services/profile';
import OverLayLoader from '../../../components/loader';
import Feather from 'react-native-vector-icons/Feather'

const ChangePassword = ({navigation}) => {
  const disptach = useDispatch();

  const [inputValue, setInputValue] = useState({
    email: '',
    password:'',
    newPassword:'',
  });  const [isSecure,setIsSecure]=useState(true)
  const [isSecureConfirm,setIsSecureConfirm]=useState(true)


  const [isLoading,setIsLoading]=useState(false)
  const handleChangeText = (name, value) => {
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(()=>{
    getUserData();
  },[])
  
  const onPressChangePassword = () => {
    const {email,password,newPassword}=inputValue
    if (email == "") {
      alert("Email is required")
    }
    else if (password == "") {
      alert("Current Password is required")
    }
    else if (newPassword == "") {
        alert("New password is required")
      }
    else {
      let payload={
        email,
        password,
        newPassword,
      }
      setIsLoading(true)
      changePasswordCustomer(payload).then((response)=>{
        setIsLoading(false)
        if (response?.data?.status == "ok") {
            setInputValue({
                ...inputValue,
                password:"",
                newPassword:"",
            })
          alert(response?.data?.message)
          navigation.goBack();
        }else{
          alert(response?.data?.message)
        }
      }).catch((error)=>{
        setIsLoading(false)
        console.log(error,"error");
      })
     
    }
    
  };

const getUserData=async()=>{
    let data=await AsyncStorage.getItem('user')
    data=JSON.parse(data)
    setInputValue({
      ...inputValue,
        email:data.email
    })
}

  return (
    <>
    <OverLayLoader isloading={isLoading}/>
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
      <Header text={'Change Password'} drawer={true} />
      
      <View style={{marginTop: width(5)}}>
      <Text style={{ marginTop: width(2), paddingHorizontal: width(2),color:colors.grey }}>
            Email
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{ margin: width(2),color:colors.black}}
              placeholder="Enter your email"
              value={inputValue.email}
              onChangeText={newText => handleChangeText('email', newText)}
              editable={false}
              placeholderTextColor={colors.grey}
            />
          </View>
          <Text style={{ marginTop: width(5), paddingHorizontal: width(2),color:colors.grey }}>
            Current Password
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-between",
              paddingRight:width(4)
            }}>
              <View style={{width:"90%"}}>
            <TextInput
              style={{ margin: width(2),color:colors.black }}
              placeholder="Enter your current password"
              secureTextEntry={isSecure}
              value={inputValue.password}
              onChangeText={newText => handleChangeText('password', newText)}
              placeholderTextColor={colors.grey}
            />
            </View>
            <Feather
            name={isSecure ? 'eye-off':'eye'}
            size={width(5)}
            color={colors.grey}
            onPress={()=>setIsSecure(!isSecure)}
            />
          </View>
          <Text style={{ marginTop: width(5), paddingHorizontal: width(2),color:colors.grey }}>
            New Password
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-between",
              paddingRight:width(4)
            }}>
            <View style={{width:"90%"}}>
            <TextInput
              style={{ margin: width(2),color:colors.black }}
              placeholder="Enter your new password"
              secureTextEntry={isSecureConfirm}
              value={inputValue.newPassword}
              onChangeText={newText => handleChangeText('newPassword', newText)}
              placeholderTextColor={colors.grey}
            />
            </View>
            <Feather
            name={isSecureConfirm ? 'eye-off':'eye'}
            size={width(5)}
            color={colors.grey}
            onPress={()=>setIsSecureConfirm(!isSecureConfirm)}
            />
          </View>
      </View>
      <View
        style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
        <Button heading={'Change Password'} onPress={onPressChangePassword} />
      </View>
    </SafeAreaView>
    </>
  );
};

export default ChangePassword;
