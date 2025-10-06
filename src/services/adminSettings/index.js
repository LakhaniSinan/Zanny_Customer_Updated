import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getAdminSettings = () => {
  return Api(`${endPoints.getSettings}`, null, requestType.GET);
};
