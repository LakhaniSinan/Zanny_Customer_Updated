import {createSlice} from '@reduxjs/toolkit';

export const GetStarted = createSlice({
  name: 'GetStarted',
  initialState: {
    isGetStarted: false,
  },
  reducers: {
    setGetStarted: (state, action) => {
      state.isGetStarted = action.payload;
    },
  },
});

export const {setGetStarted} = GetStarted.actions;

export default GetStarted.reducer;
