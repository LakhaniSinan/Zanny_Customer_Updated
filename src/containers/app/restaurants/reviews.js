import React from 'react';
import {View, Text, SafeAreaView, Alert, FlatList} from 'react-native';
import {width} from 'react-native-dimension';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Header from '../../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import profileStyles from './style';
import {Rating, AirbnbRating} from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from './../../../constants/index';

const Reviews = ({route}) => {
  const navigation = useNavigation();
  const data = [
    {
      _id: '82727872772',
      review: 'Good taste',
      rating: 5,
      name: 'Salman Ahmed',
      date: '12-05-2023',
    },
    {
      _id: '18727828',
      review: 'Good taste',
      rating: 5,
      name: 'Salman Ahmed',
      date: '12-05-2023',
    },
  ];

  const details=route?.params?.data
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header text={`${details?.name} reviews`} goBack />
      <View style={{marginTop: width(4), flex: 1}}>
        {details?.reviews.length > 0 ? 
        <FlatList
          contentContainerStyle={{flex: 1}}
          data={details?.reviews}
          renderItem={({item}) => (
            <View
              style={{
                borderRadius: 8,
                marginHorizontal: width(3),
                elevation: 5,
                backgroundColor: colors.white,
                marginVertical: width(3),
              }}>
              <View
                style={{
                  paddingHorizontal: width(2),
                  paddingVertical: width(3),
                }}>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                  <Text style={{color: colors.black}}>{item?.date}</Text>
                  <View style={{flexDirection:"row",alignItems:"center"}}>
                  <AirbnbRating
                    size={15}
                    defaultRating={item.rating}
                    showRating={false}
                    selectedColor={colors.orangeColor}
                  />
                    <Text style={{color:colors.orangeColor}}>({item?.rating}/5)</Text>
                  </View>
                </View>
                <Text style={{color: colors.black, paddingTop: width(2)}}>
                  Name : {item?.name}
                </Text>
                <View>
                  <Text style={{color: colors.black, paddingTop: width(1)}}>
                    Review: {item?.review}
                  </Text>
                </View>
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
      </View>
    </SafeAreaView>
  );
};

export default Reviews;
