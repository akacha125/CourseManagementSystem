import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';

import AdminDashboard from './pages/AdminDashboard';
import MainPanel from './components/MainPanel/MainPanel';
import StudentsList from './components/StudentsList/StudentsList';
import TeachersList from './components/TeachersList/TeachersList';
import ParentsList from './components/ParentsList/ParentsList';
import ExamsList from './components/ExamsList/ExamsList';
import NewUser from './components/NewUser/NewUser';
import NewExam from './components/NewExam/NewExam';

import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<AdminDashboard />} >
          <Route path="mainPanel" element={<MainPanel />} />
          <Route path="studentsList" element={<StudentsList />} />
          <Route path="teachersList" element={<TeachersList />} />
          <Route path="parentsList" element={<ParentsList />} />
          <Route path="examsList" element={<ExamsList />} />
          <Route path="newUser" element={<NewUser />} />
          <Route path="newExam" element={<NewExam />} />
        </Route>
        <Route path='/teacher' element={<TeacherDashboard />} />
        <Route path='/student' element={<StudentDashboard />} />
        <Route path='/parent' element={<ParentDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
