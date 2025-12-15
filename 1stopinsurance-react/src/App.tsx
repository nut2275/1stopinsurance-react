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
    </Routes>
  );
}

export default App;