import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addToFavFun = params => {
  return Api(endPoints.addTofavourite, params, requestType.POST);
};

export const getUserFavProFun = id => {
  return Api(`${endPoints.getfavourite}/${id}`, null, requestType.GET);
};
