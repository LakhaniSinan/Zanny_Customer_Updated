import axios from 'axios';
// let baseUrl = 'http://192.168.0.39:4000/api/';
let baseUrl = 'https://zannysfood-28892707e10a.herokuapp.com/api/';


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
