import {createSlice} from '@reduxjs/toolkit';

export const Allergies = createSlice({
  name: 'Allergies',
  initialState: {
    userAllergies: null,
  },
  reducers: {
    setUserAllergies: (state, action) => {
      state.userAllergies = action.payload;
    },
  },
});

export const {setUserAllergies} = Allergies.actions;

export default Allergies.reducer;
