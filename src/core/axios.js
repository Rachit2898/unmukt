import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNRestart from 'react-native-restart';
import baseURL from '../Config';

console.log({baseURL});

const instance = axios.create({
  baseURL: baseURL,
});
(async () => {
  const user = (await AsyncStorage.getItem('token')) || undefined;

  if (user) {
    let token = user;
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
})();

instance.interceptors.request.use(config => {
  return config;
});
instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response) {
      const message = error.response.data
        ? error.response.data.error.issue
        : error.message;

      if (error.response.status === 500) {
        // localStorage.removeItem("user");
        // window.location.replace("/addwallet");
        console.log('500 error');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('profile');
        // reopen the app to login again
        RNRestart.restart();
        return Promise.reject(new Error('Session Expired'));
      }

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

export const Axios = instance;
