import React, { useState } from 'react';
import { addUser, checkStudentNoUnique } from '../../services/api';

const NewUser = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        phoneNo: '',
        studentNo: '',
        class: '',
        exam: '',
        branch: '',
    });

    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setFormData({
            ...formData,
            role,
            studentNo: '',
            class: '',
            exam: '',
            branch: '',
            username: '',
            password: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'fullname') {
            const username = value
                .split(' ')  // Kelimelere ayırıyoruz
                .map((word, index) => {
                    if (index === 0) {
                        return word.toLowerCase();  // İlk kelimeyi küçük tutuyoruz
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();  // Diğer kelimeleri büyük harf ile başlatıyoruz
                })
                .join('');

            setFormData((prev) => ({ ...prev, username }));
        }
    };

    const generateRandomStudentNo = async () => {
        // 6 haneli rastgele öğrenci numarası oluştur
        const randomNo = Math.floor(100000 + Math.random() * 900000).toString();

        // Benzersizliği kontrol etmek için backend çağrısı (örnek)
        const isUnique = await checkStudentNoUnique(randomNo); // checkStudentNoUnique fonksiyonunu doğru bir şekilde backend'e entegre ettiğinizden emin olun

        if (isUnique) {
            setFormData((prev) => ({
                ...prev,
                studentNo: randomNo,
                password: randomNo, // Şifreyi öğrenci numarası olarak belirle
            }));
        } else {
            generateRandomStudentNo(); // Benzersiz değilse tekrar üret
        }
    };

    const handlePhoneInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Telefon numarasını formatlamak
        if (name === 'phoneNo') {
            // Sadece rakamları al
            formattedValue = value.replace(/\D/g, '');

            // Telefon numarasını formatla (max 11 haneli olacak şekilde)
            if (formattedValue.length <= 11) {
                // İlk 4 haneyi, sonra 3-2-2 formatında boşlukla ayır
                formattedValue = formattedValue.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
            } 
        }

        // Telefon numarasını güncelle
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Form verilerini düzenle
            const submissionData = {
                ...formData,
                exam: formData.exam,     // Sınav bilgisi
                class: formData.class    // Sınıf bilgisi
            };
            
            const response = await addUser(submissionData);
            alert(response.data);
            setSelectedRole('');
            setFormData({
                username: '',
                password: '',
                fullname: '',
                phoneNo: '',
                studentNo: '',
                class: '',
                exam: '',
                branch: '',
            });
        } catch (error) {
            alert('Kullanıcı ekleme sırasında hata oluştu.');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center my-2">Kullanıcı Ekleme</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="roleSelect" className="form-label fw-bold">Rol Seçin:</label>
                            <select
                                id="roleSelect"
                                className="form-select"
                                value={selectedRole}
                                onChange={handleRoleSelect}
                                required
                            >
                                <option value="">Rol Seçin</option>
                                <option value="student">Öğrenci</option>
                                <option value="teacher">Öğretmen</option>
                            </select>
                        </div>

                        {selectedRole && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="fullname" className="form-label fw-bold">Ad Soyad</label>
                                    <input
                                        type="text"
                                        id="fullname"
                                        name="fullname"
                                        className="form-control"
                                        placeholder="Ad Soyad"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNo" className="form-label fw-bold">Telefon Numarası</label>
                                    <input
                                        type="tel"
                                        id="phoneNo"
                                        name="phoneNo"
                                        className="form-control"
                                        placeholder="0XXX XXX XX XX"
                                        value={formData.phoneNo}
                                        onChange={handlePhoneInputChange}
                                        maxLength="11"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {selectedRole === 'student' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="studentNo" className="form-label fw-bold">Öğrenci Numarası</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="studentNo"
                                            name="studentNo"
                                            className="form-control"
                                            placeholder="Öğrenci Numarası"
                                            value={formData.studentNo}
                                            readOnly
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={generateRandomStudentNo}
                                        >
                                            Üret
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exam" className="form-label fw-bold">Sınav Türü</label>
                                    <select
                                        id="exam"
                                        name="exam"
                                        className="form-select"
                                        value={formData.exam}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sınav Türü Seçin</option>
                                        <option value="TYT + AYT (Sayısal)">TYT + AYT (Sayısal)</option>
                                        <option value="TYT + AYT (Eşit Ağırlık)">TYT + AYT (Eşit Ağırlık)</option>
                                        <option value="TYT + AYT (Sözel)">TYT + AYT (Sözel)</option>
                                        <option value="TYT + YDT (İngilizce)">TYT + YDT (İngilizce)</option>
                                        <option value="TYT + YDT (Almanca)">TYT + YDT (Almanca)</option>
                                        <option value="LGS">LGS</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="class" className="form-label fw-bold">Sınıf</label>
                                    <select
                                        id="class"
                                        name="class"
                                        className="form-select"
                                        value={formData.class}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sınıf Seçin</option>
                                        <option value="MF-1">MF-1</option>
                                        <option value="MF-2">MF-2</option>
                                        <option value="MF-3">MF-3</option>
                                        <option value="EA-1">EA-1</option>
                                        <option value="EA-2">EA-2</option>
                                        <option value="S-1">S-1</option>
                                        <option value="D-1">D-1</option>
                                        <option value="D-2">D-2</option>
                                        <option value="L-1">L-1</option>
                                        <option value="L-2">L-2</option>
                                        <option value="L-3">L-3</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {selectedRole === 'teacher' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="branch" className="form-label fw-bold">Branş</label>
                                    <select
                                        id="branch"
                                        name="branch"
                                        className="form-select"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Branş Seçin</option>
                                        <option value="Matematik">Matematik</option>
                                        <option value="Geometri">Geometri</option>
                                        <option value="Fizik">Fizik</option>
                                        <option value="Kimya">Kimya</option>
                                        <option value="Biyoloji">Biyoloji</option>
                                        <option value="Fen">Fen</option>
                                        <option value="Sosyal">Sosyal</option>
                                        <option value="Türkçe">Türkçe</option>
                                        <option value="Edebiyat">Edebiyat</option>
                                        <option value="Tarih">Tarih</option>
                                        <option value="Coğrafya">Coğrafya</option>
                                        <option value="Felsefe">Felsefe</option>
                                        <option value="Din Kültürü">Din Kültürü</option>
                                        <option value="İngilizce">İngilizce</option>
                                        <option value="Almanca">Almanca</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">Şifre</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Şifre girin"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {selectedRole && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-bold">Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="form-control"
                                        value={formData.username}
                                        readOnly
                                    />
                                </div>
                                {selectedRole === 'student' && (
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-bold">Şifre</label>
                                        <input
                                            type="text"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            readOnly
                                        />
                                    </div>
                                )}
                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-primary fw-bold">Kullanıcı Ekle</button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewUser;
