import React, { useState } from 'react';
import { addUser } from '../services/api';

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'teacher',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addUser(formData);
      alert(response.data);
      setFormData({ username: '', password: '', role: 'teacher' });
    } catch (error) {
      alert('Kullanıcı ekleme sırasında hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Kullanıcı Adı"
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Şifre"
        required
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
        <option value="parent">Parent</option>
      </select>
      <button type="submit">Ekle</button>
    </form>
  );
};

export default UserForm;
