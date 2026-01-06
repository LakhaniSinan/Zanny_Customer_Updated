import {createSlice} from '@reduxjs/toolkit';
import {getPaymentCardById} from '../../services/paymentCard';

export const initialState = {
  loading: false,
  hasErrors: false,
  cardsData: null,
};

const CardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    fetchCards: state => {
      state.loading = true;
      state.hasErrors = false;
    },
    fetchCardsSuccess: (state, {payload}) => {
      state.loading = false;
      state.cardsData = payload;
      state.hasErrors = false;
    },
    fetchCardsFailure: (state, {payload}) => {
      state.loading = false;
      state.hasErrors = payload || true;
    },
  },
});

export const {fetchCards, fetchCardsSuccess, fetchCardsFailure} =
  CardSlice.actions;

export default CardSlice.reducer;

export function handleFetchCardsData(userId) {
  return async dispatch => {
    dispatch(fetchCards());
    try {
      const response = await getPaymentCardById(userId);
      console.log(response, 'responseresponseresponseresponse');

      if (response?.status === 200 || response?.status === 201) {
        dispatch(fetchCardsSuccess(response.data.cards || []));
      } else {
        dispatch(fetchCardsFailure('Something went wrong'));
      }
    } catch (error) {
      dispatch(fetchCardsFailure(error));
      console.log('Cards Data Error', error);
    }
  };
}
