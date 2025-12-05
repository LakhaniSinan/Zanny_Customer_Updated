import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addPaymentCard = params => {
  return Api(endPoints.addCard, params, requestType.POST);
};

export const getPaymentCardById = id => {
  return Api(`${endPoints.getPaymentCardById}/${id}`, null, requestType.GET);
};

export const deletePaymentCard = params => {
  return Api(endPoints.deletePaymentCard, params, requestType.POST);
};

export const updatePaymentCard = (id, params) => {
  return Api(`${endPoints.updatePaymentCard}/${id}`, params, requestType.PUT);
};
