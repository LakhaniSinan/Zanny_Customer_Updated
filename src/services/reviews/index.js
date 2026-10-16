import api from '..';
import {endPoints, requestType} from '../../constants/variables';

export const addReviews = params => {
  return api(endPoints.addReviews, params, requestType.POST);
};
