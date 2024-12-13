import * as React from 'react';
import { Chart } from 'react-google-charts';
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa';
import { getStudentList, getTeachers } from '../../services/api';

const MainPanel = () => {
    const [stats, setStats] = React.useState({
        studentCount: 0,
        teacherCount: 0,
        examCount: 0,
        lastExamData: []
    });

    React.useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [students, teachers] = await Promise.all([
                getStudentList(),
                getTeachers()
            ]);

            const sampleExamData = [
                ['Ders', 'Net'],
                ['Türkçe', 25],
                ['Matematik', 20],
                ['Fen', 15],
                ['Sosyal', 18]
            ];

            setStats({
                studentCount: students.data.length,
                teacherCount: teachers.data.length,
                examCount: 150,
                lastExamData: sampleExamData
            });
        } catch (error) {
            console.error('Dashboard verileri yüklenirken hata:', error);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="col-md-4 mb-4">
            <div className="card bg-dark text-white h-100 border-0 shadow">
                <div className="card-body d-flex align-items-center">
                    <div className="rounded-circle p-3 me-3" style={{ backgroundColor: color }}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="card-title mb-0 display-6">{value}</h3>
                        <p className="card-text text-muted mb-0">{title}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-4 text-white min-vh-100">
            <div className="row mb-4">
                <div className="col">
                    <h2 className="display-6 mb-4">Dashboard</h2>
                </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="row mb-4">
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

            {/* Grafik */}
            <div className="row">
                <div className="col-12">
                    <div className="card bg-dark text-white border-0 shadow">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Son Sınav Sonuçları</h3>
                            {stats.lastExamData.length > 0 ? (
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="ColumnChart"
                                    loader={
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Yükleniyor...</span>
                                            </div>
                                        </div>
                                    }
                                    data={stats.lastExamData}
                                    options={{
                                        backgroundColor: '#212529',
                                        chartArea: {
                                            backgroundColor: '#212529'
                                        },
                                        colors: ['#4CAF50'],
                                        animation: {
                                            startup: true,
                                            easing: 'out',
                                            duration: 1000,
                                        },
                                        vAxis: {
                                            title: 'Net Sayısı',
                                            minValue: 0,
                                            textStyle: { color: '#fff' },
                                            titleTextStyle: { color: '#fff' },
                                            gridlines: { color: '#444' }
                                        },
                                        hAxis: {
                                            title: 'Dersler',
                                            textStyle: { color: '#fff' },
                                            titleTextStyle: { color: '#fff' }
                                        },
                                        legend: { position: 'none' },
                                        bar: { groupWidth: '70%' },
                                        backgroundColor: {
                                            fill: '#212529',
                                        },
                                    }}
                                />
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <p className="mb-0">Henüz sınav verisi bulunmamaktadır.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPanel;
