import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../components/header/index';
import {width} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
// import Location from '../../auth/Location';
import {colors} from '../../../constants/index';
import Button from '../../../components/button/index';
import {
  getAllergiesCategories,
  getAllAllergies,
} from '../../../services/allergies';
import {useEffect} from 'react';
import CheckBox from '@react-native-community/checkbox';
import CommonModal from '../../../components/modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import userAllergies, {
  setUserAllergies,
} from '../../../redux/slices/userAllergies';
import handleSize from 'react-native-dimension/src/utils';
import {updateCustomerProfile} from '../../../services/profile';
import {setUserData} from '../../../redux/slices/Login';
import OverLayLoader from '../../../components/loader';

const UpdateAllergies = ({navigation, route}) => {
  const disptach = useDispatch();
  const [allergiesData, setAllergiesData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    handleGetAllergies();
  }, []);

  const handleGetAllergies = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);

    setIsLoading(true);
    getAllAllergies()
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          let tempArr = [];
          let data = response?.data?.data;
          data?.map((item, ind) => {
            if (user?.allergies.length > 0) {
              let resulttt = user?.allergies.find(
                valllll => valllll == item.name,
              );
              if (resulttt !== undefined) {
                item['isSelected'] = true;
                tempArr.push(item);
              } else {
                item['isSelected'] = false;
                tempArr.push(item);
              }
            } else {
              item['isSelected'] = false;
              tempArr.push(item);
            }
          });
          // console.log(tempArr, 'jdkjdkjdk');
          setAllergiesData(tempArr);
        } else {
          console.log(response?.data, 'jdijdkjkdjjdk');
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'Error====>');
      });
  };

  const handleChange = (index, item) => {
    let tempArr = [...allergiesData];
    tempArr[index].isSelected = !tempArr[index].isSelected;
    setAllergiesData(tempArr);
  };

  const hanldeUpadteAllergies = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    let finalArr = [];
    allergiesData.map(itemmmmmm => {
      if (itemmmmmm.isSelected) {
        finalArr.push(itemmmmmm.name);
      }
    });
    let finalObjj = {
      ...user,
      allergies: finalArr,
    };
    AsyncStorage.setItem('user', JSON.stringify(finalObjj));
    setIsLoading(true);
    const payload = {
      allergies: finalArr,
    };
    updateCustomerProfile(user?._id, payload)
      .then(response => {
        setIsLoading(false);
        if (response.data.status == 'error') {
          alert(response?.data.message);
        } else {
          alert(response?.data.message);
          let newObj = {
            ...response.data.data,
          };
          AsyncStorage.setItem('user', JSON.stringify(newObj));
          disptach(setUserData(newObj));
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  // const handleModalButton=async(type)=>{
  //   let tempArr=[]
  //   allergiesData.map((item,ind)=>{
  //     item.products.map((value,index)=>{
  //       if (value?.isSelected == true) {
  //         tempArr.push(value?.name)
  //       }
  //     })
  //   })
  //   if (type=="yes") {
  //     let payload={
  //       allergies:tempArr
  //     }
  //     let user=await AsyncStorage.getItem('user')
  //     user=JSON.parse(user)
  //       updateCustomerProfile(user?.id,payload).then((res)=>{
  //         if (res?.data?.data =="ok") {
  //           AsyncStorage.setItem('user',JSON.stringify(res?.data?.data))
  //           disptach(setUserData(res?.data?.data))
  //           ref.current.hide()
  //         } else {
  //          alert(res?.data?.message)
  //         }

  //       }).catch((error)=>{
  //           console.log(error,"errorororo");
  //       })

  //       if (route?.params?.type !== "edit") {
  //         console.log("callledddddd");
  //         navigation.navigate("Restaurants")
  //       }
  //   } else {
  //       disptach(setUserAllergies(allergiesData))
  //       ref.current.hide()
  //       if (route?.params?.type !== "edit") {
  //         navigation.navigate("Restaurants")
  //       }
  //   }
  // }

  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={styles.container}>
        <Header text="Update Allergies" goBack={true} />
        <ScrollView>
          {allergiesData?.map((item, ind) => {
            return (
              <View
                style={{
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  backgroundColor: '#fff',
                  shadowRadius: 1,
                  borderRadius: 5,
                  margin: width(2),
                  paddingVertical: width(5),
                  paddingHorizontal: width(5),
                  elevation: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: width(1.5),
                  }}>
                  <CheckBox
                    disabled={false}
                    checked={item?.isSelected}
                    value={item?.isSelected}
                    onValueChange={() => handleChange(ind, item)}
                    tintColors={{
                      true: colors.yellow,
                      false: colors.yellow,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                      marginLeft: width(2),
                    }}>
                    <Text style={{color: colors.grey}}>{item?.name}</Text>
                    <Image
                      source={{uri: item?.image}}
                      style={{width: 30, height: 30, borderRadius: 50}}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={{marginBottom: width(1)}}>
          <Button heading="Update" onPress={hanldeUpadteAllergies} />
          {/* <CommonModal ref={ref}>
      <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f7',
        marginHorizontal: width(4),
        padding: width(5),
      }}>
      <Text style={styles.quesHead}>
        Finally, Would you like this information to be saved for future orders??
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: width(2),
        }}>
        <View style={{width: '50%'}}>
          <Button
            heading="No"
            color={colors.yellow}
            style={{width: '100%'}}
            onPress={()=>handleModalButton("no")}
          />
        </View>
        <View style={{width: '50%'}}>
          <Button
            heading="Yes"
            color={colors.yellow}
            style={{width: '100%'}}
            onPress={()=>handleModalButton("yes")}
          />
        </View>
      </View>
    </View>
              </CommonModal>  */}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  quesHead: {
    textAlign: 'center',
    marginVertical: width(2),
    paddingVertical: width(4),
    color: '#5a5e65',
    fontWeight: '500',
  },
});

export default UpdateAllergies;
