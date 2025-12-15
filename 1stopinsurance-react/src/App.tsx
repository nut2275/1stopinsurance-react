import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ✅ Import ตามโครงสร้างไฟล์ในภาพ image_c5341e.png
import MainLayout from './layouts/MainLayout';
import MainPage from './components/page/MainPage'; 
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm'; // (สมมติว่าข้างในไฟล์ RegisterForm ก็แก้เป็น React แล้ว)

function App() {
  return (
    <Routes>
      {/* 🟢 กลุ่มหน้าเว็บทั่วไป (ใช้ MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/customer/profile" element={<ProfilePage />} />  <-- เดี๋ยวค่อยมาเปิดบรรทัดนี้ตอนทำ Profile เสร็จ */}
      </Route>

      {/* 🔴 หน้า Login/Register (แยกออกมา ไม่มี Layout) */}
      <Route path="/customer/login" element={<LoginForm />} />
      <Route path="/customer/register" element={<RegisterForm />} />
      
    </Routes>
  );
}

export default App;