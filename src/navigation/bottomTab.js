import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OrderStack from './orderStack';
import ProfileStack from './profileStack';
import {colors} from './../constants/index';
import LinearGradient from 'react-native-linear-gradient';
import Orders from '../containers/app/orders';
import CurrentOrdersStack from './currentOrdersStack';

const Tab = createMaterialBottomTabNavigator();

const BottomStack = () => {
  return (
    <Tab.Navigator
      activeColor="#fff"
      inactiveColor="#3e2465"
      barStyle={{backgroundColor: '#F8BB12'}}>
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
        component={CurrentOrdersStack}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="food" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
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

export default BottomStack;
