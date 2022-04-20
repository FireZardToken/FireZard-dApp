import axios from 'axios';
const API_ROOT = process.env.REACT_APP_API_ENV === 'development' ? process.env.REACT_APP_API_DEV_ROOT: process.env.REACT_APP_API_PROD_ROOT;
// const API_TIMEOUT =  process.env.REACT_APP_API_TIMEOUT_MILLISECONDS;
/* eslint-disable dot-notation */

axios.defaults.baseURL = API_ROOT;
// axios.defaults.timeout = API_TIMEOUT;
// axios.defaults.headers.common['Accept'] = 'application/json';
// axios.interceptors.request.use(
//     config => config,
//     error => Promise.reject(error)
// );

// axios.interceptors.response.use(
//     response => response,
//     error => Promise.reject(error.response || error.request || error.message)
// );

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*'
}

const http = {
    setAuthorizationHeader(accessToken) {
        axios.defaults.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
    },
    request(config = {}) {
        return axios.request(config);
    },
    get(url, config = {}) {
        return axios.get(url, config);
    },
    post(url, data = {}, config = {}) {
        return axios.post(url, data, headers);
    },
    put(url, data = {}, config = {}) {
        return axios.put(url, data, config);
    },
    patch(url, data = {}, config = {}) {
        return axios.patch(url, data, config);
    },
    delete(url, config = {}) {
        return axios.delete(url, config);
    }
};

export default http;
