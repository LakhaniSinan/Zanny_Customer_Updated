import {createSlice} from '@reduxjs/toolkit';
import {getPaymentCardById} from '../../services/paymentCard';

export const initialState = {
  loading: false,
  hasErrors: false,
  cardsData: [],
};

const productsSlice = createSlice({
  name: 'cardsData',
  initialState,
  reducers: {
    getUserCard: state => {
      state.loading = true;
    },
    getCardSuccess: (state, {payload}) => {
      state.cardsData = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    getCardFailure: (state, {payload}) => {
      state.loading = false;
      state.hasErrors = payload;
    },
  },
});

export const {getUserCard, getCardSuccess, getCardFailure} =
  productsSlice.actions;

export default productsSlice.reducer;

export function handelGetCard(userId) {
  try {
    return async dispatch => {
      if (!userId) {
        return;
      }
      getPaymentCardById(userId)
        .then(response => {
          if (response.status === 200 || response.status === 201) {
            dispatch(getCardSuccess(response?.data?.cards));
          } else {
            dispatch(getCardFailure(response.data));
          }
        })
        .catch(error => {
          dispatch(getCardFailure(error));
          console.log(error, 'error');
        });
    };
  } catch (error) {
    console.log(error, 'ERRR');
  }
}
