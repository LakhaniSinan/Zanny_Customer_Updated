import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const addDietRequirements = params => {
  return Api(endPoints.addDietRequirements, params, requestType.POST);
};

export const getDietRequirements = id => {
  return Api(`${endPoints.getDietRequirements}/${id}`, null, requestType.GET);
};

export const updateDietRequirements = (id, params) => {
  return Api(
    `${endPoints.updateDietRequirements}/${id}`,
    params,
    requestType.PUT,
  );
};
