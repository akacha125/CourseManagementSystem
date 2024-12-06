import React from 'react';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaUserFriends, FaUserPlus  } from 'react-icons/fa';
import { PiNoteFill, PiNotePencilBold  } from "react-icons/pi";
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
                    <a href="#dashboard" className="nav-link text-white d-flex align-items-center">
                        <FaHome className="me-3 fs-3" /> Dashboard
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a href="#students" className="nav-link text-white d-flex align-items-center">
                        <FaUserGraduate className="me-3 fs-3" /> Öğrenciler
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a href="#teachers" className="nav-link text-white d-flex align-items-center">
                        <FaChalkboardTeacher className="me-3 fs-3" /> Öğretmenler
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a href="#parents" className="nav-link text-white d-flex align-items-center">
                        <FaUserFriends  className="me-3 fs-3" /> Veliler
                    </a>
                </li>
                <li className="nav-item mb-4">
                    <a href="#exams" className="nav-link text-white d-flex align-items-center">
                        <PiNoteFill   className="me-3 fs-3" /> Sınavlar
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a href="#newUser" className="nav-link text-white d-flex align-items-center">
                        <FaUserPlus   className="me-3 fs-3" /> Yeni kullanıcı
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a href="#newExamPoints" className="nav-link text-white d-flex align-items-center">
                        <PiNotePencilBold   className="me-3 fs-3" /> Yeni sonuçlar
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
