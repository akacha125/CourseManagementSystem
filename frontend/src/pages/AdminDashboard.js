import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPanel from '../components/MainPanel/MainPanel';
import StudentsList from '../components/StudentsList/StudentsList';
import TeachersList from '../components/TeachersList/TeachersList';
import ExamsList from '../components/ExamsList/ExamsList';
import NewUser from '../components/NewUser/NewUser';
import NewExam from '../components/NewExam/NewExam';
import Sidebar from '../components/Sidebar/Sidebar';

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="mainPanel" replace />} />
          <Route path="mainPanel" element={<MainPanel />} />
          <Route path="studentsList" element={<StudentsList />} />
          <Route path="teachersList" element={<TeachersList />} />
          <Route path="examsList" element={<ExamsList />} />
          <Route path="newUser" element={<NewUser />} />
          <Route path="newExam" element={<NewExam />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
