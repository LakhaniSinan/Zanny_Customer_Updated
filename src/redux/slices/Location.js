import {createSlice} from '@reduxjs/toolkit';

export const Location = createSlice({
  name: 'Location',
  initialState: {
    currentLocation: null,
  },
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
  },
});

export const {setCurrentLocation} = Location.actions;

export default Location.reducer;
