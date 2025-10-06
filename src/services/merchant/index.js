import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getAllMerchants = () => {
  return Api(endPoints.getAllMerchants, null, requestType.GET);
};

export const getAllMerchantByCurrentLocation = params => {
  return Api(
    endPoints.getAllMerchantByCurrentLocation,
    params,
    requestType.POST,
  );
};

export const getAllMerchantByCurrentLocationPickUp = params => {
  return Api(
    endPoints.getAllMerchantByCurrentLocationPickUp,
    params,
    requestType.POST,
  );
};

export const addSubscribers = params => {
  return Api(endPoints.addSubscribers, params, requestType.POST);
};

export const removeSubscribers = params => {
  return Api(endPoints.removeSubscribers, params, requestType.POST);
};

export const getMerchantProfile = id => {
  return Api(`${endPoints.getMerchantProfile}/${id}`, null, requestType.GET);
};
export const getSearchdMerchants = (name, params) => {
  return Api(
    `${endPoints.getSearchdMerchants}?searchBody=${name}`,
    params,
    requestType.POST,
  );
};
