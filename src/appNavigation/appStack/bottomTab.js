import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {Image, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors} from '../../constants';
import OrderStack from './orderStack';
import {icons} from '../../assets';
import CurrentOrdersStack from './currentOrdersStack';
import ExploreStack from './exploreStack';
import FavouriteStack from './favouriteStack';
import ProfileStack from './profileStack';

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
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={CurrentOrdersStack}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.history}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.explore}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourite"
        component={FavouriteStack}
        options={{
          tabBarLabel: 'Favourite',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.heart}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <Image
              source={icons.User}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
