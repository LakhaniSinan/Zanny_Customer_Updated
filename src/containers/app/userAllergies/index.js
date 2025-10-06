import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
import Header from './../../../components/header/index';
// import Location from '../../auth/Location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CommonModal from '../../../components/modal';
import {setUserData} from '../../../redux/slices/Login';
import {getAllAllergies} from '../../../services/allergies';
import {updateCustomerProfile} from '../../../services/profile';
import Button from './../../../components/button/index';
import {colors} from './../../../constants/index';
const UserAllergies = ({route}) => {
  const disptach = useDispatch();
  const navigation = useNavigation();
  const [allergiesData, setAllergiesData] = useState([]);
  const user = useSelector(state => state.LoginSlice.user);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef();

  React.useEffect(() => {
    setTimeout(() => {
      if (user) {
        handleGetAllergies();
        handleNavigation();
      } else {
        // navigation.replace('AllRestaurants');
        navigation.reset({
          index: 0,
          routes: [{name: 'AllRestaurants'}],
        });
      }
    }, 2000);
  }, []);

  const handleGetAllergies = () => {
    getAllAllergies()
      .then(response => {
        let tempArr = [];
        if (response?.data?.status == 'ok') {
          response?.data?.data.map((item, ind) => {
            item['isSelected'] = false;
            tempArr.push(item);
          });
          setAllergiesData(tempArr);
        } else {
          console.log(response?.data, 'erroro1111111r');
        }
      })
      .catch(error => {
        console.log(error, 'Error====>');
      });
  };

  const handleChange = (index, val) => {
    let tempArr = [...allergiesData];
    tempArr[index].isSelected = !tempArr[index].isSelected;
    setAllergiesData(tempArr);
  };

  const handleNavigation = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    if (data?.allergies?.length > 0) {
      navigation.replace('AllRestaurants');
    } else {
      console.log('in elaeee');
      setIsLoading(false);
    }
  };

  const handleModalButton = async type => {
    let tempArr = [];
    allergiesData.map((item, ind) => {
      if (item?.isSelected == true) {
        tempArr.push(item?.name);
      }
    });
    if (type == 'yes') {
      let payload = {
        allergies: tempArr,
      };
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      console.log(user?._id, payload, 'alllllllll');
      updateCustomerProfile(user?._id, payload)
        .then(res => {
          if (res?.data?.status == 'ok') {
            console.log(res?.data, 'innnnnnresspppp');
            AsyncStorage.setItem('user', JSON.stringify(res?.data?.data));
            disptach(setUserData(res?.data?.data));
            navigation.replace('AllRestaurants');
            ref.current.hide();
          } else {
            alert(res?.data?.message);
          }
        })
        .catch(error => {
          console.log(error, 'errorororo');
        });
    } else {
      navigation.replace('AllRestaurants');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={colors.yellow} size={'large'} />
        </View>
      )}
      {!isLoading && (
        <>
          <Header skip text="Select Allergies" />
          <ScrollView>
            {allergiesData?.map((item, ind) => {
              // console.log(item.products, 'asdlasjdlas');
              return (
                <View
                  style={{
                    shadowColor: colors.pinkColor,
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    backgroundColor: '#fff',
                    shadowRadius: 1,
                    borderRadius: 5,
                    margin: width(3),
                    paddingVertical: width(3),
                    paddingHorizontal: width(5),
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
                      <Text style={{color: colors.grey2}}>{item?.name}</Text>
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
            <Button
              heading="Select"
              // onPress={()=>navigation.navigate("AddEditFood",{
              //   allergiesData:allergiesData,
              //   type:type,
              //   data:data
              // })}
              onPress={() => ref.current.isVisible()}
            />
            <CommonModal ref={ref}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f0f4f7',
                  marginHorizontal: width(4),
                  padding: width(5),
                }}>
                <Text style={styles.quesHead}>
                  Finally, Would you like this information to be saved for
                  future orders??
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
                      onPress={() => handleModalButton('no')}
                    />
                  </View>
                  <View style={{width: '50%'}}>
                    <Button
                      heading="Yes"
                      color={colors.yellow}
                      style={{width: '100%'}}
                      onPress={() => handleModalButton('yes')}
                    />
                  </View>
                </View>
              </View>
            </CommonModal>
          </View>
        </>
      )}
    </SafeAreaView>
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

export default UserAllergies;
