import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Download, 
  Eye, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileSearch
} from "lucide-react"; // ใช้ Lucide แทน FontAwesome เพื่อความทันสมัย
import useSWR from "swr";
import api from "../services/api";

const fetcher = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};

type DocConfig = {
  label: string;
  key: string;
  file?: string;
  downloadName: string;
};

export default function PurchaseDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    id ? `/purchase/${id}/documents` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">กำลังจัดเตรียมเอกสารของคุณ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">เกิดข้อผิดพลาดในการดึงข้อมูล</h2>
        <p className="text-gray-500 mb-6">ไม่พบข้อมูลเอกสารในระบบ หรือการเชื่อมต่อล้มเหลว</p>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold">กลับไปหน้าเดิม</button>
      </div>
    );
  }

  const documents: DocConfig[] = [
    { label: "สำเนาบัตรประชาชน", key: "citizenCardImage", file: data?.citizenCardImage, downloadName: "สำเนาบัตรประชาชน" },
    { label: "สำเนาทะเบียนรถ", key: "carRegistrationImage", file: data?.carRegistrationImage, downloadName: "สำเนาทะเบียนรถ" },
    { label: "กรมธรรม์ประกันภัย", key: "policyDocumentImage", file: data?.policyDocumentImage, downloadName: "กรมธรรม์" },
    { label: "หลักฐานการชำระเงิน", key: "paymentSlipImage", file: data?.paymentSlipImage, downloadName: "หลักฐานการโอนเงิน" },
  ];

  const isPdf = (url?: string) => url?.toLowerCase().includes(".pdf");
  const getFileName = (name: string, url?: string) => {
    if (!url) return "";
    const ext = url.split(".").pop();
    return `${name}.${ext}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            กลับหน้าโปรไฟล์
          </button>
          <h1 className="text-slate-800 font-bold text-base sm:text-lg">จัดการเอกสาร</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">เอกสารประกอบการซื้อ</h2>
          <p className="text-slate-500">ตรวจสอบและดาวน์โหลดเอกสารสำคัญสำหรับการทำประกันภัยของคุณ</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
            >
              {/* Card Header & Preview */}
              <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden flex items-center justify-center border-b border-slate-100">
                {doc.file ? (
                  <>
                    {isPdf(doc.file) ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-2">
                          <FileText className="text-red-500 w-10 h-10" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PDF Document</span>
                      </div>
                    ) : (
                      <img src={doc.file} alt={doc.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <CheckCircle2 size={16} />
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center px-6 text-center">
                    <FileSearch className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-400">ยังไม่ได้อัปโหลด</p>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4 line-clamp-1">{doc.label}</h3>
                
                <div className="mt-auto space-y-2">
                  <button
                    disabled={!doc.file}
                    onClick={() => doc.file && setPreviewFile(doc.file)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${doc.file
                        ? "bg-slate-900 text-white hover:bg-blue-600"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    <Eye size={16} />
                    ดูตัวอย่าง
                  </button>

                  <a
                    href={doc.file || "#"}
                    download={getFileName(doc.downloadName, doc.file)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
                      ${doc.file
                        ? "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        : "border-slate-100 text-slate-300 pointer-events-none"
                      }`}
                  >
                    <Download size={16} />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modern MODAL Preview */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setPreviewFile(null)}></div>
          
          <div className="relative w-full max-w-5xl h-full sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
              <span className="font-bold text-slate-800">พรีวิวเอกสาร</span>
              <button 
                onClick={() => setPreviewFile(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-auto bg-slate-50 relative p-4 sm:p-8 flex items-center justify-center">
              {isPdf(previewFile) ? (
                <iframe src={previewFile} className="w-full h-full rounded-lg shadow-inner" title="PDF Preview" />
              ) : (
                <img src={previewFile} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Full Preview" />
              )}
              
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <p className="text-slate-400/20 font-black text-5xl md:text-8xl -rotate-45 select-none whitespace-nowrap">
                  ONE STOP INSURANCE
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}