import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher'); // Varsayılan değer teacher

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/add-user',
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert(response.data);
      setUsername('');
      setPassword('');
      setRole('teacher');
    } catch (error) {
      alert('Kullanıcı ekleme sırasında bir hata oluştu.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Kullanıcı Ekleme Formu */}
      <h2>Kullanıcı Ekle</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <button type="submit">Kullanıcı Ekle</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
