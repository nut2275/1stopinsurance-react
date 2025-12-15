import { useNavigate } from "react-router-dom"; 

export type InsuranceStatus =
    | "active"
    | "expiring"
    | "expired"
    | "processing"
    | "pending_payment";

export type InsurancePolicy = {
    id: string;
    status: InsuranceStatus;
    date: string;
    title: string;
    registration: string;
    policyNumber: string;
};

type StatusDetails = {
    text: string;
    badgeColor: string;
    borderColor: string;
    dateLabel: string;
};

const statusConfig: Record<InsuranceStatus, StatusDetails> = {
    active: {
        text: "กำลังใช้งาน",
        badgeColor: "bg-green-600",
        borderColor: "border-green-600",
        dateLabel: "หมดอายุ",
    },
    expiring: {
        text: "ใกล้หมดอายุ",
        badgeColor: "bg-red-600",
        borderColor: "border-red-600",
        dateLabel: "หมดอายุ",
    },
    expired: {
        text: "หมดอายุแล้ว",
        badgeColor: "bg-gray-500",
        borderColor: "border-gray-500",
        dateLabel: "หมดอายุ",
    },
    processing: {
        text: "กำลังดำเนินการ",
        badgeColor: "bg-amber-500",
        borderColor: "border-amber-500",
        dateLabel: "อัปเดต",
    },
    pending_payment: {
        text: "รอการชำระเงิน",
        badgeColor: "bg-orange-600",
        borderColor: "border-orange-600",
        dateLabel: "กำหนดชำระ",
    },
};

type InsuranceCardProps = {
    policy: InsurancePolicy;
    className?: string;
};

export default function InsuranceCard({
    policy,
    className = "",
}: InsuranceCardProps) {
    const navigate = useNavigate(); 
    const config = statusConfig[policy.status];
    const isPendingPayment = policy.status === "pending_payment";

    // ✅ แก้ไข: ลบบรรทัด const currentPath = ... ออกไปแล้วเพื่อล้าง Error TS6133

    return (
        <div className={`card border-t-4 ${config.borderColor} ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`status-badge ${config.badgeColor}`}>
                    {config.text}
                </span>
                <span className="text-sm text-gray-700 font-semibold">
                    {config.dateLabel}: {policy.date}
                </span>
            </div>

            <p className="text-sm text-gray-700">
                <b>ประกันรถยนต์:</b> {policy.title.split(": ")[1] || policy.title}
            </p>
            <p className="text-sm text-gray-600">ทะเบียน: {policy.registration}</p>
            <p className="text-sm text-gray-600 mb-4">
                เลขกรมธรรม์: {policy.policyNumber}
            </p>

            <div className="flex justify-between gap-2">
                <button
                    className="btn btn-dark flex-1"
                    onClick={() => navigate(`/customer/purchase/${policy.id}`)}
                >
                    <i className="fa-regular fa-file-lines mr-2"></i> ดูเอกสาร
                </button>

                <button
                    className="btn btn-green flex-1"
                    onClick={() => navigate(`/customer/agent/${policy.id}`)}
                >
                    <i className="fa-solid fa-phone-volume mr-2"></i>
                    {isPendingPayment
                        ? "ติดต่อเจ้าหน้าที่เพื่อชำระค่าประกัน"
                        : "ติดต่อเจ้าหน้าที่"}
                </button>
            </div>
        </div>
    );
}