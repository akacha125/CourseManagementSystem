import React from 'react';
import UserForm from '../components/UserForm';
import CourseForm from '../components/CourseForm';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Kullanıcı Ekle</h2>
      <UserForm />
      <h2>Ders Ekle</h2>
      <CourseForm />
    </div>
  );
};

export default AdminDashboard;
