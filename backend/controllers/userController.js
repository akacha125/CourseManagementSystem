const bcrypt = require('bcryptjs');
const db = require('../db');

// Yeni kullanıcı ekleme
const addUser = async (req, res) => {
    const { username, password, fullname, phoneNo, role, studentNo } = req.body;

    try {
        // Şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let query, params;

        if (role === 'student') {
            query = `
                INSERT INTO users (username, password, fullname, phone_no, role, student_no)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, username, fullname, role
            `;
            params = [username, hashedPassword, fullname, phoneNo, role, studentNo];
        } else {
            query = `
                INSERT INTO users (username, password, fullname, phone_no, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, username, fullname, role
            `;
            params = [username, hashedPassword, fullname, phoneNo, role];
        }

        const result = await db.executeQuery(query, params);
        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: result[0]
        });
    } catch (error) {
        console.error('Kullanıcı ekleme hatası:', error);
        res.status(500).json({ message: 'Kullanıcı eklenirken bir hata oluştu' });
    }
};

// Öğrenci numarasının benzersizliğini kontrol et
const checkStudentNoUnique = async (req, res) => {
    const { studentNo } = req.query;

    try {
        const result = await db.executeQuery(
            'SELECT EXISTS(SELECT 1 FROM users WHERE student_no = $1)',
            [studentNo]
        );
        res.json({ exists: result[0].exists });
    } catch (error) {
        console.error('Öğrenci no kontrolü hatası:', error);
        res.status(500).json({ message: 'Kontrol sırasında bir hata oluştu' });
    }
};

// Öğrencileri listeleme
const getStudents = async (req, res) => {
    try {
        const result = await db.executeQuery(
            'SELECT id, username, fullname, phone_no, student_no FROM users WHERE role = $1',
            ['student']
        );
        res.json(result);
    } catch (error) {
        console.error('Öğrenci listesi hatası:', error);
        res.status(500).json({ message: 'Öğrenciler listelenirken bir hata oluştu' });
    }
};

// Öğretmenleri listeleme
const getTeachers = async (req, res) => {
    try {
        const result = await db.executeQuery(
            'SELECT id, username, fullname, phone_no FROM users WHERE role = $1',
            ['teacher']
        );
        res.json(result);
    } catch (error) {
        console.error('Öğretmen listesi hatası:', error);
        res.status(500).json({ message: 'Öğretmenler listelenirken bir hata oluştu' });
    }
};

// Öğrencileri silme
const deleteStudents = async (req, res) => {
    const { ids } = req.body;

    try {
        const result = await db.executeQuery(
            'DELETE FROM users WHERE id = ANY($1::int[]) AND role = $2 RETURNING id',
            [ids, 'student']
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Silinecek öğrenci bulunamadı' });
        }

        res.json({ message: 'Öğrenciler başarıyla silindi', deletedIds: result.map(r => r.id) });
    } catch (error) {
        console.error('Öğrenci silme hatası:', error);
        res.status(500).json({ message: 'Öğrenciler silinirken bir hata oluştu' });
    }
};

// Öğretmenleri silme
const deleteTeachers = async (req, res) => {
    const { ids } = req.body;

    try {
        // Önce öğretmenlerin aktif kurslarını kontrol et
        const activeCourses = await db.executeQuery(
            'SELECT DISTINCT u.id, u.fullname FROM users u INNER JOIN courses c ON u.id = c.instructor_id WHERE u.id = ANY($1::int[])',
            [ids]
        );

        if (activeCourses.length > 0) {
            return res.status(400).json({
                message: 'Bazı öğretmenlerin aktif kursları var',
                teachers: activeCourses.map(t => ({ id: t.id, fullname: t.fullname }))
            });
        }

        const result = await db.executeQuery(
            'DELETE FROM users WHERE id = ANY($1::int[]) AND role = $2 RETURNING id',
            [ids, 'teacher']
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Silinecek öğretmen bulunamadı' });
        }

        res.json({ message: 'Öğretmenler başarıyla silindi', deletedIds: result.map(r => r.id) });
    } catch (error) {
        console.error('Öğretmen silme hatası:', error);
        res.status(500).json({ message: 'Öğretmenler silinirken bir hata oluştu' });
    }
};

// Tüm öğrencileri getir
const getStudentList = async (req, res) => {
    try {
        const result = await db.executeQuery(`
            SELECT 
                u.id,
                u.username,
                u.fullname,
                u.phone_no,
                u.student_no,
                COUNT(e.course_id) as enrolled_courses
            FROM users u
            LEFT JOIN enrollments e ON u.id = e.student_id
            WHERE u.role = $1
            GROUP BY u.id
            ORDER BY u.id ASC
        `, ['student']);

        res.json(result);
    } catch (error) {
        console.error('Öğrenci listesi hatası:', error);
        res.status(500).json({ message: 'Öğrenci listesi alınırken bir hata oluştu' });
    }
};

module.exports = {
    addUser,
    checkStudentNoUnique,
    getStudents,
    getTeachers,
    deleteStudents,
    deleteTeachers,
    getStudentList
};
