import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import PreOrderScreen from '../../containers/app/preOrder';
import PreOrder from '../../containers/app/preorders';


const Stack = createStackNavigator();

function PreOrderStackStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PreOrder"
        component={PreOrder
        }
        options={{
          headerShown: false,
        }}
      />
   
    </Stack.Navigator>
  );
}

export default PreOrderStackStack;
