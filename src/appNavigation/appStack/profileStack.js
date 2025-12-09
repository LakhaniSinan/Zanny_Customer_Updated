import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ProfileScreen from '../../containers/app/profileScreen';


const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
