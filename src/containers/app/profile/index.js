import React from 'react';
import {View, Text, SafeAreaView,Alert} from 'react-native';
import {width} from 'react-native-dimension';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Header from '../../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import profileStyles from './style';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from './../../../constants/index';

const Profile = () => {
  const navigation = useNavigation();
  const data = [
    {
      name: 'Personal Information',
      screenName: 'PersonalInfo',
    },
    {
      name: 'Allergies And Dietaries',
      screenName: 'AllergiesAndDietaries',
      type: 'profile',
    },
    {
      name: 'Support',
      screenName: 'Support',
      type: 'profile',
    },

  ];

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
      <Header logout text={'Profile'} drawer={true} />
      <View style={{marginTop: width(4)}}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(item.screenName, {
                  type: item.type,
                  goBack: item.showGoBack,
                })
              }
              style={profileStyles.cardStyle}
              key={item.name}>
              <Text style={{fontWeight: 'bold', fontSize: 15,color:colors.grey}}>
                {item.name}
              </Text>

              <View
                style={profileStyles.iconStyle}>
                <AntDesign size={18} color={'white'} name="arrowright" />
              </View>
            </TouchableOpacity>
          );
      })}
      </View>

      {/* <View style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end"
      }}>
        <TouchableOpacity
          onPress={logUserOut}
          style={{ marginBottom: width(2) }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>Log Out</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default Profile;
