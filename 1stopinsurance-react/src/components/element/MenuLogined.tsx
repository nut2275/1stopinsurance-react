import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { href: "/customer/car-insurance/car-Insurance-form", label: "ประกันรถยนต์" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "#footer", label: "ติดต่อเรา" }, // หมายเหตุ: ถ้า link ในหน้าเดียวกัน ใช้ <a> ดีกว่าครับ
];

export default function MenuLogined() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [customerData, setCustomerData] = useState<any>(() => {
  try {
    const storedData = localStorage.getItem("customer");
    return storedData ? JSON.parse(storedData) : null;
  } catch (e) {
    return null;
  }
});
  
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // ใช้เช็ค URL ปัจจุบัน
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

// ✅ ใช้อันนี้แทนครับ


  const logout = () => {
    localStorage.clear(); // หรือ removeItem ตาม key ที่ใช้จริง
    setIsMenuOpen(false);
    navigate("/customer/login"); // เปลี่ยนหน้าแบบ SPA ไม่ต้อง reload
  };

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // ฟังก์ชันเช็คว่าลิงก์นี้ Active อยู่ไหม
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {customerData ? (
        // ==================== กรณี Login แล้ว ====================
        <div className="top-0 z-[9999] sticky">
          <header className="bg-white/95 backdrop-blur-sm shadow-sm px-4 sm:px-6 h-20 flex items-center justify-between border-b border-slate-200">
            
            {/* Desktop Right Side */}
            <div className='flex'>
                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="md:hidden text-slate-600 hover:text-blue-600 p-2 rounded-md"
                >
                    {isNavOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link to="/customer/mainpage" className="flex items-center gap-2">
                        <img
                            src="/fotos/Logo.png"
                            alt="logo"
                            className="h-10 w-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/48x48/1d4ed8/FFFFFF?text=1S";
                            }}
                        />
                        <span className="text-lg sm:text-xl font-bold text-blue-800 hidden sm:block">
                        1StopInsurance
                        </span>
                    </Link>
                </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden xl:flex gap-2 bg-white p-3 rounded-full m-4 shadow">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-5">
                {/* Notification */}
                <Link to={'/notification'} className={`relative w-8 h-8 transition-colors rounded-full ${
                      isActive("/notification")
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-500 hover:text-blue-600'
                    }`}>

                    <Bell size={24} className='m-1' />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors"
                    >
                        <UserCircle size={28} className="text-blue-800" />
                        <span className="font-semibold text-sm hidden md:block">{customerData.first_name}</span>
                        <ChevronDown
                            size={16}
                            className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {isMenuOpen && (
                    <div className="cursor-pointer absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 animate-fade-in-down z-50">
                        <div className="border-b">
                          <Link to="/customer/profile" className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-blue-50" >
                            <UserCircle size={28} className="text-blue-800" />
                            <span className="font-semibold text-sm">{customerData.first_name}</span>
                          </Link>
                        </div>
                        <div
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            <span>ออกจากระบบ</span>
                        </div>
                    </div>
                    )}
                </div>
            </div>

          </header>
          
          {/* Tablet Nav */}
          <header className='flex justify-center'>
            <div className="hidden md:flex gap-2 bg-white p-3 rounded-full m-4 shadow xl:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </header>

          {/* Mobile Nav (Dropdown style) */}
          {isNavOpen && (
            <div className="md:hidden bg-white shadow-md border-t border-slate-200 animate-fade-in-down">
              <div className="flex flex-col p-3 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setIsNavOpen(false)} // ปิดเมนูเมื่อคลิก
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // ==================== กรณีหน้าปกติ (ยังไม่ Login) ====================
        // ใช้ Code เดียวกับ Menu.tsx ที่ทำไปก่อนหน้านี้
        <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm cursor-pointer sticky top-0 z-[9999]">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/fotos/Logo.png"
              alt="logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-blue-900">1StopInsurance</span>
          </Link>

          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link to="/customer/car-insurance/insurance" className="hover:text-blue-700">ประกันรถยนต์</Link>
            <Link to="/" className="hover:text-blue-700">เกี่ยวกับเรา</Link>
            <a href="#footer" className="hover:text-blue-700">ติดต่อเรา</a>
          </nav>

          <Link to="/customer/login"
            className="border border-blue-900 text-blue-900 px-5 py-2 rounded-full font-semibold hover:bg-blue-900 hover:text-white transition">
            เข้าสู่ระบบ
          </Link>
        </header>
      )}
    </>
  );
}