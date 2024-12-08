import React, { useState, useEffect } from 'react';
import { getTeachers } from '../../services/api';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Öğrenci verilerini çekmek için API çağrısı
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers();
        setTeachers(response.data); // Gelen veriyi state'e atıyoruz
        setLoading(false);
      } catch (err) {
        setError('Öğretmenler getirilirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  // Öğrenci tablosu
  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header text-white text-center p-2">
          <h4>Öğretmen Listesi</h4>
        </div>
        <div className="card-body p-4">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Telefon Numarası</th>
                <th>Branşı</th>
                <th>Maaşı</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.username}</td>
                  <td>{teacher.fullname}</td>
                  <td>{teacher.phoneNo}</td>
                  <td>{teacher.branch}</td>
                  <td>{teacher.salary} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeachersList;

