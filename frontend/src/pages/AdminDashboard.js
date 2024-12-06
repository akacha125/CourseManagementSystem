import React from 'react';
import UserForm from '../components/UserForm';
import CourseForm from '../components/CourseForm';
import Sidebar from "../components/Sidebar/Sidebar";
import DarkMode from "../components/DarkMode";

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <DarkMode/>
      <Sidebar />
      <div className="flex-grow-1 bg-gradient p-4">
        <h1>Hoş Geldiniz</h1>
        <p>Burada içerik görüntülenecek.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
