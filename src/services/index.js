import axios from 'axios';
// let baseUrl = 'http://192.168.0.57:4000/api/';
// let baseUrl = 'https://czmgcw3c-4000.inc1.devtunnels.ms/api/';
let baseUrl = 'https://sirldigital.com/zannyFoods/api/';
// let baseUrl = 'https://g85x8vg6-4000.inc1.devtunnels.ms/api/';

const api = async (path, params, method) => {
  let options;
  options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: method,
    ...(params && {data: JSON.stringify(params)}),
  };
  console.log('options', `${baseUrl}${path}`, options);
  return axios(baseUrl + path, options)
    .then(response => {
      return response;
    })
    .catch(async error => {
      return error.response;
    });
};

export default api;
