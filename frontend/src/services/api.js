import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const addUser = (data) => axios.post(`${API_URL}/api/add-user`, data);
export const addCourse = (data) => axios.post(`${API_URL}/api/add-course`, data);

export const getStudents = () => axios.get(`${API_URL}/api/students`);
export const getTeachers = () => axios.get(`${API_URL}/api/teachers`);
export const getParents = () => axios.get(`${API_URL}/api/parents`);

