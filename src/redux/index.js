import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import LoginSlice from './slices/Login';
import CartSlice, {setCartData} from './slices/Cart';
import QuestionsSlice from './slices/Questions';
import MerchantSlice from './slices/Merchant';
import LocationSlice from './slices/Location';
import PaymentCardSlice from './slices/paymentCard';
import AllergiesSlice from './slices/userAllergies';
import AddressSlice from './slices/Address';
import OrderType from './slices/OrderType';
import PaymentType from './slices/PaymentType';
import GetStarted, {setGetStarted} from './slices/GetStarted';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducer = combineReducers({
  LoginSlice,
  CartSlice,
  QuestionsSlice,
  MerchantSlice,
  LocationSlice,
  PaymentCardSlice,
  OrderType,
  PaymentType,
  AddressSlice,
  AllergiesSlice,
  GetStarted,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: false,
    }),
});

// -----------------------------
// 🔥 LOAD DATA FROM STORAGE HERE
// -----------------------------

const loadInitialData = async () => {
  try {
    const cart = await AsyncStorage.getItem('cartData');
    const parsedCart = cart ? JSON.parse(cart) : [];

    store.dispatch(setCartData(parsedCart));

    const started = await AsyncStorage.getItem('GetStarted');
    const parsedStart = started ? JSON.parse(started) : false;

    store.dispatch(setGetStarted(parsedStart));
  } catch (err) {
    console.log('Error loading initial data:', err);
  }
};

loadInitialData();

export default store;
