import React, { useState } from 'react';
import { addCourse } from '../services/api';

const CourseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addCourse(formData);
      alert(response.data);
      setFormData({ name: '', description: '' });
    } catch (error) {
      alert('Ders ekleme sırasında bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ders Adı"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Ders Açıklaması"
        required
      />
      <button type="submit">Ders Ekle</button>
    </form>
  );
};

export default CourseForm;
