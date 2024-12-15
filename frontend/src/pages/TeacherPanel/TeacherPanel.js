import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar/TeacherSidebar';
import TeacherDashboard from '../../components/TeacherDashboard/TeacherDashboard';
import TeacherCourses from '../../components/TeacherCourses/TeacherCourses';
import TeacherExams from '../../components/TeacherExams/TeacherExams';

const TeacherPanel = () => {
  return (
    <div className="d-flex">
      <TeacherSidebar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="exams" element={<TeacherExams />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherPanel;
