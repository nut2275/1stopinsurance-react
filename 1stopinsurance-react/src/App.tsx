import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import MainPage from './components/page/MainPage'; 
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm';
import ProfilePage from './profile/ProfilePage';

import EditProfileForm from './profile/edit-profile/EditProfileForm'; 
import MainPageLogged from './mainpage/MainPage';

import CarInsuranceForm from './car-insurance/car-Insurance-form/CarInsuranceForm';
import InsuranceResultsPage from './car-insurance/insurance/InsuranceResultsPage';

import SummaryInsurance from './car-insurance/summary/SummaryInsurance';
import UploadDocumentsPage from './car-insurance/upload-documents/DocumentsUpload';


function App() {
  return (
    <Routes>
      {/* 🟢 กลุ่มหน้าเว็บที่ใช้ Header/Footer ปกติ */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
        
        {/* ✅ เพิ่มบรรทัดนี้: สร้าง Route สำหรับหน้าแก้ไขโปรไฟล์ */}
        <Route path="/customer/profile/edit-profile" element={<EditProfileForm />} />
      </Route>

      {/* 🔴 หน้า Login/Register (ไม่มี Layout) */}
      <Route path="/customer/login" element={<LoginForm />} />
      <Route path="/customer/register" element={<RegisterForm />} />
      <Route path="/customer/mainpage" element={<MainPageLogged />} />

      <Route path="/customer/car-insurance/car-Insurance-form" element={<CarInsuranceForm />} />
      <Route path="/customer/car-insurance/insurance" element={<InsuranceResultsPage />} />
      <Route path="/customer/car-insurance/summary" element={<SummaryInsurance />} />
      <Route path="/customer/car-insurance/upload-documents" element={<UploadDocumentsPage />} />
    </Routes>
  );
}

export default App;