import { createSlice } from '@reduxjs/toolkit';

export const Cart = createSlice({
  name: 'Cart',
  initialState: {
    cartData: [],
  },
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
  },
});

export const { setCartData } = Cart.actions;

export default Cart.reducer;
