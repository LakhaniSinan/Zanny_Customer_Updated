import {createSlice} from '@reduxjs/toolkit';
import {getHomeData} from '../../services/home';

export const initialState = {
  loading: false,
  hasErrors: false,
  homeData: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    fetchHome: state => {
      state.loading = true;
      state.hasErrors = false;
    },
    fetchHomeSuccess: (state, {payload}) => {
      state.loading = false;
      state.homeData = payload;
      state.hasErrors = false;
    },
    fetchHomeFailure: (state, {payload}) => {
      state.loading = false;
      state.hasErrors = payload || true;
    },
  },
});

export const {fetchHome, fetchHomeSuccess, fetchHomeFailure} =
  homeSlice.actions;

export default homeSlice.reducer;

export function handleFetchHomeData(data) {
  console.log(data, 'datadatadatadatadatadataasd');

  return async dispatch => {
    dispatch(fetchHome());
    try {
      const response = await getHomeData(data);
      console.log(response, 'responseresponseresponseresponseresponseasdasd');

      if (response?.status === 200 || response?.status === 201) {
        dispatch(fetchHomeSuccess(response.data.data));
      } else {
        dispatch(fetchHomeFailure('Something went wrong'));
      }
    } catch (error) {
      dispatch(fetchHomeFailure(error));
      console.log('Home Data Error', error);
    }
  };
}
