import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MainPage from './components/page/MainPage';

function App() {
  return (
    <Routes>
      {/* กลุ่มหน้าเว็บทั่วไป (ใช้ MainLayout ครอบ) */}
      <Route element={<MainLayout />}>
        {/* path "/" คือหน้าแรกสุด */}
        <Route path="/" element={<MainPage />} />
        
        {/* อนาคตเพิ่มหน้าอื่นๆ ตรงนี้ได้เลย เช่น: */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
      </Route>

      {/* ถ้ามีหน้า Login แยก ที่ไม่อยากได้ Header/Footer เดิม ก็เพิ่มตรงนี้ได้ */}
    </Routes>
  );
}

export default App;