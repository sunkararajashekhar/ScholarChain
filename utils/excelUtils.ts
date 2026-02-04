import * as XLSX from 'xlsx';
import { AcademicRecord, RecordType } from '../types';

export const generateTemplate = () => {
  const headers = [
    'Student Name',
    'Student ID',
    'Institution',
    'Program',
    'GPA',
    'Graduation Year',
    'Courses (Format: Code:Name:Grade:Credits, separated by | )'
  ];

  const sampleRow = [
    'John Doe',
    '12345678',
    'State University',
    'B.S. Computer Science',
    '3.8',
    '2024',
    'CS101:Intro to CS:A:4|MA101:Calculus I:B+:3'
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, 'ScholarChain_Upload_Template.xlsx');
};

export const parseExcel = (file: File): Promise<AcademicRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Skip header row
        const rows = jsonData.slice(1) as any[][];
        
        const records: AcademicRecord[] = rows
          .filter(row => row.length > 0 && row[0]) // Basic filtering for empty rows
          .map((row) => {
            const coursesStr = row[6] ? String(row[6]) : '';
            const courses = coursesStr.split('|').map(c => {
                const parts = c.split(':');
                if (parts.length < 3) return null;
                return {
                    code: parts[0]?.trim(),
                    name: parts[1]?.trim() || 'Unknown Course',
                    grade: parts[2]?.trim(),
                    credits: Number(parts[3]) || 3
                };
            }).filter(c => c !== null) as any[];

            return {
              studentName: String(row[0]),
              studentId: String(row[1]),
              institution: String(row[2]),
              program: String(row[3]),
              gpa: Number(row[4]),
              graduationYear: Number(row[5]),
              courses: courses,
              type: RecordType.TRANSCRIPT
            };
          });

        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
