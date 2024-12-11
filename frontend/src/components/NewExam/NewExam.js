import React, { useState, useEffect } from 'react';
import { addExam, getStudentList } from '../../services/api';
import { IoSearch } from "react-icons/io5";

const NewExam = () => {
    const [studentList, setStudentList] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    // Öğrenci listesini getir
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getStudentList();
                console.log('API Response:', response.data); // Debug için log
                setStudentList(response.data);
                setFilteredStudents(response.data);
            } catch (error) {
                console.error('Öğrenci listesi alınırken hata:', error);
            }
        };
        fetchStudents();
    }, []);

    // Arama terimi değiştiğinde filtreleme yap
    useEffect(() => {
        if (searchTerm === '') {
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

    // Öğrenci seçildiğinde
    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setExamData(prev => ({ ...prev, studentNo: student.studentNo }));
    };

    // Sınav tipine göre gösterilecek net alanları
    const getNetFields = () => {
        switch (examData.examType) {
            case 'TYT':
                return ['turkceNet', 'sosyalNet', 'matematikNet', 'fizikNet', 'kimyaNet', 'biyolojiNet'];
            case 'AYT(MF)':
                return ['matematikNet', 'fizikNet', 'kimyaNet', 'biyolojiNet'];
            case 'AYT(EA)':
                return ['matematikNet', 'edebiyatNet', 'tarihNet', 'cografyaNet'];
            case 'AYT(Sözel)':
                return ['sosyalNet', 'tarihNet', 'cografyaNet', 'felsefeNet', 'dinNet'];
            case 'YDT(İngilizce)':
                return ['ingilizceNet'];
            case 'YDT(Almanca)':
                return ['almancaNet'];
            case 'LGS':
                return ['turkceNet', 'matematikNet', 'fenNet', 'sosyalNet', 'dinNet', 'ingilizceNet'];
            default:
                return [];
        }
    };

    // Net değeri değiştiğinde
    const handleNetChange = (field, value) => {
        setExamData(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    // Puanı hesapla
    const calculateScore = () => {
        // Burada hesaplama.net gibi sitelerden API kullanılabilir
        // Şimdilik basit bir hesaplama yapıyoruz
        let totalNet = 0;
        getNetFields().forEach(field => {
            totalNet += examData[field];
        });

        // Basit bir puan hesaplama formülü (gerçek formül entegre edilmeli)
        const calculatedScore = totalNet * 4;
        setExamData(prev => ({ ...prev, puan: calculatedScore }));
    };

    // Formu gönder
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addExam(examData);
            alert('Sınav sonucu başarıyla eklendi!');
            // Formu sıfırla
            setSelectedStudent(null);
            setExamData({
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
        } catch (error) {
            alert('Sınav sonucu eklenirken bir hata oluştu!');
            console.error(error);
        }
    };

    // Net alanı bileşeni
    const NetInput = ({ field, label }) => (
        <div className="col-md-4 mb-3">
            <label htmlFor={field} className="form-label">{label}</label>
            <input
                type="number"
                step="0.25"
                min="0"
                max="40"
                className="form-control"
                id={field}
                value={examData[field]}
                onChange={(e) => handleNetChange(field, e.target.value)}
            />
        </div>
    );

    return (
        <div className="container mt-2">
            <h2 className="text-center mb-3">Sınav Sonucu Ekleme</h2>
            <div className='row justify-content-center'>
                <div className="card shadow col-md-8">
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
                                            onChange={(e) => setExamData(prev => ({ ...prev, examType: e.target.value }))}
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

                                {/* Net Bilgileri */}
                                {examData.examType && (
                                    <div className="row mb-4">
                                        {getNetFields().map(field => {
                                            const labels = {
                                                turkceNet: 'Türkçe Net',
                                                sosyalNet: 'Sosyal Net',
                                                matematikNet: 'Matematik Net',
                                                fenNet: 'Fen Net',
                                                fizikNet: 'Fizik Net',
                                                kimyaNet: 'Kimya Net',
                                                biyolojiNet: 'Biyoloji Net',
                                                edebiyatNet: 'Edebiyat Net',
                                                tarihNet: 'Tarih Net',
                                                cografyaNet: 'Coğrafya Net',
                                                felsefeNet: 'Felsefe Net',
                                                dinNet: 'Din Net',
                                                ingilizceNet: 'İngilizce Net',
                                                almancaNet: 'Almanca Net'
                                            };
                                            return <NetInput key={field} field={field} label={labels[field]} />;
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