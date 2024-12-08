import React, { useState, useEffect } from 'react';
import { getStudents } from '../../services/api';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Öğrenci verilerini çekmek için API çağrısı
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents();
        setStudents(response.data); // Gelen veriyi state'e atıyoruz
        setLoading(false);
      } catch (err) {
        setError('Öğrenciler getirilirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchStudents();
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
          <h4>Öğrenci Listesi</h4>
        </div>
        <div className="card-body p-4">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Telefon Numarası</th>
                <th>Sınıf</th>
                <th>Okul Numarası</th>
                <th>Yıllık Ücret</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.username}</td>
                  <td>{student.fullname}</td>
                  <td>{student.phoneNo}</td>
                  <td>{student.class}</td>
                  <td>{student.studentNo}</td>
                  <td>{student.yearlyFee} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
