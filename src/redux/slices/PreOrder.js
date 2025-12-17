import {createSlice} from '@reduxjs/toolkit';

export const PreOrderData = createSlice({
  name: 'PreOrderData',
  initialState: {
    preOrderData: [],
  },
  reducers: {
    setPreOrderData: (state, action) => {
      state.preOrderData = action.payload;
    },
  },
});

export const {setPreOrderData} = PreOrderData.actions;

export default PreOrderData.reducer;
