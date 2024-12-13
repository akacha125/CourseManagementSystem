import React, { useState, useEffect } from 'react';
import { addExam, getStudentList } from '../../services/api';
import { IoSearch } from "react-icons/io5";

const NewExam = () => {
    const [studentList, setStudentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [examData, setExamData] = useState({
        studentNo: '',
        examType: '',
        examDate: '',
        turkceNet: 0,
        sosyalNet: 0,
        matematikNet: 0,
        fenNet: 0,
        fizikNet: 0,
        kimyaNet: 0,
        biyolojiNet: 0,
        edebiyatNet: 0,
        tarihNet: 0,
        cografyaNet: 0,
        felsefeNet: 0,
        dinNet: 0,
        ingilizceNet: 0,
        almancaNet: 0,
        puan: 0
    });

    // Doğru-Yanlış sayıları için state
    const [answers, setAnswers] = useState({
        turkce: { dogru: 0, yanlis: 0 },
        sosyal: { dogru: 0, yanlis: 0 },
        matematik: { dogru: 0, yanlis: 0 },
        fen: { dogru: 0, yanlis: 0 },
        fizik: { dogru: 0, yanlis: 0 },
        kimya: { dogru: 0, yanlis: 0 },
        biyoloji: { dogru: 0, yanlis: 0 },
        edebiyat: { dogru: 0, yanlis: 0 },
        tarih: { dogru: 0, yanlis: 0 },
        cografya: { dogru: 0, yanlis: 0 },
        felsefe: { dogru: 0, yanlis: 0 },
        din: { dogru: 0, yanlis: 0 },
        ingilizce: { dogru: 0, yanlis: 0 },
        almanca: { dogru: 0, yanlis: 0 }
    });

    useEffect(() => {
        loadStudentList();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredStudents([]);
            return;
        }
        const filtered = studentList.filter(student => {
            const studentNoStr = student.studentNo ? student.studentNo.toString() : '';
            const fullnameStr = student.fullname ? student.fullname.toString().toLowerCase() : '';
            const searchTermLower = searchTerm.toLowerCase();

            return studentNoStr.includes(searchTermLower) ||
                fullnameStr.includes(searchTermLower);
        });

        setFilteredStudents(filtered);
    }, [searchTerm, studentList]);

    const loadStudentList = async () => {
        try {
            const response = await getStudentList();
            setStudentList(response.data);
        } catch (error) {
            console.error('Öğrenci listesi yüklenirken hata:', error);
        }
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setExamData(prev => ({ ...prev, studentNo: student.studentNo }));
    };

    // Net hesaplama fonksiyonu
    const calculateNet = (dogru, yanlis) => {
        return Math.max(0, dogru - (yanlis / 4));
    };

    // Sınav tipine göre puan hesaplama
    const calculateScore = () => {
        let totalScore = 0;
        const nets = {};

        // Önce tüm netleri hesapla
        Object.keys(answers).forEach(ders => {
            const net = calculateNet(answers[ders].dogru, answers[ders].yanlis);
            nets[ders + 'Net'] = net;
        });

        // Sınav tipine göre puan hesapla
        switch (examData.examType) {
            case 'TYT':
                totalScore = (nets.turkceNet * 4) +
                    (nets.sosyalNet * 2) +
                    (nets.matematikNet * 4) +
                    (nets.fizikNet * 2) +
                    (nets.kimyaNet * 2) +
                    (nets.biyolojiNet * 2) +
                    100;
                break;

            case 'AYT(MF)':
            case 'AYT(EA)':
            case 'AYT(Sözel)':
            case 'YDT(İngilizce)':
            case 'YDT(Almanca)':
                const totalNet = Object.values(nets).reduce((sum, net) => sum + net, 0);
                totalScore = (totalNet * 5) + 100;
                break;

            case 'LGS':
                totalScore = (nets.turkceNet * 5) +
                    (nets.matematikNet * 5) +
                    ((nets.fenNet + nets.sosyalNet + nets.dinNet + nets.ingilizceNet) * 4) +
                    100;
                break;
        }

        // Netleri ve puanı state'e kaydet
        setExamData(prev => ({
            ...prev,
            ...nets,
            puan: Math.round(totalScore * 100) / 100
        }));
    };

    // Doğru-Yanlış Input Bileşeni
    const AnswerInput = ({ field, label }) => {
        const handleChange = (type, value) => {
            // Değeri string olarak al ve sayıya çevir
            const numValue = value === '' ? 0 : parseInt(value);
            if (!isNaN(numValue)) {
                setAnswers(prev => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [type]: numValue
                    }
                }));
            }
        };

        // Net hesaplama
        const net = calculateNet(answers[field].dogru, answers[field].yanlis);

        return (
            <div className="col-md-4 mb-3">
                <label className="form-label">{label}</label>
                <div className="input-group">
                    <span className="input-group-text" style={{ minWidth: '35px' }}>D:</span>
                    <input
                        type="text"
                        className="form-control text-center"
                        placeholder="0"
                        value={answers[field].dogru || ''}
                        onChange={(e) => handleChange('dogru', e.target.value)}
                        style={{ maxWidth: '70px' }}
                    />
                    <span className="input-group-text" style={{ minWidth: '35px' }}>Y:</span>
                    <input
                        type="text"
                        className="form-control text-center"
                        placeholder="0"
                        value={answers[field].yanlis || ''}
                        onChange={(e) => handleChange('yanlis', e.target.value)}
                        style={{ maxWidth: '70px' }}
                    />
                    <span className="input-group-text bg-gradient" style={{ minWidth: '80px' }}>
                        Net: {net.toFixed(2)}
                    </span>
                </div>
            </div>
        );
    };

    // Sınav tipine göre gösterilecek alanlar
    const getAnswerFields = () => {
        switch (examData.examType) {
            case 'TYT':
                return ['turkce', 'sosyal', 'matematik', 'fizik', 'kimya', 'biyoloji'];
            case 'AYT(MF)':
                return ['matematik', 'fizik', 'kimya', 'biyoloji'];
            case 'AYT(EA)':
                return ['matematik', 'edebiyat', 'tarih', 'cografya'];
            case 'AYT(Sözel)':
                return ['edebiyat', 'tarih', 'cografya', 'felsefe', 'din'];
            case 'YDT(İngilizce)':
                return ['ingilizce'];
            case 'YDT(Almanca)':
                return ['almanca'];
            case 'LGS':
                return ['turkce', 'matematik', 'fen', 'sosyal', 'din', 'ingilizce'];
            default:
                return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addExam(examData);
            alert('Sınav sonucu başarıyla kaydedildi!');
            // Formu sıfırla
            setExamData({
                studentNo: selectedStudent?.studentNo || '',
                examType: '',
                examDate: '',
                turkceNet: 0,
                sosyalNet: 0,
                matematikNet: 0,
                fenNet: 0,
                fizikNet: 0,
                kimyaNet: 0,
                biyolojiNet: 0,
                edebiyatNet: 0,
                tarihNet: 0,
                cografyaNet: 0,
                felsefeNet: 0,
                dinNet: 0,
                ingilizceNet: 0,
                almancaNet: 0,
                puan: 0
            });
            setAnswers(Object.fromEntries(
                Object.keys(answers).map(key => [key, { dogru: 0, yanlis: 0 }])
            ));
        } catch (error) {
            console.error('Sınav sonucu kaydedilirken hata:', error);
            alert('Sınav sonucu eklenirken bir hata oluştu.');
        }
    };

    return (
        <div className="container mt-2">
            <h2 className="text-center mb-3">Sınav Sonucu Ekleme</h2>
            <div className='row justify-content-center'>
                <div className="card shadow col-md-10">
                    <div className="card-body">
                        {/* Öğrenci Arama */}
                        <div className="mb-1">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <IoSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Öğrenci no veya isim ile ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {/* Öğrenci Listesi */}
                            {searchTerm && (
                                <div className="mt-2 border rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(student => (
                                            <div
                                                key={student.id}
                                                className="p-2 border-bottom hover-bg-light"
                                                onClick={() => handleStudentSelect(student)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {student.studentNo} - {student.fullname} ({student.class || 'Sınıf bilgisi yok'})
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-center text-muted">
                                            Öğrenci bulunamadı
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedStudent && (
                            <form onSubmit={handleSubmit}>
                                {/* Öğrenci Bilgileri */}
                                <div className="row ms-1 me-1 mb-4 mt-3 p-2 bg-gradient">
                                    <div className="col-md-6">
                                        <strong>Ad Soyad:</strong> {selectedStudent.fullname}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Sınıf:</strong> {selectedStudent.class}
                                    </div>
                                </div>

                                {/* Sınav Bilgileri */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label">Sınav Tipi</label>
                                        <select
                                            className="form-select"
                                            value={examData.examType}
                                            onChange={(e) => {
                                                setExamData(prev => ({ ...prev, examType: e.target.value }));
                                                // Sınav tipi değiştiğinde cevapları sıfırla
                                                setAnswers(Object.fromEntries(
                                                    Object.keys(answers).map(key => [key, { dogru: 0, yanlis: 0 }])
                                                ));
                                            }}
                                            required
                                        >
                                            <option value="">Sınav Tipi Seçin</option>
                                            <option value="TYT">TYT</option>
                                            <option value="AYT(MF)">AYT (MF)</option>
                                            <option value="AYT(EA)">AYT (EA)</option>
                                            <option value="AYT(Sözel)">AYT (Sözel)</option>
                                            <option value="YDT(İngilizce)">YDT (İngilizce)</option>
                                            <option value="YDT(Almanca)">YDT (Almanca)</option>
                                            <option value="LGS">LGS</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Sınav Tarihi</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={examData.examDate}
                                            onChange={(e) => setExamData(prev => ({ ...prev, examDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Doğru-Yanlış Bilgileri */}
                                {examData.examType && (
                                    <div className="row mb-4">
                                        {getAnswerFields().map(field => {
                                            const labels = {
                                                turkce: 'Türkçe',
                                                sosyal: 'Sosyal',
                                                matematik: 'Matematik',
                                                fen: 'Fen',
                                                fizik: 'Fizik',
                                                kimya: 'Kimya',
                                                biyoloji: 'Biyoloji',
                                                edebiyat: 'Edebiyat',
                                                tarih: 'Tarih',
                                                cografya: 'Coğrafya',
                                                felsefe: 'Felsefe',
                                                din: 'Din',
                                                ingilizce: 'İngilizce',
                                                almanca: 'Almanca'
                                            };
                                            return <AnswerInput key={field} field={field} label={labels[field]} />;
                                        })}
                                    </div>
                                )}

                                {/* Puan Hesaplama */}
                                {examData.examType && (
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={calculateScore}
                                            >
                                                Puanı Hesapla
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control d-inline-block w-auto"
                                                value={examData.puan}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Kaydet Butonu */}
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Sınav Sonucunu Kaydet
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewExam;