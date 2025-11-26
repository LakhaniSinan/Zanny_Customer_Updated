import {configureStore} from '@reduxjs/toolkit';
import {applyMiddleware, combineReducers} from 'redux';
import LoginSlice from './slices/Login';
import CartSlice from './slices/Cart';
import QuestionsSlice from './slices/Questions';
import MerchantSlice from './slices/Merchant';
import LocationSlice from './slices/Location';
import PaymentCardSlice from './slices/paymentCard';
import AllergiesSlice from './slices/userAllergies';
import AddressSlice from './slices/Address';
import OrderType from './slices/OrderType';
import PaymentType from './slices/PaymentType';
import thunk from 'redux-thunk';
import GetStarted, {setGetStarted} from './slices/GetStarted';
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
  reducer: reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: false,
    }),
});

export default store;

const handleGetStarted = async () => {
  let data = await AsyncStorage.getItem('GetStarted');
  const parsed = data ? JSON.parse(data) : false;
  store.dispatch(setGetStarted(parsed));
};

handleGetStarted();
