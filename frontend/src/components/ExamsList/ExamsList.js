import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Table } from 'react-bootstrap';

const ExamsList = () => {
    const [examDates, setExamDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [exams, setExams] = useState([]);

    useEffect(() => {
        // Sınav tarihlerini getir
        const fetchExamDates = async () => {
            try {
                console.log('Fetching exam dates...');
                const response = await axios.get('http://localhost:8080/api/dates');
                console.log('Received exam dates:', response.data);
                
                if (response.data && response.data.length > 0) {
                    setExamDates(response.data);
                    const firstDate = response.data[0].examDate.split('T')[0];
                    console.log('Setting first date:', firstDate);
                    setSelectedDate(firstDate);
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
        // Seçili tarihe göre sınavları getir
        const fetchExams = async () => {
            if (selectedDate) {
                try {
                    console.log('Fetching exams for date:', selectedDate);
                    const response = await axios.get(`http://localhost:8080/api/by-date/${selectedDate}`);
                    console.log('Received exams:', response.data);
                    setExams(response.data);
                } catch (error) {
                    console.error('Error fetching exams:', error.response || error);
                    setExams([]);
                }
            }
        };
        fetchExams();
    }, [selectedDate]);

    const calculateNet = (correct, incorrect) => {
        const net = correct - (incorrect / 4);
        return Math.max(0, net).toFixed(2);
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Sınav Sonuçları</h2>
            
            <Form.Group className="mb-4">
                <Form.Label>Sınav Tarihi Seçin</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    {examDates.map((date) => (
                        <option key={date.examDate} value={date.examDate.split('T')[0]}>
                            {new Date(date.examDate).toLocaleDateString('tr-TR')}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Öğrenci No</th>
                        <th>Ad Soyad</th>
                        <th>Sınıf</th>
                        <th>Sınav Türü</th>
                        <th>Türkçe Net</th>
                        <th>Matematik Net</th>
                        <th>Sosyal Net</th>
                        <th>Fen Net</th>
                        <th>Puan</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam) => (
                        <tr key={exam.id}>
                            <td>{exam.studentNo}</td>
                            <td>{`${exam.studentName} ${exam.studentSurname}`}</td>
                            <td>{exam.studentClass}</td>
                            <td>{exam.examType}</td>
                            <td>{calculateNet(exam.turkceCorrect, exam.turkceIncorrect)}</td>
                            <td>{calculateNet(exam.matematikCorrect, exam.matematikIncorrect)}</td>
                            <td>{calculateNet(exam.sosyalCorrect, exam.sosyalIncorrect)}</td>
                            <td>{calculateNet(exam.fenCorrect, exam.fenIncorrect)}</td>
                            <td>{exam.totalScore?.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ExamsList;