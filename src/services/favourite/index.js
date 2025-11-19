import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addToFavFun = params => {
  return Api(endPoints.favourite, params, requestType.POST);
};
