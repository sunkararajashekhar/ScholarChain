export interface Course {
  code: string;
  name: string;
  grade: string;
  credits: number;
}

export enum RecordType {
  TRANSCRIPT = 'TRANSCRIPT',
  CREDENTIAL = 'CREDENTIAL'
}

export interface AcademicRecord {
  studentId: string;
  studentName: string;
  institution: string;
  program: string;
  graduationYear: number;
  gpa: number;
  courses: Course[];
  honors?: string[];
  
  // New fields for verifiable credentials & types
  type: RecordType;
  credentialName?: string; // e.g. "Bachelor of Science"
  issueDate?: number;
  issuerSignature?: string;
}

export interface Block {
  index: number;
  timestamp: number;
  data: AcademicRecord;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface ChainValidationResult {
  isValid: boolean;
  errorBlockIndex?: number;
  reason?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ADD_RECORD = 'ADD_RECORD',
  EXPLORER = 'EXPLORER',
  VERIFY = 'VERIFY',
  SIS_INTEGRATION = 'SIS_INTEGRATION',
  ISSUE_CREDENTIAL = 'ISSUE_CREDENTIAL'
}

export enum UserRole {
  REGISTRAR = 'REGISTRAR',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  institution: string;
}

export interface AIAnalysisResult {
  summary: string;
  careerPath: string[];
  strengths: string[];
}
