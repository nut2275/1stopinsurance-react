import React, { useState, type FormEvent, type ChangeEvent } from 'react'; // ✅ เพิ่ม ChangeEvent เข้ามา
import { useNavigate } from 'react-router-dom'; 
import { type InsuranceAnswers, type Coverage, initialAnswers } from '../../types/Survey'; 

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DoneIcon from '@mui/icons-material/Done';

// ✅ แก้ไข 1: ย้าย Interface และ Component มาไว้นอกฟังก์ชันหลัก (Top Level)
interface CardOptionProps {
    name: keyof InsuranceAnswers;
    value: string;
    label: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type: 'radio' | 'checkbox';
}

const CardOption: React.FC<CardOptionProps> = ({ name, value, label, checked, onChange, type }) => {
    const baseClasses = "block p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer text-center";
    const checkedClasses = type === 'radio'
        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.03]"
        : checked
        ? "bg-green-500 border-green-500 text-white shadow-lg scale-[1.03]"
        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200";

    const uncheckedClasses = "bg-white border-gray-300 text-gray-700 hover:border-blue-400 shadow-md";

    return (
        <label className={`${baseClasses} ${checked ? checkedClasses : uncheckedClasses} relative`}>
            <input
                type={type}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="absolute opacity-0 w-0 h-0"
            />
            {checked && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
                    <DoneIcon className="text-blue-600" style={{ fontSize: '1.2rem' }} />
                </div>
            )}
            <span className="font-semibold text-base">{label}</span>
        </label>
    );
};

// ------------------- Main Component -------------------

export default function SurveyForm() {
    const [answers, setAnswers] = useState<InsuranceAnswers>(initialAnswers);
    const navigate = useNavigate();

    // ✅ แก้ไข 2: ระบุ type ให้ e เป็น ChangeEvent<HTMLInputElement>
    const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAnswers(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setAnswers(prev => {
            const newCoverage = checked
                ? [...prev.coverage, value as Coverage]
                : prev.coverage.filter(v => v !== value);

            return {
                ...prev,
                coverage: newCoverage,
            };
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const requiredFields: (keyof InsuranceAnswers)[] = ['budget', 'repair', 'usage', 'accident'];
        const isFormValid = requiredFields.every(field => answers[field] !== undefined) && answers.coverage.length > 0;

        if (!isFormValid) {
            alert("กรุณาตอบคำถามให้ครบทุกข้อก่อนส่งคำตอบ!"); 
            return;
        }

        try {
            localStorage.setItem("insuranceAnswers", JSON.stringify(answers));
            navigate("/customer/car-insurance/insurance"); 
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกคำตอบ!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2rem] shadow-3xl border border-gray-100 mt-8 mb-12">
            <h1 className="text-center text-4xl font-extrabold text-blue-800 mb-4 tracking-tighter">
                ค้นหาประกันที่ใช่สำหรับคุณ 🚀
            </h1>
            <p className="text-center text-gray-600 mb-10 text-lg">ตอบคำถาม 5 ข้อเพื่อรับคำแนะนำประกันรถยนต์ที่ดีที่สุด</p>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. งบประมาณ */}
                <div className="p-6 border-l-4 border-blue-500 rounded-lg bg-gray-50 shadow-inner">
                    <p className="font-bold text-xl text-blue-800 mb-4 flex items-center">
                        <AttachMoneyIcon className="mr-3 text-3xl"/> 1. งบประมาณที่ตั้งไว้ต่อปี
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <CardOption name="budget" value="low" label="ไม่เกิน 5,000 บาท" type="radio" checked={answers.budget === 'low'} onChange={handleRadioChange} />
                        <CardOption name="budget" value="mid-low" label="5,000 – 8,000 บาท" type="radio" checked={answers.budget === 'mid-low'} onChange={handleRadioChange} />
                        <CardOption name="budget" value="mid" label="8,000 – 12,000 บาท" type="radio" checked={answers.budget === 'mid'} onChange={handleRadioChange} />
                        <CardOption name="budget" value="high" label="ไม่จำกัด" type="radio" checked={answers.budget === 'high'} onChange={handleRadioChange} />
                    </div>
                </div>
                
                {/* ... ส่วนอื่น ๆ ของฟอร์มเหมือนเดิม ... */}
                
                <div className="text-center pt-6 border-t border-gray-200">
                    <button type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white px-12 py-4 rounded-full font-extrabold text-xl shadow-xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.05] tracking-wider uppercase focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        ส่งคำตอบและดูผลลัพธ์
                    </button>
                </div>
            </form>
        </div>
    );
}