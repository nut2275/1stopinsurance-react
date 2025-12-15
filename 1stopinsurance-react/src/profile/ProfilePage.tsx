import  { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ แก้ไข 5: เพิ่ม Link เข้ามา
import useSWR from 'swr';
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

import MenuLogined from "../components/element/MenuLogined";
import ProfileCard from "./ProfileCard";
// ✅ แก้ไข 1: ใช้ type-only import สำหรับ Type
import InsuranceCard from "./InsuranceCard";
import type { InsurancePolicy, InsuranceStatus } from "./InsuranceCard"; 

// ================================================================
// TYPES
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
// HELPER FUNCTIONS
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

const fetcherProfile = async (url: string) => {
    const userData = checkCookie();
    if (!userData) throw new Error("กรุณาเข้าสู่ระบบ");
    const { username, _id, role } = userData;
    const res = await api.post(url, { username, _id, role });
    return res.data;
};

const fetcherInsurance = async (url: string) => {
    const res = await api.get(url);
    return res.data;
};

// ================================================================
// MAIN COMPONENT
// ================================================================

export default function ProfilePage() {
    const navigate = useNavigate();

    // ✅ แก้ไข 2: ใช้ Lazy Initialization สำหรับ State เพื่อเลี่ยง Error 'set-state-in-effect'
    const [userToken, setUserToken] = useState<DecodedToken | null>(() => checkCookie());

    // 1. ตรวจสอบ Auth (ถ้าไม่มี Token ให้เด้งออก)
    useEffect(() => {
        if (!userToken) {
            navigate("/customer/login"); 
        }
    }, [userToken, navigate]);

    const logout = () => {
        localStorage.removeItem("token");
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

    // เซสชั่นหมดอายุ
    if (profileError && !profileLoading) {
        if (profileError.message !== "กรุณาเข้าสู่ระบบ") {
             setTimeout(logout, 100);
        }
    }
    
    if (profileLoading) return <p className="text-center mt-10 font-bold">กำลังโหลดข้อมูลโปรไฟล์...</p>;
    if (profileError) return <p className="text-center text-red-600 mt-10">เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่</p>;

    return (
        <main className="font-sans text-gray-800 pb-20"> 

            {/* 1. Header */}
            {/* ✅ แก้ไข 4: ลบ activePage ออก เพราะใน MenuLogined.tsx ที่เราแก้ไป มันใช้ useLocation() เช็คเองแล้ว */}
            <MenuLogined />

            {/* 2. Profile Card */}
            <ProfileCard user={profile} />

            {/* 3. Insurance Cards Section */}
            <section className="max-w-5xl mx-auto mb-10 px-4 md:px-0">
                <h2 className="text-xl font-bold mb-4 ml-1">กรมธรรม์ของฉัน</h2>
                
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {insuranceLoading && (
                        <div className="col-span-2 text-center py-10 text-gray-500">
                            กำลังโหลดข้อมูลกรมธรรม์...
                        </div>
                    )}

                    {!insuranceLoading && insuranceList && insuranceList.length === 0 && (
                        <div className="col-span-2 text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500 mb-4">คุณยังไม่มีรายการประกันภัย</p>
                            {/* ✅ แก้ไข 5: ตอนนี้ Link จะใช้งานได้แล้วเพราะ import มาข้างบน */}
                            <Link to={"/customer/car-insurance/car-Insurance-form"} className="text-blue-500 font-bold w-48 h-12 flex justify-center items-center rounded-full shadow-md border border-blue-500 hover:bg-blue-500 hover:text-white transition text-lg mx-auto">
                                คลิกเพื่อสั่งซื้อเลย!
                            </Link>
                        </div>
                    )}
                    
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