import {createSlice} from '@reduxjs/toolkit';

export const Questions = createSlice({
  name: 'Questions',
  initialState: {
    userQuestions: null,
  },
  reducers: {
    setUserQuestions: (state, action) => {
      state.userQuestions = action.payload;
    },
  },
});

export const {setUserQuestions} = Questions.actions;

export default Questions.reducer;
