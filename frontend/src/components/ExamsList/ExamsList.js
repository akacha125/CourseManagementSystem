import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Table, Button } from 'react-bootstrap';

const ExamsList = () => {
    const [examDates, setExamDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [examTypes, setExamTypes] = useState([]);
    const [selectedExamType, setSelectedExamType] = useState('');
    const [exams, setExams] = useState([]);
    const [selectedExams, setSelectedExams] = useState([]);

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

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Sınav Sonuçları</h2>
            
            <Form.Group className="mb-2">
                <Form.Label>Sınav Tarihi Seçin</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    {examDates.map((date) => (
                        <option key={date.examDate} value={date.formattedDate}>
                            {new Date(date.examDate).toLocaleDateString('tr-TR')}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            {examTypes.length > 0 && (
                <Form.Group className="mb-4">
                    <Form.Label>Sınav Türü Seçin</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedExamType}
                        onChange={handleExamTypeChange}
                    >
                        {examTypes.map((type) => (
                            <option key={type.examType} value={type.examType}>
                                {type.examType}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            )}

            {selectedExams.length > 0 && (
                <div className="mb-3">
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteSelected}
                        className="mt-2"
                    >
                        Seçili Sınav Sonuçlarını Sil ({selectedExams.length})
                    </Button>
                </div>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedExams(exams.map(exam => exam.id));
                                    } else {
                                        setSelectedExams([]);
                                    }
                                }}
                                checked={selectedExams.length === exams.length && exams.length > 0}
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
                    {exams.map((exam) => (
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
            </Table>
        </Container>
    );
};

export default ExamsList;