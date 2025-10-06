import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

//Login Api
export const registerCustomer = params => {
  return Api(endPoints.registerCustomer, params, requestType.POST);
};

export const loginCustomer = params => {
  return Api(endPoints.loginCustomer, params, requestType.POST);
};

export const sendCode = params => {
  return Api(endPoints.sendCode, params, requestType.POST);
};
export const sendResetCodeCustomer = params => {
  return Api(endPoints.sendResetCodeCustomer, params, requestType.POST);
};

export const resetPasswordCustomer = params => {
  return Api(endPoints.resetPasswordCustomer, params, requestType.POST);
};

export const socialLogin = params => {
  return Api(endPoints.socialLogin, params, requestType.POST);
};
