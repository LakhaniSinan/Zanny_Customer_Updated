import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import CustomPicker from '../../../components/customPicker';
import {colors} from '../../../constants';
import {fontFamily} from '../../../assets';
import {getSupportMessagesById} from '../../../services/profile';

const Support = () => {
  const user = useSelector(state => state.LoginSlice.user);
  const navigation = useNavigation();

  const pickerRef = useRef();
  const [type, setType] = useState('Pending');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchMessages();
    }
  }, [type]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await getSupportMessagesById(user._id);
      if (res?.status === 200) {
        const filtered = res.data.data.filter(item => item.status === type);
        setMessages(filtered);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleSelectValue = (name, item) => {
    setType(item.name);
  };

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <AppHeader text="Support" goBack />

        <View style={{paddingHorizontal: width(4), marginTop: width(3)}}>
          <CustomPicker
            ref={pickerRef}
            label="Filter by Status"
            labelll="Select Status"
            value={type}
            listData={[
              {name: 'Pending'},
              {name: 'Acknowledged'},
              {name: 'Resolved'},
            ]}
            handleOpenModal={() => pickerRef.current.show()}
            handleSelectValue={handleSelectValue}
          />
        </View>

        {messages.length > 0 ? (
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingBottom: width(20)}}
            renderItem={({item}) => (
              <View
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 16,
                  marginHorizontal: width(4),
                  marginTop: width(4),
                  elevation: 6,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}>
                <View style={{padding: width(4)}}>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#F1F5FF',
                      paddingHorizontal: width(3),
                      paddingVertical: width(1),
                      borderRadius: 20,
                      marginBottom: width(2),
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.orangeColor,
                        fontFamily: fontFamily.poppinMedium,
                      }}>
                      {item.status}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      color: colors.black,
                      fontFamily: fontFamily.poppinRegular,
                    }}>
                    {item.message}
                  </Text>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#EEE',
                      marginVertical: width(3),
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.graydark,
                      fontFamily: fontFamily.poppinRegular,
                    }}>
                    {moment(item.date).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={{marginTop: width(40), alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontFamily: fontFamily.poppinBold}}>
              No records found
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: colors.black,
            padding: width(4),
            borderRadius: 50,
            elevation: 6,
          }}
          onPress={() => navigation.navigate('AddSupportMsg')}>
          <AntDesign name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default Support;
