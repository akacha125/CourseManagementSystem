import * as React from 'react';
import { Chart } from 'react-google-charts';
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa';
import {
    getStudentList,
    getTeachers,
    getExamDates,
    getLatestExamScores,
    getLatestExamDetails
} from '../../services/api';

const MainPanel = () => {
    const [stats, setStats] = React.useState({
        studentCount: 0,
        teacherCount: 0,
        examCount: 0,
        lastExamData: [],
        lastExamDetails: null
    });

    React.useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [students, teachers, examDates] = await Promise.all([
                getStudentList(),
                getTeachers(),
                getExamDates()
            ]);

            // Son sınav tarihini al
            const latestExamDate = examDates.data.length > 0
                ? examDates.data[0].examDate
                : null;

            // Son sınavın puanlarını çek
            const latestExamScores = latestExamDate
                ? await getLatestExamScores(latestExamDate)
                : { data: [] };

            // Son sınavın detaylarını çek
            const latestExamDetails = latestExamDate
                ? await getLatestExamDetails(latestExamDate)
                : null;

            // Grafik verilerini hazırla
            const examScores = latestExamScores.data.length > 0 ? [
                ['Öğrenci', 'Puan', { role: 'style' }],
                ...latestExamScores.data.map((exam, index) => [
                    `Öğrenci ${index + 1}`,
                    Number(exam.puan),
                    'color: #5A6B7D'
                ])
            ] : [
                ['Öğrenci', 'Puan', { role: 'style' }],
                ['Veri Yok', 0, 'color: #5A6B7D']
            ];

            setStats({
                studentCount: students.data.length,
                teacherCount: teachers.data.length,
                examCount: examDates.data.length,
                lastExamData: examScores,
                lastExamDetails: latestExamDetails ? latestExamDetails.data : null
            });
        } catch (error) {
            console.error('Dashboard verileri yüklenirken hata:', error);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="col-md-3 mb-4">
            <div className="card bg-gradient text-white h-100 border-4 border-dark shadow">
                <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="rounded-circle p-3 me-3" style={{ backgroundColor: color }}>
                        <Icon size={32} />
                    </div>
                    <div>
                        <strong className="card-title mb-0 display-5">{value}</strong>
                        <p className="card-text text-muted mb-0">{title}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4 text-white min-vh-100">
            {/* Ana İçerik Kartı */}
            <div className="card bg-dark text-white border-1 shadow">
                <h3 className="text-center mt-4">EGE-X Kurs Merkezi</h3>
                <div className="card-body">
                    {/* İstatistik Kartları */}
                    <div className="row justify-content-center mb-4 mt-2">
                        <StatCard
                            icon={FaUserGraduate}
                            title="Toplam Öğrenci"
                            value={stats.studentCount}
                            color="#4CAF50"
                        />
                        <StatCard
                            icon={FaChalkboardTeacher}
                            title="Toplam Öğretmen"
                            value={stats.teacherCount}
                            color="#2196F3"
                        />
                        <StatCard
                            icon={FaClipboardList}
                            title="Toplam Sınav"
                            value={stats.examCount}
                            color="#FF9800"
                        />
                    </div>

                    {/* Grafik ve Detaylar */}
                    <div className="d-flex justify-content-center">
                        <div className="col-10 border-5 shadow mb-5">
                            <h5 className="card-title p-2 text-center">Son Yapılan Sınav Bilgileri</h5>
                            {/* Sınav Detayları */}
                            {stats.lastExamDetails && (
                                <div className='ps-5'>
                                    <p className="mb-2">
                                        <strong>Sınav Türü:</strong> {stats.lastExamDetails.examType}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Sınava Giren Öğrenci Sayısı:</strong> {stats.lastExamDetails.totalStudents}
                                    </p>
                                </div>
                            )}

                            {/* Grafik */}
                            {stats.lastExamData.length > 0 ? (
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="ColumnChart"
                                    loader={<div>Grafik yükleniyor...</div>}
                                    data={stats.lastExamData}
                                    options={{
                                        title: 'Sınav Puanları Dağılımı',
                                        chartArea: { width: '80%' },
                                        backgroundColor: 'transparent',
                                        hAxis: {
                                            title: 'Öğrenciler',
                                            textStyle: { color: '#ffffff' },
                                            titleTextStyle: { color: '#ffffff' }
                                        },
                                        vAxis: {
                                            title: 'Puan',
                                            minValue: 0,
                                            maxValue: 500,
                                            textStyle: { color: '#ffffff' },
                                            titleTextStyle: { color: '#ffffff' }
                                        },
                                        bar: { groupWidth: '40%' },
                                        legend: { position: 'none' },
                                        titleTextStyle: { color: '#ffffff' }
                                    }}
                                />
                            ) : (
                                <p className="text-center text-muted">Henüz grafik için veri bulunmamaktadır.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPanel;
