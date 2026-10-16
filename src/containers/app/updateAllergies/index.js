import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants/index';
import {setUserData} from '../../../redux/slices/Login';
import {getAllAllergies} from '../../../services/allergies';
import {updateCustomerProfile} from '../../../services/profile';
import AntDesign from 'react-native-vector-icons/AntDesign';


const UpdateAllergies = ({navigation}) => {
  const dispatch = useDispatch();

  const [allergiesData, setAllergiesData] = useState([]);
  const [isloading, setIsLoading] = useState(false);

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

          data?.map(item => {
            if (user?.allergies.length > 0) {
              let result = user?.allergies.find(v => v == item.name);

              item['isSelected'] = result !== undefined;
            } else {
              item['isSelected'] = false;
            }

            tempArr.push(item);
          });

          setAllergiesData(tempArr);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleChange = index => {
    let tempArr = [...allergiesData];
    tempArr[index].isSelected = !tempArr[index].isSelected;
    setAllergiesData(tempArr);
  };

  const hanldeUpadteAllergies = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);

    let finalArr = [];

    allergiesData.map(item => {
      if (item.isSelected) {
        finalArr.push(item.name);
      }
    });

    let finalObj = {
      ...user,
      allergies: finalArr,
    };

    AsyncStorage.setItem('user', JSON.stringify(finalObj));

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
          alert('Allergies updated successfully');

          let newObj = {
            ...response.data.data,
          };

          AsyncStorage.setItem('user', JSON.stringify(newObj));
          dispatch(setUserData(newObj));
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <OverLayLoader isloading={isloading} />

      <SafeAreaView style={styles.container}>

        {/* CUSTOM HEADER */}

        <View style={styles.header}>

<View style={{flexDirection: 'row', alignItems: 'center', gap: 30}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={20} color={colors.black} />
            
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Allergies</Text>
</View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{width: 30 , height: 30, borderWidth: 1, borderColor: colors.gray, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../../../assets/icons/bellIcon.png')} style={{width: 15, height: 15, resizeMode: 'contain'}} />
          </TouchableOpacity>

        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {allergiesData?.map((item, ind) => {
            return (
              <TouchableOpacity
                key={ind}
                style={styles.row}
                onPress={() => handleChange(ind)}>

                <View style={styles.leftSection}>
                  <Image
                    source={{uri: item?.image}}
                    style={styles.icon}
                  />

                  <Text style={styles.name}>
                    {item?.name}
                  </Text>
                </View>

                <View style={styles.radioOuter}>
                  {item?.isSelected && (
                    <View style={styles.radioInner} />
                  )}
                </View>

              </TouchableOpacity>
            );
          })}

        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={hanldeUpadteAllergies}>

          <Text style={styles.buttonText}>
            Update Allergies
          </Text>

        </TouchableOpacity>

      </SafeAreaView>
    </>
  );
};

export default UpdateAllergies;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  /* HEADER */

  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: colors.black,
  },

  backIcon: {
    fontSize: 20,
    color: colors.black,
  },

  bell: {
    fontSize: 18,
  },

  /* LIST */

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 26,
    height: 26,
    marginRight: 12,
    resizeMode: 'contain',
  },

  name: {
    fontSize: 15,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },

  /* RADIO */

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#E53935',
  },

  /* BUTTON */

  button: {
    height: 55,
    backgroundColor: colors.black,
    borderRadius: 35,

    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 20,
    marginBottom: 15,
  },

  buttonText: {
    color: colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

});