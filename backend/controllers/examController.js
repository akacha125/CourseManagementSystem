const db = require('../db');

// Yeni sınav sonucu ekleme
const addExam = async (req, res) => {
    const {
        studentNo,
        examType,
        examDate,
        turkceNet,
        sosyalNet,
        matematikNet,
        fenNet,
        fizikNet,
        kimyaNet,
        biyolojiNet,
        edebiyatNet,
        tarihNet,
        cografyaNet,
        felsefeNet,
        dinNet,
        ingilizceNet,
        almancaNet,
        puan
    } = req.body;

    const query = `
        INSERT INTO exams (
            studentNo, examType, examDate, turkceNet, sosyalNet, 
            matematikNet, fenNet, fizikNet, kimyaNet, biyolojiNet,
            edebiyatNet, tarihNet, cografyaNet, felsefeNet, dinNet,
            ingilizceNet, almancaNet, puan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        studentNo,
        examType,
        examDate,
        turkceNet || 0,
        sosyalNet || 0,
        matematikNet || 0,
        fenNet || 0,
        fizikNet || 0,
        kimyaNet || 0,
        biyolojiNet || 0,
        edebiyatNet || 0,
        tarihNet || 0,
        cografyaNet || 0,
        felsefeNet || 0,
        dinNet || 0,
        ingilizceNet || 0,
        almancaNet || 0,
        puan || 0
    ];

    try {
        await db.execute(query, values);
        res.status(201).json({ message: 'Sınav sonucu başarıyla eklendi!' });
    } catch (err) {
        console.error('Sınav sonucu eklenirken hata oluştu:', err);
        res.status(500).json({ message: 'Sınav sonucu eklenirken bir hata oluştu.' });
    }
};

// Öğrenci numarasına göre öğrenci bilgilerini getirme
const getStudentInfo = async (req, res) => {
    const { studentNo } = req.params;

    const query = 'SELECT fullname, exam, class FROM users WHERE studentNo = ? AND role = "student"';
    
    try {
        const [result] = await db.execute(query, [studentNo]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Öğrenci bilgileri getirilirken hata oluştu:', err);
        res.status(500).json({ message: 'Öğrenci bilgileri getirilirken bir hata oluştu.' });
    }
};

// Tüm öğrenci numaralarını getirme
const getAllStudentNumbers = async (req, res) => {
    const query = 'SELECT studentNo, fullname FROM users WHERE role = "student" ORDER BY studentNo';
    
    try {
        const [result] = await db.execute(query);
        res.status(200).json(result);
    } catch (err) {
        console.error('Öğrenci numaraları getirilirken hata oluştu:', err);
        res.status(500).json({ message: 'Öğrenci numaraları getirilirken bir hata oluştu.' });
    }
};

module.exports = {
    addExam,
    getStudentInfo,
    getAllStudentNumbers
};
