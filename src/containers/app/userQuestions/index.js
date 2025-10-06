import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../../../components';
import {createStackNavigator} from '@react-navigation/stack';
import Steps from './stepIndicator';
import {height} from 'react-native-dimension';
import Intolerance from './intolerance';
import FoodAllergies from './foodAllergies';
import HealthProblems from './healthProblems';
import DietryRequirements from './dietryRequirements';
// import FinalStep from './finalStep';

let topViewRef = null;

const UserQuestions = () => {
  const Stack = createStackNavigator();

  let labels = ['Intolerance', 'Allergies', 'Health', 'Requirements'];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginTop: height(2)}}>
        <Steps ref={ref => (topViewRef = ref)} steps={4} labels={labels} />
      </View>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Intolerance"
          component={Intolerance}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FoodAllergies"
          component={FoodAllergies}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HealthProblems"
          component={HealthProblems}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DietryRequirements"
          component={DietryRequirements}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="FinalStep"
          component={FinalStep}
          options={{headerShown: false}}
        /> */}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export const ChangeScreen = id => {
  topViewRef?.changeScreen(id);
};

export default UserQuestions;
