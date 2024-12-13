import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Table, Button, Pagination } from 'react-bootstrap';

const ExamsList = () => {
    const [examDates, setExamDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [examTypes, setExamTypes] = useState([]);
    const [selectedExamType, setSelectedExamType] = useState('');
    const [exams, setExams] = useState([]);
    const [selectedExams, setSelectedExams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        // Sınav tarihlerini getir
        const fetchExamDates = async () => {
            try {
                console.log('Fetching exam dates...');
                const response = await axios.get('http://localhost:8080/api/dates');
                console.log('Received exam dates:', response.data);
                
                if (response.data && response.data.length > 0) {
                    const formattedDates = response.data.map(date => ({
                        ...date,
                        formattedDate: new Date(date.examDate).toISOString().split('T')[0]
                    }));
                    
                    setExamDates(formattedDates);
                    setSelectedDate(formattedDates[0].formattedDate);
                    console.log('Formatted dates:', formattedDates);
                } else {
                    console.log('No exam dates received');
                    setExamDates([]);
                }
            } catch (error) {
                console.error('Error details:', error.response || error);
                setExamDates([]);
            }
        };
        fetchExamDates();
    }, []);

    useEffect(() => {
        // Seçili tarihe göre sınav türlerini getir
        const fetchExamTypes = async () => {
            if (selectedDate) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/exam-types/${selectedDate}`);
                    console.log('Received exam types:', response.data);
                    setExamTypes(response.data);
                    if (response.data.length > 0) {
                        setSelectedExamType(response.data[0].examType);
                    } else {
                        setSelectedExamType('');
                    }
                } catch (error) {
                    console.error('Error fetching exam types:', error);
                    setExamTypes([]);
                    setSelectedExamType('');
                }
            }
        };
        fetchExamTypes();
    }, [selectedDate]);

    useEffect(() => {
        // Seçili tarihe ve sınav türüne göre sınavları getir
        const fetchExams = async () => {
            if (selectedDate && selectedExamType) {
                try {
                    console.log('Fetching exams for date:', selectedDate, 'and type:', selectedExamType);
                    const response = await axios.get(`http://localhost:8080/api/by-date/${selectedDate}/${selectedExamType}`);
                    console.log('Received exams:', response.data);
                    setExams(response.data);
                } catch (error) {
                    console.error('Error fetching exams:', error);
                    setExams([]);
                }
            }
        };
        fetchExams();
    }, [selectedDate, selectedExamType]);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        console.log('Selected new date:', newDate);
        setSelectedDate(newDate);
    };

    const handleExamTypeChange = (e) => {
        const newType = e.target.value;
        console.log('Selected new exam type:', newType);
        setSelectedExamType(newType);
    };

    const handleCheckboxChange = (examId) => {
        setSelectedExams(prev => {
            if (prev.includes(examId)) {
                return prev.filter(id => id !== examId);
            } else {
                return [...prev, examId];
            }
        });
    };

    const handleDeleteSelected = async () => {
        if (selectedExams.length === 0) {
            alert('Lütfen silinecek sınav sonuçlarını seçin');
            return;
        }

        if (window.confirm('Seçili sınav sonuçlarını silmek istediğinize emin misiniz?')) {
            try {
                const response = await axios.delete('http://localhost:8080/api/exams', {
                    data: selectedExams
                });
                alert(response.data.message);
                // Tabloyu güncelle
                if (selectedDate && selectedExamType) {
                    const updatedExams = await axios.get(`http://localhost:8080/api/by-date/${selectedDate}/${selectedExamType}`);
                    setExams(updatedExams.data);
                }
                setSelectedExams([]); // Seçimleri sıfırla
            } catch (error) {
                alert('Sınav sonuçları silinirken bir hata oluştu.');
            }
        }
    };

    // Sınav türüne göre tablo başlıklarını belirle
    const getTableHeaders = () => {
        switch (selectedExamType) {
            case 'TYT':
                return [
                    { key: 'turkceNet', label: 'Türkçe Net' },
                    { key: 'sosyalNet', label: 'Sosyal Net' },
                    { key: 'matematikNet', label: 'Matematik Net' },
                    { key: 'fizikNet', label: 'Fizik Net' },
                    { key: 'kimyaNet', label: 'Kimya Net' },
                    { key: 'biyolojiNet', label: 'Biyoloji Net' }
                ];
            case 'AYT(MF)':
                return [
                    { key: 'matematikNet', label: 'Matematik Net' },
                    { key: 'fizikNet', label: 'Fizik Net' },
                    { key: 'kimyaNet', label: 'Kimya Net' },
                    { key: 'biyolojiNet', label: 'Biyoloji Net' }
                ];
            case 'AYT(EA)':
                return [
                    { key: 'matematikNet', label: 'Matematik Net' },
                    { key: 'edebiyatNet', label: 'Edebiyat Net' },
                    { key: 'tarihNet', label: 'Tarih Net' },
                    { key: 'cografyaNet', label: 'Coğrafya Net' }
                ];
            case 'AYT(Sözel)':
                return [
                    { key: 'edebiyatNet', label: 'Edebiyat Net' },
                    { key: 'tarihNet', label: 'Tarih Net' },
                    { key: 'cografyaNet', label: 'Coğrafya Net' },
                    { key: 'felsefeNet', label: 'Felsefe Net' },
                    { key: 'dinNet', label: 'Din Net' }
                ];
            case 'YDT(İngilizce)':
                return [
                    { key: 'ingilizceNet', label: 'İngilizce Net' }
                ];
            case 'YDT(Almanca)':
                return [
                    { key: 'almancaNet', label: 'Almanca Net' }
                ];
            case 'LGS':
                return [
                    { key: 'turkceNet', label: 'Türkçe Net' },
                    { key: 'matematikNet', label: 'Matematik Net' },
                    { key: 'fenNet', label: 'Fen Net' },
                    { key: 'sosyalNet', label: 'Sosyal Net' },
                    { key: 'dinNet', label: 'Din Net' },
                    { key: 'ingilizceNet', label: 'İngilizce Net' }
                ];
            default:
                return [];
        }
    };

    // Sayfalama için gerekli hesaplamalar
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExams = exams.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(exams.length / itemsPerPage);

    // Sayfa değiştirme fonksiyonu
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination komponentini oluştur
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <div className="d-flex justify-content-center mt-3">
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {items}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        );
    };

    return (
        <div className="container mt-2">
            <div className="card shadow">
                <div className="card-header text-white text-center p-2">
                    <h4>Sınav Sonuçları</h4>
                </div>
                <div className="card-body ps-4 pe-4">
                    {/* Tarih ve Sınav Türü Seçimi */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Sınav Tarihi</Form.Label>
                                <Form.Select
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                >
                                    {examDates.map((date) => (
                                        <option key={date.examDate} value={date.formattedDate}>
                                            {new Date(date.examDate).toLocaleDateString('tr-TR')}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            {examTypes.length > 0 && (
                                <Form.Group>
                                    <Form.Label>Sınav Türü</Form.Label>
                                    <Form.Select
                                        value={selectedExamType}
                                        onChange={handleExamTypeChange}
                                    >
                                        {examTypes.map((type) => (
                                            <option key={type.examType} value={type.examType}>
                                                {type.examType}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}
                        </div>

                        <div className="col-md-4 d-flex justify-content-end align-items-end">
                            {selectedExams.length > 0 && (
                                <Button 
                                    variant="danger" 
                                    onClick={handleDeleteSelected}
                                    className="mb-2"
                                >
                                    Seçili Sonuçları Sil ({selectedExams.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tablo */}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedExams(currentExams.map(exam => exam.id));
                                                } else {
                                                    setSelectedExams([]);
                                                }
                                            }}
                                            checked={selectedExams.length === currentExams.length && currentExams.length > 0}
                                        />
                                    </th>
                                    <th>Sıralama</th>
                                    <th>Öğrenci No</th>
                                    <th>Ad Soyad</th>
                                    <th>Sınıf</th>
                                    {getTableHeaders().map(header => (
                                        <th key={header.key}>{header.label}</th>
                                    ))}
                                    <th>Puan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentExams.map((exam) => (
                                    <tr key={exam.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedExams.includes(exam.id)}
                                                onChange={() => handleCheckboxChange(exam.id)}
                                            />
                                        </td>
                                        <td>{exam.ranking}</td>
                                        <td>{exam.studentNo}</td>
                                        <td>{exam.fullname}</td>
                                        <td>{exam.class}</td>
                                        {getTableHeaders().map(header => (
                                            <td key={header.key}>{exam[header.key]}</td>
                                        ))}
                                        <td className="fw-bold">{exam.puan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={i + 1 === currentPage}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        </div>
                    )}

                    {exams.length === 0 && selectedExamType && (
                        <div className="alert alert-info mt-3">
                            Seçilen tarih ve sınav türü için sonuç bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamsList;