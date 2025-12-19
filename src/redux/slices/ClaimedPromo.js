import {createSlice} from '@reduxjs/toolkit';

export const CopiedCode = createSlice({
  name: 'CopiedCode',
  initialState: {
    copiedCode: null,
  },
  reducers: {
    setCopiedCodeData: (state, action) => {
      state.copiedCode = action.payload;
    },
  },
});

export const {setCopiedCodeData} = CopiedCode.actions;

export default CopiedCode.reducer;
