import React, { useState, useEffect } from 'react';
import { getTeachers, deleteTeachers } from '../../services/api';
import { IoSearch } from "react-icons/io5";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const teachersPerPage = 15;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers();
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Öğretmenler getirilirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchTeachers();
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
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesName = teacher.fullname.toLowerCase().includes(searchName.toLowerCase());
    const matchesBranch = teacher.branch.toLowerCase().includes(searchBranch.toLowerCase());
    return matchesName && matchesBranch;
  });

  // Sayfalama
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectTeacher = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (window.confirm("Seçili öğretmenleri silmek istediğinize emin misiniz?")) {
      try {
        const response = await deleteTeachers(selectedTeachers);
        if (response.status === 200) {
          alert("Seçili öğretmenler silindi!");
          setTeachers(teachers.filter((t) => !selectedTeachers.includes(t.id)));
          setSelectedTeachers([]);
        } else {
          alert("Silme işlemi başarısız oldu.");
        }
      } catch (error) {
        console.error("Silme sırasında hata oluştu:", error);
        alert("Silme işlemi sırasında bir hata oluştu.");
      }
    }
  };

  return (
    <div className="container mt-2">
      <div className="card shadow">
        <div className="card-header text-white text-center p-2">
          <h4>Öğretmen Listesi</h4>
        </div>
        <div className="card-body ps-4 pe-4">
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
                    placeholder="İsme göre ara..."
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
                    placeholder="Branşa göre ara..."
                    value={searchBranch}
                    onChange={(e) => setSearchBranch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedTeachers.length === 0}
                >
                  Seçili Öğretmenleri Sil
                </button>
              </div>
            </div>
          </div>

          {/* Öğretmen Tablosu */}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeachers(teachers.map((teacher) => teacher.id));
                        } else {
                          setSelectedTeachers([]);
                        }
                      }}
                      checked={selectedTeachers.length === teachers.length}
                    />
                  </th>
                  <th>Kullanıcı Adı</th>
                  <th>Ad Soyad</th>
                  <th>Telefon Numarası</th>
                  <th>Branşı</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.id)}
                        onChange={() => handleSelectTeacher(teacher.id)}
                      />
                    </td>
                    <td>{teacher.username}</td>
                    <td>{teacher.fullname}</td>
                    <td>{teacher.phoneNo}</td>
                    <td>{teacher.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''
                      }`}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersList;
