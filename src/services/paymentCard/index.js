import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addPaymentCard = params => {
  return Api(endPoints.addPaymentCard, params, requestType.POST);
};

export const getPaymentCardById = id => {
  return Api(`${endPoints.getPaymentCardById}/${id}`, null, requestType.GET);
};


export const deletePaymentCard = id => {
  return Api(`${endPoints.deletePaymentCard}/${id}`, null, requestType.DELETE);
};

export const updatePaymentCard = (id, params) => {
  return Api(`${endPoints.updatePaymentCard}/${id}`, params, requestType.PUT);
};
