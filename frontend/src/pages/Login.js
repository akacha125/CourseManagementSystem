import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkMode from "../components/DarkMode";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Formun yeniden yüklenmesini engeller

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Token'ı kaydediyoruz

        // Kullanıcıyı role göre yönlendir
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        if (decodedToken.role === 'admin') {
          navigate('/admin');
        } else if (decodedToken.role === 'teacher') {
          navigate('/teacher');
        } else if (decodedToken.role === 'student') {
          navigate('/student');
        } else if (decodedToken.role === 'parent') {
          navigate('/parent');
        }
      } else {
        const errorMessage = await response.text();
        setError(errorMessage); // Hataları göster
      }
    } catch (err) {
      console.error('Giriş işlemi sırasında bir hata oluştu:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <DarkMode/>
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Giriş Yap</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleLogin}>
          {/* Kullanıcı Adı */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {/* Şifre */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Giriş Butonu */}
          <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
