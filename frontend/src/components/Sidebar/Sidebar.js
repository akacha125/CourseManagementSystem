import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkMode from '../DarkMode';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar bg-dark text-white p-4">
      <div className="d-flex flex-column h-100">
        <div className="mb-4 text-center">
          <img src="/images/logo2.png" alt="Logo" className="sidebar-logo mb-2" />
          <h4>EGE-X</h4>
          <p>Kurs Merkezi</p>
          <DarkMode />
        </div>

        <nav className="nav flex-column mb-auto">
          <Link to="/admin/mainPanel" className="nav-link text-white mb-3">
            <i className="bi bi-house-door me-2"></i>
            Ana Panel
          </Link>
          <Link to="/admin/studentsList" className="nav-link text-white mb-3">
            <i className="bi bi-people me-2"></i>
            Öğrenci Listesi
          </Link>
          <Link to="/admin/teachersList" className="nav-link text-white mb-3">
            <i className="bi bi-person-workspace me-2"></i>
            Öğretmen Listesi
          </Link>
          <Link to="/admin/examsList" className="nav-link text-white mb-3">
            <i className="bi bi-journal-text me-2"></i>
            Sınav Listesi
          </Link>
          <Link to="/admin/newUser" className="nav-link text-white mb-3">
            <i className="bi bi-person-plus me-2"></i>
            Yeni Kullanıcı
          </Link>
          <Link to="/admin/newExam" className="nav-link text-white mb-3">
            <i className="bi bi-plus-circle me-2"></i>
            Yeni Sınav
          </Link>
        </nav>

        <button 
          onClick={handleLogout} 
          className="btn btn-outline-light mt-auto"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
