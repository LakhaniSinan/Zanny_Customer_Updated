import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import AddressSlice from './slices/Address';
import CartSlice, {setCartData} from './slices/Cart';
import GetStarted, {setGetStarted} from './slices/GetStarted';
import LocationSlice, {setCurrentLocation} from './slices/Location';
import LoginSlice from './slices/Login';
import MerchantSlice from './slices/Merchant';
import OrderType from './slices/OrderType';
import PaymentCardSlice from './slices/paymentCard';
import PaymentType from './slices/PaymentType';
import QuestionsSlice from './slices/Questions';
import PreOrderDataSlice from './slices/PreOrder';
import AllergiesSlice from './slices/userAllergies';
import HomeDataSlice from './slices/HomeData';
import CardSlice from './slices/UserCards';
import CopiedCodeSlice from './slices/ClaimedPromo';

const reducer = combineReducers({
  LoginSlice,
  PreOrderDataSlice,
  CartSlice,
  CopiedCodeSlice,
  QuestionsSlice,
  CopiedCodeSlice,
  MerchantSlice,
  LocationSlice,
  PaymentCardSlice,
  CardSlice,
  OrderType,
  PaymentType,
  AddressSlice,
  AllergiesSlice,
  GetStarted,
  HomeDataSlice,
  CardSlice,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: false,
    }),
});

const loadInitialData = async () => {
  try {
    const cart = await AsyncStorage.getItem('cartData');
    const parsedCart = cart ? JSON.parse(cart) : [];

    store.dispatch(setCartData(parsedCart));

    const started = await AsyncStorage.getItem('GetStarted');
    const parsedStart = started ? JSON.parse(started) : false;
    store.dispatch(setGetStarted(parsedStart));

    const location = await AsyncStorage.getItem('userCurrentAddress');
    const parsedLocation = started ? JSON.parse(location) : false;
    store.dispatch(setCurrentLocation(parsedLocation));
  } catch (err) {
    console.log('Error loading initial data:', err);
  }
};

loadInitialData();

export default store;
