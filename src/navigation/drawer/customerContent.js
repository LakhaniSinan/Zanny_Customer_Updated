import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height, width} from 'react-native-dimension';
import Octicons from 'react-native-vector-icons/Octicons';
import {useSelector} from 'react-redux';
import {images} from '../../assets';
import {colors} from '../../constants';
import DrawerItems from './drawerItems';

function DrawerContent(props) {
  const user = useSelector(state => state.LoginSlice.user);
  const mainNav = [
    'Restaurants',
    'Orders',
    'Profile',
    'Address',
    'Settings',
    'Private Orders',
    'FAQs',
    'Support',
  ];
  const unLoggedNav = ['Restaurants', 'FAQs'];
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 0,
        }}
        {...props}
        style={{backgroundColor: 'white', flex: 1, paddingHorizontal: 0}}>
        <View style={styles.drawerContent}>
          {user ? (
            <View
              style={{
                backgroundColor: colors.yellow,
                // padding: 10,
                height: height(25),
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{position: 'absolute', top: 10, right: 10}}
                onPress={() => props.navigation.toggleDrawer()}>
                <Octicons name="three-bars" size={22} color="white" />
              </TouchableOpacity>

              <View
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 100,
                  marginBottom: width(2),
                  backgroundColor: 'red',

                  overflow: 'hidden',
                }}>
                {user?.customerImage ? (
                  <Image
                    source={{uri: user?.customerImage}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={images.userAvatar}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                  {user?.name}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: width(50),
                backgroundColor: colors.yellow,
              }}>
              <View
                style={{
                  height: width(30),
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white,
                    fontWeight: 'bold',
                  }}>
                  Welcome To Zannys Food
                </Text>
                <Text style={{fontSize: 14, color: colors.white}}>
                  Login to Get Best Experience
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'AuthStack'}],
                  })
                }
                style={{
                  flex: 1,
                  marginBottom: width(3),
                  marginLeft: width(2),
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
                  Login/create Account
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{marginTop: 10}}>
            {user
              ? mainNav.map((item, index) => {
                  return (
                    <>
                      <DrawerItems
                        iconName={item}
                        title={item}
                        key={index}
                        navigation={props.navigation}
                        focused={props.state.index === index ? true : false}
                        props={props}
                      />
                    </>
                  );
                })
              : null}

            {!user
              ? unLoggedNav.map((item, index) => {
                  return (
                    <>
                      <DrawerItems
                        iconName={item}
                        title={item}
                        key={index}
                        navigation={props.navigation}
                        focused={props.state.index === index ? true : false}
                        props={props}
                      />
                    </>
                  );
                })
              : null}

            <View style={{borderWidth: 0.3, borderColor: '#d3d3d3'}} />
          </View>
        </View>
        <View>
          {user && (
            <DrawerItems
              iconName="Log out"
              title={'Log out'}
              navigation={props.navigation}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'white',
  },
  userInfoScreen: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default DrawerContent;
