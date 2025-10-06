import {createSlice} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {getAddress} from '../../services/address';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialState = {
  loading: false,
  hasErrors: false,
  address: [],
};

const productsSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    getUserAddress: state => {
      state.loading = true;
    },
    getAddressSuccess: (state, {payload}) => {
      state.address = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    getAddressFailure: (state, {payload}) => {
      state.loading = false;
      state.hasErrors = payload;
    },
  },
});

export const {getUserAddress, getAddressSuccess, getAddressFailure} =
  productsSlice.actions;

export default productsSlice.reducer;

export function handelGetAddress(place) {
  try {
    return async dispatch => {
      // console.log("CALLEDDD");
      dispatch(getUserAddress());
      // console.log("CALLEDDD_22");
      let data = await AsyncStorage.getItem('user');
      data = JSON.parse(data);
      getAddress(data?._id)
        .then(response => {
          if (response?.data?.status == 'ok') {
            let data = response?.data?.data;
            dispatch(getAddressSuccess(data));
          } else {
            dispatch(getAddressFailure(response.data));
            alert('something went wrong');
          }
        })
        .catch(error => {
          dispatch(getAddressFailure(error));
          console.log(error, 'error');
        });
    };
  } catch (error) {
    console.log(error, 'ERRR');
  }
}
