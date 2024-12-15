import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-render-url.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const addUser = (data) => api.post('/api/add-user', data);
export const checkStudentNoUnique = (studentNo) => {
    return api.post('/api/check-student-no', { studentNo })
      .then((response) => response.data.isUnique)  // Burada, backend'den gelen 'isUnique' değerini döndürüyoruz
      .catch((error) => {
        console.error('Benzersizlik kontrolü sırasında hata oluştu:', error);
        return false; // Hata durumunda benzersiz olmadığını varsay
      });
  };

export const getStudents = () => api.get('/api/students');
export const getTeachers = () => api.get('/api/teachers');

export const deleteStudents = (ids) => {
  return api.post('/api/deleteStudents', { ids });
};

export const deleteTeachers = (ids) => {
  return api.post('/api/deleteTeachers', { ids });
};

// Sınav sonucu ekleme
export const addExam = (data) => api.post('/api/add-exam', data);

// Öğrenci numarasına göre öğrenci bilgilerini getirme
export const getStudentInfo = (studentNo) => api.get(`/api/student-info/${studentNo}`);

// Tüm öğrenci numaralarını getirme
export const getAllStudentNumbers = () => api.get('/api/student-numbers');

// Öğrenci listesini getir
export const getStudentList = () => api.get('/api/student-list');

// Sınav sonuçlarını silme
export const deleteExams = async (ids) => {
    return await api.post('/exams/delete', { ids });
};

// Sınav tarihleri
export const getExamDates = () => api.get('/api/dates');

// Belirli bir tarihteki sınav türlerini getir
export const getExamTypesByDate = (date) => api.get(`/api/exam-types/${date}`);

// Belirli bir tarih ve türdeki sınavları getir
export const getExamsByDateAndType = (date, examType) => api.get(`/api/by-date/${date}/${examType}`);

// Belirli bir tarihteki son sınavın öğrenci puanlarını getir
export const getLatestExamScores = (date) => api.get(`/api/latest-exam-scores/${date}`);

// Son sınavın detaylarını getir
export const getLatestExamDetails = (date) => api.get(`/api/latest-exam-details/${date}`);
