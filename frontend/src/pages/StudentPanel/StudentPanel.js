import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar/StudentSidebar';
import StudentDashboard from '../../components/StudentDashboard/StudentDashboard';
import StudentCourses from '../../components/StudentCourses/StudentCourses';
import StudentExams from '../../components/StudentExams/StudentExams';

const StudentPanel = () => {
  return (
    <div className="d-flex">
      <StudentSidebar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="exams" element={<StudentExams />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentPanel;
