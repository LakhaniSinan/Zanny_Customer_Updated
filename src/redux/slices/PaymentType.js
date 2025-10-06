import {createSlice} from '@reduxjs/toolkit';

export const PaymentType = createSlice({
  name: 'PaymentType',
  initialState: {
    paymentType: '',
  },
  reducers: {
    setPaymentType: (state, action) => {
      state.paymentType = action.payload;
    },
  },
});

export const {setPaymentType} = PaymentType.actions;

export default PaymentType.reducer;
