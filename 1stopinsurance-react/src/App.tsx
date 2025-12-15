import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import MainPage from './components/page/MainPage'; 
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm';
import ProfilePage from './profile/ProfilePage'; // ✅ เช็คว่า path นี้มีไฟล์ ProfilePage.tsx จริงๆ

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        {/* ลองเข้าหน้าตรงๆ ผ่าน URL: http://localhost:5173/customer/profile */}
        <Route path="/customer/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/customer/login" element={<LoginForm />} />
      <Route path="/customer/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;