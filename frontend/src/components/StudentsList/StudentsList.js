import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudents } from '../../services/api';
import { IoSearch } from "react-icons/io5";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchStudentNo, setSearchStudentNo] = useState('');
  const studentsPerPage = 15;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents();
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Öğrenciler getirilirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  // Arama işlemleri
  const filteredStudents = students.filter((student) => {
    const matchesName = student.fullname.toLowerCase().includes(searchName.toLowerCase());
    const matchesStudentNo = student.studentNo.toLowerCase().includes(searchStudentNo.toLowerCase());
    return matchesName && matchesStudentNo; // Her iki arama kriteri aynı anda çalışır
  });

  // Sayfalama
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (window.confirm("Seçili öğrencileri silmek istediğinize emin misiniz?")) {
      try {
        const response = await deleteStudents(selectedStudents); // API çağrısını buradan yapıyoruz
        if (response.status === 200) {
          alert("Seçili öğrenciler silindi!");
          setStudents(students.filter((s) => !selectedStudents.includes(s.id)));
          setSelectedStudents([]);
        } else {
          alert("Silme işlemi başarısız oldu.");
        }
      } catch (error) {
        console.error("Silme sırasında hata oluştu:", error);
      }
    }
  };
  

  return (
    <div className="container mt-2">
      <div className="card shadow">
        <div className="card-header text-white text-center p-2">
          <h4>Öğrenci Listesi</h4>
        </div>
        <div className="card-body">
          {/* Arama Kutuları */}
          <div className="mb-3">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <IoSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="İsme göre arama yap"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <IoSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Okul numarasına göre arama yap"
                    value={searchStudentNo}
                    onChange={(e) => setSearchStudentNo(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedStudents.length === 0}
                >
                  Seçili Öğrencileri Sil
                </button>
              </div>
            </div>
          </div>


          {/* Tablo */}
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(students.map((student) => student.id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                    checked={selectedStudents.length === students.length}
                  />
                </th>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Telefon Numarası</th>
                <th>Okul Numarası</th>
                <th>Sınav Türü</th>
                <th>Sınıf</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td>{student.username}</td>
                  <td>{student.fullname}</td>
                  <td>{student.phoneNo}</td>
                  <td>{student.studentNo}</td>
                  <td>{student.class}</td>
                  <td>{student.exam}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sayfalama Kontrolleri */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;

