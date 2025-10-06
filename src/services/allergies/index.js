import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getAllergiesCategories = () => {
    return Api(`${endPoints.getAllergiesCategories}`, null, requestType.GET);
  };

  export const getAllAllergies = () => {
    return Api(
        `${endPoints.getAllAllergies}`,
        null,
        requestType.GET,
    );
}
export const  getAllFAQs= () => {
  return Api(
      `${endPoints.getAllFAQs}`,
      null,
      requestType.GET,
  );
}