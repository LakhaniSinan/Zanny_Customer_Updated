import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getProductsByMerchantId = id => {
  return Api(
    `${endPoints.getProductsByMerchantId}/${id}`,
    null,
    requestType.GET,
  );
};
