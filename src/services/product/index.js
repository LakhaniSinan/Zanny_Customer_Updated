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

export const getAllProducts = params => {
  const query = [];

  if (params.page) query.push(`page=${params.page}`);
  if (params.limit) query.push(`limit=${params.limit}`);
  if (params.categoryId) query.push(`categoryId=${params.categoryId}`);
  if (params.userId) query.push(`userId=${params.userId}`);

  const finalURL = `${endPoints.getAllProducts}?${query.join('&')}`;

  return Api(finalURL, null, requestType.GET);
};
