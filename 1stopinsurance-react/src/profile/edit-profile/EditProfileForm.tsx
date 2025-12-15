import { useState, type FormEvent, type ChangeEvent } from 'react'; // ✅ แก้ตรงนี้ครับ
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Person, Email, Phone, Home, Cake, CloudUpload, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { mutate } from "swr";

import api from '../../services/api';
import { type Customer } from '../../types/dataType';

export default function EditProfileForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ฟังก์ชันช่วย Decode URL
    const decode = (str: string | null) => str ? decodeURIComponent(str) : "";

    const [formData, setFormData] = useState<Customer>(() => {
        const hasParams = searchParams.get('first_name');

        if (hasParams) {
            const birthDateStr = searchParams.get('birth_date');
            const imgProfile = searchParams.get('imgProfile_customer');

            return {
                _id: decode(searchParams.get('_id')) || "",
                first_name: decode(searchParams.get('first_name')) || "",
                last_name: decode(searchParams.get('last_name')) || "",
                email: decode(searchParams.get('email')) || "",
                phone: decode(searchParams.get('phone')) || "",
                address: decode(searchParams.get('address')) || "",
                birth_date: birthDateStr ? new Date(birthDateStr) : new Date(),
                username: "",
                password: "",
                imgProfile_customer: decode(imgProfile) || "/fotos/noPrafile.jpg"
            };
        }

        return {
            _id: "",
            first_name: "",
            last_name: "",
            email: "",
            address: "",
            birth_date: new Date(),
            phone: "",
            username: "",
            password: "",
            imgProfile_customer: "/fotos/noPrafile.jpg",
        };
    });

    const [profilePreview, setProfilePreview] = useState<string>(() => {
        const img = searchParams.get('imgProfile_customer');
        return img ? decodeURIComponent(img) : "/fotos/noPrafile.jpg";
    });

    const [showModal, setShowModal] = useState<boolean>(false);

    const formatDateForInput = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split('T')[0];
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'birth_date' ? new Date(value) : value,
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const targetId = formData._id || searchParams.get('_id');
        if (!targetId) return alert("ไม่พบ User ID");

        try {
            const response = await api.put(`/customers/${targetId}`, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                birth_date: formData.birth_date,
                imgProfile_customer: profilePreview
            });

            if (response.status === 200) {
                setShowModal(true);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
                alert(error.response?.data?.message || "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
            } else {
                console.error("Unknown Error:", error);
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
            }
        }
    };

    const handleModalConfirm = () => {
        setShowModal(false);
        mutate("/customers/profile");
        navigate("/customer/profile");
    };

    return (
        <div className='my-10 px-4'>
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-[9999] transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm text-center transform scale-100 transition-transform">
                        <CheckCircle className="text-green-500 mx-auto mb-4" style={{ fontSize: '3rem' }} />
                        <h2 className="text-xl font-bold mb-3 text-gray-800">บันทึกข้อมูลสำเร็จ!</h2>
                        <p className="text-gray-600 mb-6">ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว</p>
                        <button
                            onClick={handleModalConfirm}
                            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 lg:p-10 border-t-4 border-blue-600">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center tracking-tight">แก้ไขโปรไฟล์</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center pb-4 border-b border-gray-100 flex flex-col items-center">
                        <img
                            id="profilePreview"
                            src={profilePreview}
                            alt="profile preview"
                            className="h-24 w-24 rounded-full object-cover border-4 border-blue-200 shadow-md mb-4"
                        />
                        <label htmlFor="file-upload" className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition shadow-md">
                            <CloudUpload style={{ fontSize: '1.2rem' }} />
                            <span className="font-semibold text-sm">อัปโหลดรูปโปรไฟล์ใหม่</span>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="first_name" className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                <Person className="text-blue-500" /> ชื่อจริง
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                <Person className="text-blue-500" /> นามสกุล
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="birth_date" className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                            <Cake className="text-blue-500" /> วันเกิด
                        </label>
                        <input
                            type="date"
                            id="birth_date"
                            name="birth_date"
                            value={formatDateForInput(formData.birth_date)}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                <Phone className="text-blue-500" /> เบอร์โทรศัพท์
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                <Email className="text-blue-500" /> อีเมล
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                            <Home className="text-blue-500" /> ที่อยู่
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-between pt-4 gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/customer/profile")}
                            className="flex-1 px-8 py-3 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition text-gray-800"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}