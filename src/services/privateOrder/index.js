import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addPrivateOrder = params => {
  return Api(endPoints.addPrivateOrder, params, requestType.POST);
};

export const gePrivatetOrderByCustomer = id => {
  return Api(`${endPoints.gePrivatetOrderByCustomer}/${id}`, null, requestType.GET);
};

export const updatePrivateOrderStatus = (params)=>{
  return Api(
      `${endPoints.updatePrivateOrderStatus}`,
      params,
      requestType.PUT,
  );
}