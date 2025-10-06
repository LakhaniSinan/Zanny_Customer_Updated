import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import Address from '../containers/app/address';
import AddEditAddress from '../containers/app/address/addEditAddress';
import EditAllergies from '../containers/app/allergies/editAllergies';
import OrderDetail from '../containers/app/orderDetails';
import Orders from '../containers/app/orders';
import PaymentCard from '../containers/app/paymentCard';
import AddEditPaymentCard from '../containers/app/paymentCard/addEditPaymentCard';
import PaymentOptions from '../containers/app/paymentOptions';
import PrivateOrder from '../containers/app/privateOrder';
import Profile from '../containers/app/profile';
import ChangePassword from '../containers/app/profile/chnagePassword';
import PersonalInfo from '../containers/app/profile/personalInfo';
import Restaurants from '../containers/app/restaurants';
import Cart from '../containers/app/restaurants/cart';
import Checkout from '../containers/app/restaurants/checkout';
import Products from '../containers/app/restaurants/products';
import Reviews from '../containers/app/restaurants/reviews';
import SearchScreen from '../containers/app/searchScreen';
import Support from '../containers/app/support';
import AddSupportMsg from '../containers/app/support/addSupportMsg';
import UpdateAllergies from '../containers/app/updateAllergies';
import UserAllergies from '../containers/app/userAllergies';
import UserQuestions from '../containers/app/userQuestions/index';

const Stack = createStackNavigator();

function AppStack() {
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let data = await AsyncStorage.getItem('termsAccepted');
    data = JSON.parse(data);
    setLocalData(data);
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="UserQuestions"
        component={UserQuestions}
      />

      <Stack.Screen
        name="UserAllergies"
        component={UserAllergies}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllRestaurants"
        component={Restaurants}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentCard"
        component={PaymentCard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEditPaymentCard"
        component={AddEditPaymentCard}
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
        name="PrivateOrder"
        component={PrivateOrder}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PaymentOptions"
        component={PaymentOptions}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyOrders"
        component={Orders}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
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

export default AppStack;
