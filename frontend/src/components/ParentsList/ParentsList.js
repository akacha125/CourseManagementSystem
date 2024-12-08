import React, { useState, useEffect } from 'react';
import { getParents } from '../../services/api';

const ParentsList = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Öğrenci verilerini çekmek için API çağrısı
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await getParents();
        setParents(response.data); // Gelen veriyi state'e atıyoruz
        setLoading(false);
      } catch (err) {
        setError('Öğretmenler getirilirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchParents();
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
          <h4>Veli Listesi</h4>
        </div>
        <div className="card-body p-4">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Telefon Numarası</th>
                <th>Adresi</th>
                <th>Öğrenci İsmi</th>
                <th>Öğrenci Okul Numarası</th>
                <th>Öğrenci Yıllık Ücreti</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent) => (
                <tr key={parent.id}>
                  <td>{parent.username}</td>
                  <td>{parent.fullname}</td>
                  <td>{parent.phoneNo}</td>
                  <td>{parent.address}</td>
                  <td>{parent.childFullname}</td>
                  <td>{parent.childSchoolNo}</td>
                  <td>{parent.childYearlyFee} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentsList;

