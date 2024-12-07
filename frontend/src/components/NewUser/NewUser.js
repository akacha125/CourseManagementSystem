import React, { useState } from 'react';
import { addUser } from '../../services/api';

const NewUser = () => {
    const [selectedRole, setSelectedRole] = useState(''); // Seçilen rol
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        phoneNo: '',
        studentNo: '',
        class: '',
        yearlyFee: '',
        branch: '',
        salary: '',
        childFullname: '',
        childSchoolNo: '',
        address: '',
        childYearlyFee: '',
    });

    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setFormData({
            ...formData,
            role,
            studentNo: '',
            class: '',
            yearlyFee: '',
            branch: '',
            salary: '',
            childFullname: '',
            childSchoolNo: '',
            address: '',
            childYearlyFee: '',
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addUser(formData);
            alert(response.data);
            setSelectedRole('');
            setFormData({
                username: '',
                password: '',
                fullname: '',
                phoneNo: '',
                studentNo: '',
                class: '',
                yearlyFee: '',
                branch: '',
                salary: '',
                childFullname: '',
                childSchoolNo: '',
                address: '',
                childYearlyFee: '',
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
                                <option value="parent">Veli</option>
                            </select>
                        </div>

                        {selectedRole && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-bold">Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="form-control"
                                        placeholder="Kullanıcı Adı"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">Şifre</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Şifre"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
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
                                        placeholder="Telefon Numarası"
                                        value={formData.phoneNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {selectedRole === 'student' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="studentNo" className="form-label fw-bold">Öğrenci Numarası</label>
                                    <input
                                        type="text"
                                        id="studentNo"
                                        name="studentNo"
                                        className="form-control"
                                        placeholder="Öğrenci Numarası"
                                        value={formData.studentNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="class" className="form-label fw-bold">Sınıf</label>
                                    <input
                                        type="text"
                                        id="class"
                                        name="class"
                                        className="form-control"
                                        placeholder="Sınıf"
                                        value={formData.class}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="yearlyFee" className="form-label fw-bold">Yıllık Kayıt Ücreti</label>
                                    <input
                                        type="number"
                                        id="yearlyFee"
                                        name="yearlyFee"
                                        className="form-control"
                                        placeholder="Yıllık Kayıt Ücreti"
                                        value={formData.yearlyFee}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {selectedRole === 'teacher' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="branch" className="form-label fw-bold">Branş</label>
                                    <input
                                        type="text"
                                        id="branch"
                                        name="branch"
                                        className="form-control"
                                        placeholder="Branş"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="salary" className="form-label fw-bold">Maaş</label>
                                    <input
                                        type="number"
                                        id="salary"
                                        name="salary"
                                        className="form-control"
                                        placeholder="Maaş"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {selectedRole === 'parent' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="childFullname" className="form-label fw-bold">Velisi Olduğu Çocuk Adı</label>
                                    <input
                                        type="text"
                                        id="childFullname"
                                        name="childFullname"
                                        className="form-control"
                                        placeholder="Velisi Olduğu Çocuk Adı"
                                        value={formData.childFullname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="childSchoolNo" className="form-label fw-bold">Öğrencinin Okul Numarası</label>
                                    <input
                                        type="text"
                                        id="childSchoolNo"
                                        name="childSchoolNo"
                                        className="form-control"
                                        placeholder="Çocuk Okul Numarası"
                                        value={formData.childSchoolNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label fw-bold">Adres</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="form-control"
                                        placeholder="Adres"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="childYearlyFee" className="form-label fw-bold">Öğrencinin Yıllık Ücreti</label>
                                    <input
                                        type="number"
                                        id="childYearlyFee"
                                        name="childYearlyFee"
                                        className="form-control"
                                        placeholder="Öğrencinin Yıllık Ücreti"
                                        value={formData.childYearlyFee}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {selectedRole && (
                            <div className="text-center mt-4">
                                <button type="submit" className="btn btn-primary fw-bold">Kullanıcı Ekle</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewUser;
