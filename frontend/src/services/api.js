import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const addUser = (data) => axios.post(`${API_URL}/api/add-user`, data);
export const addCourse = (data) => axios.post(`${API_URL}/api/add-course`, data);

