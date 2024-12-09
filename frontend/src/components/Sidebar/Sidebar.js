import React from 'react';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaUserPlus } from 'react-icons/fa';
import { PiNoteFill, PiNotePencilBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="d-flex flex-column bg-dark text-white vh-100 p-4" style={{ width: '300px' }}>
            <div className="text-center mb-4 mt-3">
                <p>EGE-X Kurs Merkezi</p>
                <img src="/images/logo2.png" alt="Logo" className="rounded-circle logo" />
                <h5 className="text-center mb-2">Admin Paneli</h5>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item mb-4">
                    <Link to="/admin/mainPanel" className="nav-link text-white d-flex align-items-center">
                        <FaHome className="me-3 fs-3" /> Dashboard
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/admin/studentsList" className="nav-link text-white d-flex align-items-center">
                        <FaUserGraduate className="me-3 fs-3" /> Öğrenciler
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/admin/teachersList" className="nav-link text-white d-flex align-items-center">
                        <FaChalkboardTeacher className="me-3 fs-3" /> Öğretmenler
                    </Link>
                </li>
                <li className="nav-item mb-4">
                    <Link to="/admin/examsList" className="nav-link text-white d-flex align-items-center">
                        <PiNoteFill className="me-3 fs-3" /> Sınavlar
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/admin/newUser" className="nav-link text-white d-flex align-items-center">
                        <FaUserPlus className="me-3 fs-3" /> Yeni kullanıcı
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/admin/newExam" className="nav-link text-white d-flex align-items-center">
                        <PiNotePencilBold className="me-3 fs-3" /> Yeni sonuçlar
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
