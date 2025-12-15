import { Link } from 'react-router-dom'

function Menu() {
  return (
    <header 
      className="flex justify-between items-center px-8 py-4 bg-white shadow-sm cursor-pointer sticky top-0 z-[9999]"
    >
      {/* ส่วน Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/fotos/Logo.png" // ต้องมั่นใจว่าไฟล์อยู่ที่ public/fotos/Logo.png
          alt="logo"
          className="h-10 w-auto" // ให้ CSS จัดการขนาดแทน width/height
        />
        <span className="text-xl font-bold text-blue-900">1StopInsurance</span>
      </Link>

      {/* เมนูตรงกลาง */}
      <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
        {/* ใส่ / นำหน้า path เสมอ เพื่อให้เป็น Absolute Path */}
        <Link to="/customer/car-insurance/car-Insurance-form" className="hover:text-blue-700">
          ประกันรถยนต์
        </Link>
        <Link to="/" className="hover:text-blue-700">
          เกี่ยวกับเรา
        </Link>
        {/* ลิงก์ภายในหน้าเดียวกันใช้ <a> แทน Link จะทำงานกับ id ได้ดีกว่า */}
        <a href="#footer" className="hover:text-blue-700">
          ติดต่อเรา
        </a>
      </nav>

      {/* ปุ่ม Login */}
      <Link 
        to="/customer/login"
        className="border border-blue-900 text-blue-900 px-5 py-2 rounded-full font-semibold hover:bg-blue-900 hover:text-white transition"
      >
        เข้าสู่ระบบ
      </Link>
    </header>
  )
}

export default Menu