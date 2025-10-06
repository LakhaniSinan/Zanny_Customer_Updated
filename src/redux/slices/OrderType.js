import {createSlice} from '@reduxjs/toolkit';

export const OrderType = createSlice({
  name: 'OrderType',
  initialState: {
    orderType: '',
  },
  reducers: {
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
  },
});

export const {setOrderType} = OrderType.actions;

export default OrderType.reducer;
