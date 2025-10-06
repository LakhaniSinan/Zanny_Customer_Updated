import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PersonalInfo from './../containers/app/profile/personalInfo';
import Allergies from './../containers/app/allergies/index';
import Orders from './../containers/app/orders/index';
import OrderDetail from './../containers/app/orderDetails/index';
import Profile from './../containers/app/profile/index';
import EditAllergies from './../containers/app/allergies/editAllergies';
import Address from '../containers/app/address';
import AddEditAddress from '../containers/app/address/addEditAddress';
import Support from '../containers/app/support';
import ChangePassword from '../containers/app/profile/chnagePassword';
import UserAllergies from '../containers/app/userAllergies';
import UpdateAllergies from '../containers/app/updateAllergies';
import AddSupportMsg from '../containers/app/support/addSupportMsg';

const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllergiesAndDietaries"
        component={UpdateAllergies}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditAllergies"
        component={EditAllergies}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEditAddress"
        component={AddEditAddress}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddSupportMsg"
        component={AddSupportMsg}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
