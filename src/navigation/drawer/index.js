import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import Address from '../../containers/app/address';
import AddEditAddress from '../../containers/app/address/addEditAddress';
import EditAllergies from '../../containers/app/allergies/editAllergies';
import Faq from '../../containers/app/faq';
import OrderDetail from '../../containers/app/orderDetails';
import Orders from '../../containers/app/orders';
import PaymentCard from '../../containers/app/paymentCard';
import AddEditPaymentCard from '../../containers/app/paymentCard/addEditPaymentCard';
import PaymentOptions from '../../containers/app/paymentOptions';
import PrivateOrder from '../../containers/app/privateOrder';
import Profile from '../../containers/app/profile';
import ChangePassword from '../../containers/app/profile/chnagePassword';
import PersonalInfo from '../../containers/app/profile/personalInfo';
import Restaurants from '../../containers/app/restaurants';
import Cart from '../../containers/app/restaurants/cart';
import Checkout from '../../containers/app/restaurants/checkout';
import Products from '../../containers/app/restaurants/products';
import Reviews from '../../containers/app/restaurants/reviews';
import SearchScreen from '../../containers/app/searchScreen';
import Support from '../../containers/app/support';
import AddSupportMsg from '../../containers/app/support/addSupportMsg';
import UpdateAllergies from '../../containers/app/updateAllergies';
import UserAllergies from '../../containers/app/userAllergies';
import UserQuestions from '../../containers/app/userQuestions';
import CurrentOrdersStack from '../currentOrdersStack';
import customerPrivateOrderStack from '../customerPrivateOrderStack';
import OrderStack from '../orderStack';
import ProfileStack from '../profileStack';
import AuthStack from './../AuthStack';
import DrawerContent from './customerContent';
const Drawer = createDrawerNavigator();

function DrawerNavigation(props) {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Restaurants"
        component={OrderStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={CurrentOrdersStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Address"
        component={Address}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Private Orders"
        component={customerPrivateOrderStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="FAQs"
        component={Faq}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="AuthStack"
        component={AuthStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="UserQuestions"
        component={UserQuestions}
      />

      <Drawer.Screen
        name="UserAllergies"
        component={UserAllergies}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AllRestaurants"
        component={Restaurants}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Reviews"
        component={Reviews}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Checkout"
        component={Checkout}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="PaymentCard"
        component={PaymentCard}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddEditPaymentCard"
        component={AddEditPaymentCard}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddEditAddress"
        component={AddEditAddress}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="PrivateOrder"
        component={PrivateOrder}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="PaymentOptions"
        component={PaymentOptions}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MyOrders"
        component={Orders}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="UserProfile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AllergiesAndDietaries"
        component={UpdateAllergies}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="EditAllergies"
        component={EditAllergies}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Support"
        component={Support}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddSupportMsg"
        component={AddSupportMsg}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
