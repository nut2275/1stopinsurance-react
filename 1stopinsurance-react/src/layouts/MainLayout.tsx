import React from 'react';
import { Outlet } from 'react-router-dom';
// เราใช้ MenuLogined เป็นตัวหลัก เพราะข้างในมันมี Logic สลับ header (Login/ไม่ Login) ให้แล้ว
import MenuLogined from '../components/element/MenuLogined'; 
import Footer from '../components/element/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ส่วนหัว (Header) */}
      {/* <MenuLogined /> */}

      {/* ส่วนเนื้อหา (Content) จะเปลี่ยนไปเรื่อยๆ ตามหน้าเว็บ */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ส่วนท้าย (Footer) */}
      <Footer />
    </div>
  );
}