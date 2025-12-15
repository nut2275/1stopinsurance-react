import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom"; 
import { AxiosError } from "axios";

// ✅ ปรับ Path ให้ตรงกับโครงสร้างในภาพ
import api from "../services/api"; 
import MenuLogin from "../components/element/MenuLogin"; 

interface DecodedToken {
  username: string;
  _id: string; 
  exp?: number;
  iat?: number;
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const _id = decoded._id;
            
            localStorage.setItem("customerId", JSON.stringify(_id)); 
            localStorage.setItem("customerBuyId", _id);

            if(decoded) navigate("/customer/profile");
        } catch (error) {
            console.error("Token invalid", error);
            localStorage.clear(); 
        }
    }
  }, [navigate]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/customers/login", form);
      
      if(!res.data) {
        alert("username หรือ password ผิด");
        setLoading(false);
        return;
      }

      const { token, customer } = res.data;

      localStorage.setItem("token", token);
      
      const customerId = customer._id || customer.id; 
      if (customerId) {
          localStorage.setItem("customerBuyId", customerId);
      }

      localStorage.setItem("customer", JSON.stringify(customer));

      alert(`ยินดีต้อนรับคุณ ${customer.first_name} ${customer.last_name}`);
      
      navigate("/customer/profile");

    } 
    catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดที่ server");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">
      <MenuLogin />

      <main className="flex-grow flex justify-center items-center">
        <section className="w-full flex justify-center items-center">
          <div className="bg-white border-2 border-blue-900 rounded-xl shadow p-8 w-full max-w-md text-center">
            <h2 className="text-lg font-bold text-blue-900 mb-6">เข้าสู่ระบบสมาชิก</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="ชื่อผู้ใช้"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-blue-900 rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="รหัสผ่าน"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-blue-900 rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                disabled={loading} 
                className={`w-full text-white py-3 rounded-full font-bold transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </form>

            <Link to="/customer/register" className="block mt-2 text-blue-600 hover:underline">
                ลงทะเบียน
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
};

export default LoginForm;