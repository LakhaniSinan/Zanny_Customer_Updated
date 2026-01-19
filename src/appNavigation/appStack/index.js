import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import {RESULTS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import PaymentScreen from '../../components/stripePayment/PaymentScreen';
import Address from '../../containers/app/address';
import AddEditAddress from '../../containers/app/address/addEditAddress';
import LeaveReviewScreen from '../../containers/app/addReview';
import AllCategories from '../../containers/app/allCategories';
import AllChefs from '../../containers/app/allChefs';
import EditAllergies from '../../containers/app/allergies/editAllergies';
import AllFoodScreen from '../../containers/app/allFoodScreen';
import CartScreen from '../../containers/app/cartScreen';
import CheckoutScreen from '../../containers/app/checkoutScreen';
import ChefDetails from '../../containers/app/chefDetails';
import HelpCenter from '../../containers/app/helpCenter';
import Notifications from '../../containers/app/notification';
import OrderDetail from '../../containers/app/orderDetails';
import Orders from '../../containers/app/orders';
import PaymentCard from '../../containers/app/paymentCard';
import AddEditPaymentCard from '../../containers/app/paymentCard/addEditPaymentCard';
import PaymentOptions from '../../containers/app/paymentOptions';
import PreOrderScreen from '../../containers/app/preOrder';
import PrivacyPolicy from '../../containers/app/privacyPolicy';
import PrivateOrder from '../../containers/app/privateOrder';
import ProductDetail from '../../containers/app/productDetail';
import Profile from '../../containers/app/profile';
import ChangePassword from '../../containers/app/profile/chnagePassword';
import PersonalInfo from '../../containers/app/profile/personalInfo';
import ReOccuringCheckout from '../../containers/app/reOccuringCheckOut';
import ReOccurinOrder from '../../containers/app/reOccurinOrder';
import restaurants from '../../containers/app/restaurants';
import Cart from '../../containers/app/restaurants/cart';
import Checkout from '../../containers/app/restaurants/checkout';
import Products from '../../containers/app/restaurants/products';
import Reviews from '../../containers/app/restaurants/reviews';
import SearchScreen from '../../containers/app/searchScreen';
import Support from '../../containers/app/support';
import AddSupportMsg from '../../containers/app/support/addSupportMsg';
import TermsAndConditions from '../../containers/app/termsAndConditions';
import UpdateAllergies from '../../containers/app/updateAllergies';
import UserAllergies from '../../containers/app/userAllergies';
import AllVouchers from '../../containers/app/vouchers';
import CodeVerification from '../../containers/auth/Codeverification';
import ForgotPassword from '../../containers/auth/forgotPassword';
import Login from '../../containers/auth/Login';
import ResetPassword from '../../containers/auth/resetPassword';
import SignUpScreen from '../../containers/auth/SignUp';
import {helper} from '../../helper';
import {handelGetAddress} from '../../redux/slices/Address';
import {handleFetchHomeData} from '../../redux/slices/HomeData';
import {setCurrentLocation} from '../../redux/slices/Location';
import {handleFetchCardsData} from '../../redux/slices/UserCards';
import BottomNavigation from './bottomTab';

const Stack = createStackNavigator();

export const MyTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const DEFAULT_UK_LOCATION = {
  latitude: 51.5074, // London latitude
  longitude: -0.1278, // London longitude
  address: 'United Kingdom',
};

export function CustomerStack() {
  const dispatch = useDispatch(null);
  const {user} = useSelector(state => state.LoginSlice);
  const navigation = useNavigation();
  const {currentLocation} = useSelector(state => state.LocationSlice);

  useEffect(() => {
    handleGetCurrentLocation();
    if (user) dispatch(handelGetAddress());
    if (user) dispatch(handleFetchCardsData(user?._id));
  }, [dispatch, user]);

  useEffect(() => {
    let data = {
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
    };
    dispatch(handleFetchHomeData(data));
  }, [dispatch, currentLocation]);

  const handleGetCurrentLocation = async () => {
    try {
      let status = await helper.checkLocation();
      console.log(status, 'statusstatusstatusstatus');

      if (status !== RESULTS.GRANTED) {
        status = await helper.requestLocationPermission();
      }

      if (status !== 'granted') {
        console.log(
          'Location permission denied, using default Canada location',
        );

        await AsyncStorage.setItem(
          'userCurrentAddress',
          JSON.stringify(DEFAULT_UK_LOCATION),
        );

        dispatch(setCurrentLocation(DEFAULT_UK_LOCATION));
        return;
      }

      const position = await helper.getCurrentLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      let address = '';
      try {
        address = await helper.getLocationAddress(latitude, longitude);
      } catch (e) {
        console.log('Address error:', e);
      }

      const payload = {
        latitude,
        longitude,
        address,
      };

      await AsyncStorage.setItem('userCurrentAddress', JSON.stringify(payload));

      dispatch(setCurrentLocation(payload));
    } catch (error) {
      console.log('getLatLngWithAddress error:', error);

      // ❗ Safety fallback
      dispatch(setCurrentLocation(DEFAULT_UK_LOCATION));
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        ...MyTransition,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="BottomStack"
        component={BottomNavigation}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ReOccurinOrder"
        component={ReOccurinOrder}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="LeaveReviewScreen"
        component={LeaveReviewScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ReOccuringCheckout"
        component={ReOccuringCheckout}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="AllChefs"
        component={AllChefs}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="HelpCenter"
        component={HelpCenter}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="Notifications"
        component={Notifications}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="CheckoutScreen"
        component={CheckoutScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="PreOrderScreen"
        component={PreOrderScreen}
      />
      <Stack.Screen
        name="UserAllergies"
        component={UserAllergies}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChefDetails"
        component={ChefDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllFoodScreen"
        component={AllFoodScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AllCategories"
        component={AllCategories}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AllVouchers"
        component={AllVouchers}
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
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
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
        name="CartScreen"
        component={CartScreen}
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
        name="Address"
        component={Address}
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
        name="PrivateOrder"
        component={PrivateOrder}
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
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="TermsAndConditions"
        component={TermsAndConditions}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SignUpScreen"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CodeVerification"
        component={CodeVerification}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ResetPassword"
        component={ResetPassword}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="AllRestaurants"
        component={restaurants}
      />
    </Stack.Navigator>
  );
}
