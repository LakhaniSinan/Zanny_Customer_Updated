import React from "react";
import { View,Text,SafeAreaView,TouchableOpacity,FlatList } from "react-native";
import Header from "../../../components/header";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { width } from "react-native-dimension";
import { colors } from "../../../constants";
import { getSupportMessagesById } from "../../../services/profile";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useState } from "react";
import OverLayLoader from "../../../components/loader";
import { useEffect } from "react";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

const Support=()=>{
  let user = useSelector(state => state.LoginSlice.user);
  const navigation=useNavigation();
  const [messages,setMessages]=useState([])
  const [isLoading,setIsLoading]=useState(false)
  const [type,setType]=useState("Pending")

    useFocusEffect(
      React.useCallback(() => {
        getUserSupportMessages();
      }, [type]),
    );
    const getUserSupportMessages=async()=>{
      setIsLoading(true)
        getSupportMessagesById(user._id).then((res)=>{
          setIsLoading(false)
          if (res?.status==200) {
            console.log(res?.data?.data,"data==========>");
            const data=res?.data?.data
            let tempArr=[]
            data.map((item,ind)=>{
              if (item.status==type) {
                tempArr.push(item)
              }
            })
            setMessages(tempArr)
          }
        }).catch((error)=>{
          setIsLoading(false)
          console.log(error,"errorSupportMsg=====>");
        })
    }
    return(
      <>
      <OverLayLoader isloading={isLoading} />
        <SafeAreaView style={{flex:1,backgroundColor:colors.white}}>
        <Header text="Support" goBack/>
        <View style={{marginHorizontal:width(3),marginVertical:width(2)}}>
          <Text style={{color:"black"}}>Filter records by status</Text>
        </View>
        <View
            style={{
              borderWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
              marginHorizontal:width(3)
            }}>
            <Picker
              dropdownIconColor={'black'}
              style={{ width: '100%', fontSize: 13 }}
              itemStyle={{ backgroundColor: 'white', fontSize: 13 }}
              selectedValue={type}
              onValueChange={(itemValue, itemIndex) =>
                setType(itemValue)
              }
              >
              <Picker.Item
                label="Please select type"
                value={''}
                color="black"
              />
              <Picker.Item label="Pending" value={'Pending'} color="black" />
              <Picker.Item label="Acknowledged" value={'Acknowledged'} color="black" />
              <Picker.Item
                label="Resolved"
                value={'Resolved'}
                color="black"
              />
            </Picker>
          </View>
        {messages?.length > 0 ? 
        <FlatList
          data={messages}
          renderItem={({item}) => (
            <View
              style={{
                borderRadius: 8,
                marginHorizontal: width(3),
                elevation: 5,
                backgroundColor: colors.orangeColor,
                marginVertical: width(3),
              }}>
              <View
                style={{
                  paddingHorizontal: width(2),
                  paddingVertical: width(3),
                }}>
                   <View>
                  <Text style={{color: colors.white, paddingTop: width(1)}}>
                    Message: {item?.message}
                  </Text>
                </View>
                <Text style={{color: colors.white, paddingTop: width(2)}}>
                  Date : {moment(item.date).format("DD-MM-YYYY")}
                </Text>
                <Text style={{color: colors.white, paddingTop: width(2)}}>
                  Status : {item?.status}
                </Text>
              </View>
            </View>
          )}
        />
        :
        <View style={{justifyContent: 'center',marginTop:width(50)}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: width(2),
            color: 'black',
            textAlign: 'center',
          }}>
          No data found 
        </Text>
      </View>
            }
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 5,
            marginHorizontal: width(2),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.orangeColor,
              borderRadius: 30,
              padding: width(3),
              alignItems: 'center',
            }}
            onPress={()=>navigation.navigate("AddSupportMsg")}
          >
            <AntDesign
              name="plus"
              size={25}
              color={'#ffff'}
            />
          </TouchableOpacity>
        </View>
        </SafeAreaView>
        </>
    )
}

export default Support