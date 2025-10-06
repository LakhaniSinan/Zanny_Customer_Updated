import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const placeUserOrder = params => {
  return Api(endPoints.addOrder, params, requestType.POST);
};

export const getAllOrdersByCustomerId = id => {
  return Api(`${endPoints.getOrderByCustomer}/${id}`, null, requestType.GET);
};

export const updateOrderStatus = params => {
  return Api(`${endPoints.updateOrderStatus}`, params, requestType.PUT);
};
export const getPerKmCharges = () => {
  return Api(`${endPoints.getPerKmCharges}`, null, requestType.GET);
};

export const getCalculatedDeliveryFee = params => {
  return Api(`${endPoints.getCalculatedDeliveryFee}`, params, requestType.POST);
};
export const addReview = (id, params) => {
  return Api(`${endPoints.addReview}/${id}`, params, requestType.POST);
};

export const createStripeClientSecret = params => {
  return Api(`${endPoints.createPaymentIntent}`, params, requestType.POST);
};
