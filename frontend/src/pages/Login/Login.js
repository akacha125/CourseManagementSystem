import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DarkMode from "../../components/DarkMode";
import './styles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        username,
        password
      });

      if (response.data.token) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', response.data.token);
        
        // Axios için default header'ı ayarla
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        console.log('Decoded token:', decodedToken);
        
        if (decodedToken.role === 'admin') {
          navigate('/admin/mainPanel');
        } else if (decodedToken.role === 'teacher') {
          navigate('/teacher');
        } else if (decodedToken.role === 'student') {
          navigate('/student');
        } 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 loginBackground ">
      <DarkMode/>
      <div className="container d-flex justify-content-center">
        <div className="card bg-dark justify-content-center shadow-lg border-dark p-5 rounded-start-5" style={{ width: '250px', height: "600px" }}>
        <img src="/images/logo2.png" className="rounded-circle border-3-primary logo" alt="logo" />
        <h4 className="text-center fw-bold">EGE-X</h4>
        <h4 className="text-center mb-5 fw-bold">Kurs Merkezi Bilgi Sistemi</h4>
        </div>
        <div className="card bg-gradient justify-content-center shadow-lg p-5 border-dark rounded-end-5" style={{ width: '600px', height: "600px" }}>
          <h4 className="text-center mb-5 fw-bold ">Kullanıcı Girişi</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">Kullanıcı Adı</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">Şifre</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-check mb-3">
              <label className="form-check-label">
                <input className="form-check-input" type="checkbox" name="remember" /> Beni Hatırla
              </label>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className='d-flex justify-content-center align-items-center'>
              <button type="submit" className="btn btn-dark btn-outline-light w-50 mt-4 ">Giriş Yap</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;