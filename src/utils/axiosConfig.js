import axios from 'axios';



const token = localStorage.getItem('token');
const bearer = token ? token.split(' ')[1] : null;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: token
    ? {
        Authorization: `Bearer ${bearer}`
      }
    : {}
});


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && token.length > 10) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      //console.log(payload); 
    } catch (e) {
      console.error("Ошибка при разборе токена", e);
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});




// Обрабатываем 401 ошибки
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

export default instance;
