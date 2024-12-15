import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import TeacherPanel from './pages/TeacherPanel/TeacherPanel';
import StudentPanel from './pages/StudentPanel/StudentPanel';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute role="admin">
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <PrivateRoute role="teacher">
              <TeacherPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <PrivateRoute role="student">
              <StudentPanel />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
