import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Giriş Yap</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}

export default Login;


