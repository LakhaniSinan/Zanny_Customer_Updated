import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../../container/app/home';
import TabIcon from '../../components/bottomTab';
import {Icons} from '../../assets';
import Explore from '../../container/app/explore';
import History from '../../container/app/history';
import Favourite from '../../container/app/favourite';
import Profile from '../../container/app/profile';

const Tab = createBottomTabNavigator();
const BottomNav = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon iconName="Home" icon={Icons.House} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              iconName="History"
              icon={Icons.history}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              iconName="Explore"
              icon={Icons.explore}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              iconName="Favourite"
              icon={Icons.heart}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon iconName="Profile" icon={Icons.User} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
