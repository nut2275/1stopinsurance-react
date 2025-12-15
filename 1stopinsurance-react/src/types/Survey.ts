// src/types/Survey.ts

// Type สำหรับคำตอบ (สามารถรวม undefined ได้ เพื่อใช้ในการกำหนด State เริ่มต้น)
export type Budget = 'low' | 'mid-low' | 'mid' | 'high' | undefined;
export type Repair = 'ศูนย์' | 'อู่' | 'both' | undefined;
export type Coverage = 'all' | 'car' | 'fire' | 'basic'; // Checkbox ไม่ควรมี undefined เพราะเป็น Array
export type Usage = 'low' | 'mid' | 'high' | undefined;
export type Accident = 'never' | 'rare' | 'sometimes' | 'often' | undefined;

// Interface หลักสำหรับจัดเก็บคำตอบทั้งหมด
export interface InsuranceAnswers {
    budget: Budget;
    repair: Repair;
    coverage: Coverage[];
    usage: Usage;
    accident: Accident;
}

// State เริ่มต้นสำหรับ Component (ใช้ในการเรียกใช้ useState ใน SurveyForm)
export const initialAnswers: InsuranceAnswers = {
    budget: undefined,
    repair: undefined,
    coverage: [],
    usage: undefined,
    accident: undefined,
};