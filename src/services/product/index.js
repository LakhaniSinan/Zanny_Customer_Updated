import Api from '../index';
import { endPoints, requestType } from '../../constants/variables';

export const getProductsByMerchantId = id => {
  return Api(
    `${endPoints.getProductsByMerchantId}/${id}`,
    null,
    requestType.GET,
  );
};

export const getProductDetailById = (id, userId) => {
  const query = userId ? `?userId=${userId}` : '';
  return Api(
    `${endPoints.productDetailById}/${id}${query}`,
    null,
    requestType.GET,
  );
};

export const getAllProducts = (params) => {
  const query = [];

  if (params.page) query.push(`page=${params.page}`);
  if (params.limit) query.push(`limit=${params.limit}`);
  if (params.categoryId) query.push(`categoryId=${params.categoryId}`);
  if (params.userId) query.push(`userId=${params.userId}`);
  if (params.searchQuery)
    query.push(`searchQuery=${encodeURIComponent(params.searchQuery)}`);

  // ✅ Add user's latitude and longitude
  if (params.latitude) query.push(`latitude=${params.latitude}`);
  if (params.longitude) query.push(`longitude=${params.longitude}`);

  const finalURL = `${endPoints.getAllProducts}?${query.join('&')}`;
  console.log(finalURL, 'finalURLfinalURLfinalURLfinalURLfinalURL');

  return Api(finalURL, null, requestType.GET);
};

