import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {Platform, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors} from './../constants/index';
import {icons} from '../assets';
import AuthStack from './AuthStack';
import CurrentOrdersStack from './currentOrdersStack';
import OrderStack from './orderStack';
import ProfileStack from './profileStack';
import FavouriteStack from './FavouriteStack';

const Tab = createMaterialBottomTabNavigator();

const BottomNavigation = () => {
  const {user} = useSelector(state => state.LoginSlice);

  return (
    <Tab.Navigator
      activeColor={Colors.red}
      shifting={false}
      activeIndicatorStyle={{
        backgroundColor: Colors.white, // 👈 Active background white
        borderRadius: 10,
      }}
      barStyle={{
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.15,
        shadowRadius: 8,
        height: Platform.OS === 'ios' ? 80 : 65,
      }}>
      <Tab.Screen
        name="Home"
        component={OrderStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.House}
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={user == null ? AuthStack : CurrentOrdersStack}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.history}
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={OrderStack}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.explore}
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourite"
        component={user == null ? AuthStack : FavouriteStack}
        options={{
          tabBarLabel: 'Favourite',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.heart}
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={user == null ? AuthStack : ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.User}
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
