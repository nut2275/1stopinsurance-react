# 1StopInsurance

**🌐 เว็บไซต์ (Live Demo):** https://1stopinsurance-react.netlify.app/

โปรเจกต์นี้ประกอบด้วย 2 ส่วนคือ Backend (Node.js) และ Frontend (React)

## สิ่งที่ต้องมี (Prerequisites)
* Node.js
* MongoDB (ติดตั้งในเครื่อง หรือใช้ Cloud URI)

---

## 1. วิธีรัน Backend (Folder: 1StopInsuranceBackend)

1. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ backend:
   ```bash
   cd 1StopInsuranceBackend
ติดตั้ง dependencies:

Bash
npm install
สร้างไฟล์ .env ไว้ในโฟลเดอร์นี้ โดยกำหนดค่าดังนี้:

ข้อมูลโค้ด
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mydb
(หมายเหตุ: แก้ไข MONGO_URI ให้ตรงกับเครื่องของคุณ)

รันเซิร์ฟเวอร์:

Bash
npm run dev
## 2. วิธีรัน Frontend (Folder: 1stopinsurance-react)
เปิด Terminal ใหม่ แล้วเข้าไปที่โฟลเดอร์ frontend:

Bash
cd 1stopinsurance-react
ติดตั้ง dependencies:

Bash
npm install
สำคัญ: หากต้องการเชื่อมต่อกับ Backend ในเครื่อง (localhost) ให้แก้ไฟล์ src/services/api.tsx

เปลี่ยน baseURL เป็น http://localhost:5000

รันโปรเจกต์:

Bash
npm run dev
เว็บจะเปิดที่ http://localhost:5173 (หรือตามที่ Terminal แจ้ง)
