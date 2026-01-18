import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const getHomeData = params => {
  return Api(endPoints.homeData, params, requestType.POST);
};
