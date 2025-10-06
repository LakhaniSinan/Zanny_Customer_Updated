import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addAddress = params => {
  return Api(endPoints.addAddress, params, requestType.POST);
};

export const getAddress = id => {
  return Api(`${endPoints.getAddress}/${id}`, null, requestType.GET);
};

export const updateAddress = (id, params) => {
  return Api(`${endPoints.updateAddress}/${id}`, params, requestType.PUT);
};

export const deleteAddress = params => {
  return Api(`${endPoints.deleteAddress}/${params}`, null, requestType.DELETE);
};
export const checkAddressCahngeIsPossible = params => {
  return Api(endPoints.addressCahngeIsPossible, params, requestType.POST);
};
