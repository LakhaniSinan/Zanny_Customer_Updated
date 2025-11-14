import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {Colors} from './../constants/index';
import AuthStack from './AuthStack';
import CurrentOrdersStack from './currentOrdersStack';
import OrderStack from './orderStack';
import ProfileStack from './profileStack';

const Tab = createMaterialBottomTabNavigator();

const BottomNavigation = () => {
  const {user} = useSelector(state => state.LoginSlice);

  return (
    <Tab.Navigator
      activeColor={Colors.orange}
      inactiveColor="#A0A0A0"
      shifting={false}
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
        name="Restaurants"
        component={OrderStack}
        options={{
          tabBarLabel: 'Restaurants',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="CurrentOrders"
        component={user == null ? AuthStack : CurrentOrdersStack}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="food" color={color} size={26} />
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
            <MaterialIcons name="person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
