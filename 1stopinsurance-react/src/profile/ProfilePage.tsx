// src/pages/ProfilePage.tsx (หรือตามโครงสร้าง)

import React, { useState, useEffect } from "react";
// แก้ไข: นำเข้า useNavigate จาก react-router-dom
import { useNavigate } from "react-router-dom"; 
import useSWR from 'swr';
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // ใช้ axios ตรงๆ หรือใช้ api service ที่คุณสร้างเอง

// Components (สมมติว่าถูกแปลงเป็น Pure React แล้ว)
import MenuLogined from "../components/element/MenuLogined";
import ProfileCard from "./ProfileCard";
import InsuranceCard, { InsurancePolicy, InsuranceStatus } from "./InsuranceCard"; 
// import { GlobalStyles } from "./GlobalStyles"; // ลบเนื่องจากจะใช้ CSS/External Script

// ⚠️ สมมติว่า api.js คือ wrapper ของ axios
const api = axios.create({ baseURL: 'http://localhost:5000' }); 

// ================================================================
// TYPES (ไม่มีการเปลี่ยนแปลง)
// ================================================================
type DecodedToken = {
    username: string;
    _id: string;
    role: string;
};

type PurchaseStatus = 'active' | 'pending' | 'payment_due' | 'about_to_expire' | 'expired' | 'rejected';

interface IFrontendPurchase {
    _id: string; 
    status: PurchaseStatus;
    purchase_date: string; 
    start_date: string;
    policy_number: string;
    carInsurance_id?: {
        company_name?: string;
        level?: string;
    };
    car_id?: {
        registration?: string;
    };
    customer_id?: string;
    agent_id?: string | null;
    citizenCardImage?: string;
    carRegistrationImage?: string;
}
// ================================================================
// HELPER FUNCTIONS (ไม่มีการเปลี่ยนแปลง Logic)
// ================================================================

const checkCookie = (): DecodedToken | null => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            return jwtDecode<DecodedToken>(token);
        }
        return null;
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        return null;
    }
};

const formatDateTh = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
};

const mapStatus = (dbStatus: string): InsuranceStatus => {
    switch (dbStatus) {
        case 'active': return 'active';
        case 'about_to_expire': return 'expiring';
        case 'expired': return 'expired';
        case 'pending': return 'processing';
        case 'payment_due': return 'pending_payment';
        case 'rejected': return 'expired';
        default: return 'processing';
    }
};

// ================================================================
// FETCHERS
// ================================================================

// Fetcher สำหรับ Profile (POST)
const fetcherProfile = async (url: string) => {
    const userData = checkCookie();
    if (!userData) throw new Error("กรุณาเข้าสู่ระบบ");
    const { username, _id, role } = userData;
    // ใช้ api (axios wrapper) POST ได้ตามเดิม
    const res = await api.post(url, { username, _id, role });
    return res.data;
};

// Fetcher ใหม่สำหรับ Insurance (GET)
const fetcherInsurance = async (url: string) => {
    const res = await api.get(url);
    return res.data;
};

// ================================================================
// MAIN COMPONENT
// ================================================================

export default function ProfilePage() {
    // แก้ไข: ใช้ useNavigate()
    const navigate = useNavigate();
    const [userToken, setUserToken] = useState<DecodedToken | null>(null);

    // 1. Check Token เมื่อโหลดหน้า
    useEffect(() => {
        const decoded = checkCookie();
        if (decoded) {
            setUserToken(decoded);
        } else {
            // แก้ไข: ใช้ navigate() แทน router.push()
            navigate("/customer/login"); 
        }
    }, [navigate]); // เปลี่ยน router เป็น navigate

    const logout = () => {
        localStorage.removeItem("token");
        // แก้ไข: ใช้ navigate()
        navigate("/customer/login");
    };

    // 2. Fetch Profile Data
    const { data: profile, error: profileError, isLoading: profileLoading } = useSWR(
        "/customers/profile", 
        fetcherProfile,
        {
            dedupingInterval: 60000,
            revalidateOnFocus: false,
        }
    );

    // 3. Fetch Insurance Data
    const { data: insuranceList, error: insuranceError, isLoading: insuranceLoading } = useSWR(
        userToken?._id ? `/purchase/customer/${userToken._id}` : null, 
        fetcherInsurance
    );

    // Loading / Error States for Profile
    // ถ้าเซสชั่นหมดอายุ navigate ไป login เลย
    if (profileError && !profileLoading) {
        if (profileError.message !== "กรุณาเข้าสู่ระบบ") { // ป้องกัน loop ถ้า checkCookie ล้มเหลว
             setTimeout(logout, 100); // ดีเลย์เล็กน้อยเพื่อให้ navigate ทำงาน
        }
    }
    
    if (profileLoading) return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;
    if (profileError) return <p className="text-center text-red-600 mt-10">เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่</p>;


    return (
        // ลบ <GlobalStyles /> และ <Script> ของ Next.js ออก
        // ต้องมั่นใจว่า CSS ถูกจัดการโดยไฟล์ CSS ภายนอกแล้ว
        <main className="font-sans text-gray-800"> 
            {/* ⚠️ ต้องเพิ่ม Script Tag มาตรฐานสำหรับ Font Awesome ถ้าคุณยังต้องการใช้ */}
            {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js" crossOrigin="anonymous"></script> */}

            {/* 1. Header */}
            <MenuLogined activePage="/customer/profile"/>

            {/* 2. Profile */}
            <ProfileCard user={profile} />

            {/* 3. Insurance Cards Section */}
            <section className="max-w-5xl mx-auto mb-10 px-4 md:px-0">
                <h2 className="text-xl font-bold mb-4 ml-1">กรมธรรม์ของฉัน</h2>
                
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* State: กำลังโหลดประกัน */}
                    {insuranceLoading && (
                        <div className="col-span-2 text-center py-10 text-gray-500">
                            กำลังโหลดข้อมูลกรมธรรม์...
                        </div>
                    )}

                    {/* State: โหลดเสร็จแต่ไม่มีข้อมูล */}
                    {!insuranceLoading && insuranceList && insuranceList.length === 0 && (
                        <div className="col-span-2 text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500 mb-4">คุณยังไม่มีรายการประกันภัย</p>
                            <Link to={"/customer/car-insurance/car-Insurance-form"} className="text-blue-500 font-bold w-48 h-12 flex justify-center items-center rounded-full shadow-md hover:bg-blue-500 hover:text-white transition text-lg mx-auto">
                                คลิกเพื่อสั่งซื้อเลย!
                            </Link>
                        </div>
                    )}
                    
                    {/* State: มีข้อมูล -> Loop แสดงผล */}
                    {!insuranceLoading && insuranceList && insuranceList.map((item: IFrontendPurchase) => {
                        
                        let displayDate = item.purchase_date;
                        if(item.status === 'active' && item.start_date) {
                            const start = new Date(item.start_date);
                            start.setFullYear(start.getFullYear() + 1); 
                            displayDate = start.toISOString();
                        }

                        const mappedPolicy: InsurancePolicy = {
                            id: item._id,
                            status: mapStatus(item.status),
                            date: formatDateTh(displayDate),
                            title: `ประกันรถยนต์: ${item.carInsurance_id?.company_name || ''} ${item.carInsurance_id?.level || 'ไม่ระบุแผน'}`,
                            registration: item.car_id?.registration || 'รอระบุ',
                            policyNumber: item.policy_number || '-'
                        };

                        return (
                            <InsuranceCard
                                key={mappedPolicy.id}
                                policy={mappedPolicy}
                                className={mappedPolicy.status === "pending_payment" ? "md:col-span-2" : ""}
                            />
                        );
                    })}
                </div>
            </section>
        </main>
    );
}