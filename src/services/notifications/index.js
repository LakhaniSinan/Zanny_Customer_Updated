import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getNotifcations = params => {
  return Api(`${endPoints.notifications}/${params}`, null, requestType.GET);
};
export const markAsReadNotification = params => {
  return Api(`${endPoints.markAsRead}/${params}`, null, requestType.GET);
};


