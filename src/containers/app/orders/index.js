import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {width} from 'react-native-dimension';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/header';
import {colors} from '../../../constants/index';
import CurrentOrders from './currentOrders';
import PastOrders from './pastOrders';

const Tab = createBottomTabNavigator();

function Orders({route}) {
  console.log(route, 'paramsparamsparams');

  return (
    <>
      {/* <OverLayLoader isloading={}/> */}
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="Orders" drawer={true} />
        <Tab.Navigator
          initialRouteName="currentOrders"
          screenOptions={{
            // tabBarActiveTintColor: 'black',
            // tabBarLabelStyle: {fontSize: 14},
            // tabBarIndicatorStyle: {backgroundColor: 'black'},
            headerShown: false,
            tabBarPosition: 'top',
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: colors.yellow,
            tabBarInactiveTintColor: colors.black,
            tabBarStyle: {
              backgroundColor: colors.white,
              // paddingBottom: width(2),
              paddingTop: width(1.5),
              height: width(18),
            },
            tabBarLabelStyle: {
              fontSize: 14,
            },
          }}
          style={{marginTop: width(2)}}>
          <Tab.Screen
            name="currentOrders"
            component={CurrentOrders}
            options={{
              headerShown: false,
              tabBarLabel: 'Current',
              tabBarIcon: ({color, focused}) => {
                return (
                  <Ionicons
                    name="fast-food"
                    color={focused ? colors.yellow : colors.black}
                    size={20}
                  />
                );
              },
            }}
          />
          <Tab.Screen
            name="pastOrders"
            component={PastOrders}
            options={{
              headerShown: false,
              tabBarLabel: 'Completed',
              tabBarIcon: ({color, focused}) => {
                return (
                  <MaterialCommunityIcons
                    name="food-croissant"
                    color={focused ? colors.yellow : colors.black}
                    size={20}
                  />
                );
              },
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
}
export default Orders;
