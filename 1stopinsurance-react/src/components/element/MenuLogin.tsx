import React from 'react'
import { Link } from 'react-router-dom'

function MenuLogin() {
  // สำหรับหน้า login register เท่านั้น
  return (
    <header className="flex items-center px-8 py-4 bg-white shadow sticky top-0 z-[9999]">
        <Link to="/" className="flex items-center space-x-2 text-blue-900 font-bold text-xl no-underline">
        
        {/* ใช้ <img> ธรรมดาใน Vite */}
        <img 
            src="/fotos/Logo.png" 
            alt="logo" 
            className="w-10 h-10" // กำหนดขนาด 40px
        />
        <span>1StopInsurance</span>
        </Link>
    </header>
  )
}

export default MenuLogin