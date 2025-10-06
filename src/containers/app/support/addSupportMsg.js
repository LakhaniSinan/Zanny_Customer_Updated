import React, {useState, useRef} from 'react';
import {SafeAreaView, View, Text, TextInput,Alert,Image, TouchableOpacity,ActivityIndicator} from 'react-native';
import {width, height} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
import Button from './../../../components/button/index';
import Header from './../../../components/header/index';
import {colors} from './../../../constants/index';
import {useSelector, useDispatch} from 'react-redux';
import OverLayLoader from '../../../components/loader';
import { createSupportMessage } from '../../../services/profile';

const AddSupportMsg = ({navigation}) => {
  let user = useSelector(state => state.LoginSlice.user);
  const [msg,setMsg]=useState("")
  const [isVisible,setIsVisible]=useState(false)
 
  const handleAddSupportMsg=()=>{
    if (msg == "") {
      alert("Message is required")
    }else{
    let payload={
        name:user?.name,
        email:user?.email,
        phoneNumber:user?.phoneNumber,
        message:msg,
        type:"customer",
        userId:user?._id,
        date:new Date(),
    }
    console.log(payload,"payloaddddd");
    setIsVisible(true)
    createSupportMessage(payload).then((res)=>{
        setIsVisible(false)
        if (res?.status==200) {
            alert(res?.data?.message)
            navigation.goBack()
        }else{
            alert(res?.data?.message)
        }
    }).catch((error)=>{
        console.log(error,"errorpor");
        setIsVisible(false)
    })
  }
  }
 
  return (
    <>
      <OverLayLoader isloading={isVisible} />
      <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
        <Header goBack text={'Help Desk'} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: width(5)}}>
          <View style={{marginTop: width(5)}}>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: colors.grey,
                marginHorizontal:width(3),
                height:width(50)
              }}>
              <TextInput
                style={{marginHorizontal: width(2),color:colors.black,height:width(50),textAlignVertical:"top"}}
                placeholder="Enter your message"
                multiline={true}
                value={msg}
                placeholderTextColor={colors.grey}
                onChangeText={newText => setMsg(newText)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={{marginBottom: width(2),color:colors.grey}}>
          <Button heading={'Submit'} onPress={handleAddSupportMsg}/>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddSupportMsg;
