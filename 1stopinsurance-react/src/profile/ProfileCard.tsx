// src/components/ProfileCard.tsx
// แก้ไข: นำเข้า Link จาก react-router-dom
import { Link } from 'react-router-dom'; 
// ลบการนำเข้า Next.js Image
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import EditIcon from '@mui/icons-material/Edit';
// ⚠️ ต้องมี Customer type ในไฟล์ dataType
import { type Customer } from '../types/dataType'; 

const iconMap = {
    "location": LocationOnIcon,
    "email": EmailIcon,
    "phone": PhoneIcon,
    "cake": CakeIcon,
};

// ลบ 'use client'
function ProfileCard({ user }: { user: Customer | null }) {

    const dataFields = user ? [
        { label: "ที่อยู่", value: user.address, iconKey: "location" },
        { label: "อีเมล", value: user.email, iconKey: "email" },
        { label: "เบอร์โทร", value: user.phone, iconKey: "phone" },
        // ใช้ toLocaleDateString() ได้ตามเดิม
        { label: "วันเกิด", value: new Date(user.birth_date).toLocaleDateString("th-TH"), iconKey: "cake" },
    ] : [];

    // ✅ สร้าง Object ลิงก์ (String URL)
    const editProfilePath = user ? 
        `/customer/profile/edit-profile?_id=${user._id}&first_name=${user.first_name}&last_name=${user.last_name}&email=${user.email}&phone=${user.phone}&address=${user.address}&birth_date=${user.birth_date ? new Date(user.birth_date).toISOString() : ""}&imgProfile_customer=${user.imgProfile_customer}`
        : "#"; 

    return (
        <section
            className="max-w-5xl mx-auto mt-12 mb-10 bg-white rounded-2xl shadow-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 mx-4"
            style={{ boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}
        >
            <div className="flex-shrink-0 relative">
                {/* แก้ไข: ใช้ <img> แทน <Image> */}
                <img
                    src={user?.imgProfile_customer || "/fotos/noPrafile.jpg"}
                    alt="Profile Image"
                    width={160}
                    height={160}
                    className="object-cover rounded-full border-6 border-blue-500/50 shadow-xl transition duration-300 hover:border-blue-500"
                    style={{ width: 160, height: 160, objectFit: 'cover' }}
                />
                {user && (
                    <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                )}
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-6">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {user ? `${user.first_name} ${user.last_name}` : "กำลังโหลด..."}
                    </h2>

                    {/* ปุ่ม Edit Desktop: ใช้ Link to={string path} */}
                    {user && (
                        <Link 
                            to={editProfilePath} 
                            title="แก้ไขโปรไฟล์" 
                            className="hidden md:block"
                        >
                            <EditIcon
                                className="text-4xl text-gray-400 hover:text-blue-600 cursor-pointer transition duration-200"
                                style={{ fontSize: '2rem' }}
                            />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 border-t pt-6 border-gray-100">
                    {user ? (
                        dataFields.map((field, index) => {
                            const IconComponent = iconMap[field.iconKey as keyof typeof iconMap];
                            return (
                                <div
                                    key={index}
                                    className="bg-white p-5 rounded-xl transition duration-300 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100"
                                >
                                    <p className="text-xs font-bold uppercase text-blue-600 mb-2 flex items-center">
                                        <IconComponent className="mr-2 text-blue-500" style={{ fontSize: '1.2rem' }} />
                                        {field.label}
                                    </p>
                                    <p className="text-lg text-gray-800 font-semibold break-words">{field.value}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-6">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-md italic text-gray-500">กำลังโหลดข้อมูลโปรไฟล์...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ปุ่ม Edit Mobile: ใช้ Link to={string path} */}
            {user && (
                <div className="md:hidden mt-4 self-center relative z-50">
                    <Link 
                        to={editProfilePath} 
                        title="แก้ไขโปรไฟล์"
                    >
                        <EditIcon
                            className="text-4xl text-gray-400 hover:text-blue-600 cursor-pointer transition duration-200"
                            style={{ fontSize: '2rem' }}
                        />
                    </Link>
                </div>
            )}
        </section>
    );
}

export default ProfileCard;