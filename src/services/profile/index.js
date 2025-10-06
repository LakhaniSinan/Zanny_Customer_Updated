import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getCustomerProfile = id => {
  return Api(`${endPoints.getCustomerProfile}/${id}`, null, requestType.GET);
};

export const updateCustomerProfile = (id, params) => {
  return Api(
    `${endPoints.updateCustomerProfile}/${id}`,
    params,
    requestType.PUT,
  );
};

export  const getSupportMessagesById = (id, params) => {
  return Api(
    `${endPoints.getSupportMessagesById}/${id}`,
    null,
    requestType.GET,
  );
};
export  const createSupportMessage = (params) => {
  return Api(
    `${endPoints.createSupportMessage}`,
    params,
    requestType.POST,
  );
};

export const changePasswordCustomer = params => {
  return Api(endPoints.changePasswordCustomer, params, requestType.POST);
};
