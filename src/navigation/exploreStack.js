import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import MaintenanceScreen from '../containers/app/exploreMaintaness';
const Stack = createStackNavigator();

function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MaintenanceScreen"
        component={MaintenanceScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ExploreStack;
