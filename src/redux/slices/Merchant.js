import {createSlice} from '@reduxjs/toolkit';

export const Merchant = createSlice({
  name: 'Merchant',
  initialState: {
    merchantDetail: null,
  },
  reducers: {
    setMerchantDetail: (state, action) => {
      state.merchantDetail = action.payload;
    },
  },
});

export const {setMerchantDetail} = Merchant.actions;

export default Merchant.reducer;
