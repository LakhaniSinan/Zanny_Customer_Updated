import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getProductsByMerchantId = id => {
  return Api(
    `${endPoints.getProductsByMerchantId}/${id}`,
    null,
    requestType.GET,
  );
};

export const getProductDetailById = id => {
  return Api(`${endPoints.productDetailById}/${id}`, null, requestType.GET);
};

export const getAllProducts = (page = 1, limit = 10) => {
  return Api(
    `${endPoints.getAllProducts}?page=${page}&limit=${limit}`,
    null,
    requestType.GET,
  );
};
