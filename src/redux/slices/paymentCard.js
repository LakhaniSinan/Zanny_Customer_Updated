import {createSlice} from '@reduxjs/toolkit';

export const PaymentCard = createSlice({
  name: 'PaymentCard',
  initialState: {
    currentPaymentCard: null,
  },
  reducers: {
    setCurrentPaymentCard: (state, action) => {
      state.currentPaymentCard = action.payload;
    },
  },
});

export const {setCurrentPaymentCard} = PaymentCard.actions;

export default PaymentCard.reducer;
