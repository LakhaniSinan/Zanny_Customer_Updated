import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getHomeData = () => {
  return Api(endPoints.homeData, null, requestType.GET);
};
