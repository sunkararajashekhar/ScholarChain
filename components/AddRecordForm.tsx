import React, { useState, useRef } from 'react';
import { AcademicRecord, Course, RecordType } from '../types';
import { Plus, Trash2, Cpu, Sparkles, Loader2, FileText, UploadCloud, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { generateSampleData } from '../services/geminiService';
import { generateTemplate, parseExcel } from '../utils/excelUtils';

interface AddRecordFormProps {
  onAdd: (record: AcademicRecord) => Promise<void>;
  onBatchAdd?: (records: AcademicRecord[]) => Promise<void>;
  isMining: boolean;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({ onAdd, onBatchAdd, isMining }) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loadingSample, setLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkRecords, setBulkRecords] = useState<AcademicRecord[]>([]);
  const [parsing, setParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Single Form State
  const [formData, setFormData] = useState<AcademicRecord>({
    studentId: '',
    studentName: '',
    institution: '',
    program: '',
    graduationYear: new Date().getFullYear(),
    gpa: 4.0,
    courses: [],
    type: RecordType.TRANSCRIPT
  });

  const [newCourse, setNewCourse] = useState<Course>({
    code: '',
    name: '',
    grade: '',
    credits: 3
  });

  // --- Single Record Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' || name === 'graduationYear' ? Number(value) : value
    }));
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: name === 'credits' ? Number(value) : value
    }));
  };

  const addCourse = () => {
    if (!newCourse.code || !newCourse.name) return;
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
    setNewCourse({ code: '', name: '', grade: '', credits: 3 });
  };

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.institution) return;
    onAdd({
        ...formData,
        type: RecordType.TRANSCRIPT // Ensure type is set
    });
  };

  const handleFillSample = async () => {
    setLoadingSample(true);
    const sample = await generateSampleData();
    // Ensure AI data is compliant with new type
    setFormData({
        ...sample,
        type: RecordType.TRANSCRIPT
    });
    setLoadingSample(false);
  };

  // --- Bulk Upload Handlers ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setUploadError(null);
    try {
        const records = await parseExcel(file);
        setBulkRecords(records);
    } catch (err) {
        console.error(err);
        setUploadError("Failed to parse file. Please ensure it matches the template format.");
    } finally {
        setParsing(false);
    }
  };

  const handleBulkSubmit = async () => {
      if (bulkRecords.length === 0 || !onBatchAdd) return;
      await onBatchAdd(bulkRecords);
      setBulkRecords([]); // Clear after success
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
      
      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <FileText className="mr-2 text-brand-600" />
                Add Academic Records
            </h2>
            <p className="text-sm text-slate-500">Mine new blocks onto the ledger.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setMode('single')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Manual Entry
            </button>
            <button 
                onClick={() => setMode('bulk')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'bulk' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Bulk Upload
            </button>
        </div>
      </div>

      {/* --- SINGLE ENTRY MODE --- */}
      {mode === 'single' && (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleFillSample}
                    disabled={loadingSample || isMining}
                    className="flex items-center text-sm text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-colors border border-brand-200"
                >
                    {loadingSample ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Sparkles size={16} className="mr-2"/>}
                    Auto-Fill with AI
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Student Name</label>
                    <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="e.g. John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Student ID</label>
                    <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="e.g. 1029384"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Institution</label>
                    <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="e.g. State University"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Program / Degree</label>
                    <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="e.g. B.S. Computer Science"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">GPA</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Graduation Year</label>
                    <input
                        type="number"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                    </div>
                </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Course Transcript (Optional)</h3>
                
                <div className="flex gap-2 mb-4">
                    <input
                    placeholder="Course Code"
                    name="code"
                    value={newCourse.code}
                    onChange={handleCourseChange}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <input
                    placeholder="Course Name"
                    name="name"
                    value={newCourse.name}
                    onChange={handleCourseChange}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <input
                    placeholder="Grade"
                    name="grade"
                    value={newCourse.grade}
                    onChange={handleCourseChange}
                    className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <button
                    type="button"
                    onClick={addCourse}
                    className="bg-slate-100 text-slate-600 hover:bg-slate-200 p-2 rounded-lg transition-colors"
                    >
                    <Plus size={20} />
                    </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.courses.map((course, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                        <span className="font-mono text-slate-500 w-20">{course.code}</span>
                        <span className="flex-1 text-slate-700">{course.name}</span>
                        <span className="font-bold text-slate-800 w-12 text-center">{course.grade}</span>
                        <button type="button" onClick={() => removeCourse(idx)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                        </button>
                    </div>
                    ))}
                    {formData.courses.length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-2">No courses added yet.</p>
                    )}
                </div>
                </div>

                <button
                type="submit"
                disabled={isMining}
                className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center transition-all ${
                    isMining ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 shadow-lg shadow-brand-500/30'
                }`}
                >
                {isMining ? (
                    <>
                    <Cpu className="animate-spin mr-2" /> Mining Block...
                    </>
                ) : (
                    <>
                    <Plus className="mr-2" /> Mine & Add to Ledger
                    </>
                )}
                </button>
            </form>
        </>
      )}

      {/* --- BULK UPLOAD MODE --- */}
      {mode === 'bulk' && (
        <div className="space-y-8 animate-fadeIn">
            {/* Download Template Step */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <FileSpreadsheet className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900">1. Download Template</h3>
                        <p className="text-sm text-blue-700 mt-1">Use the standard Excel template to format your bulk data correctly.</p>
                    </div>
                </div>
                <button 
                    onClick={generateTemplate}
                    className="whitespace-nowrap flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                    <Download size={16} className="mr-2" /> Download .xlsx
                </button>
            </div>

            {/* Upload Step */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".xlsx, .xls, .csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center pointer-events-none">
                    <div className="p-4 bg-slate-200 rounded-full mb-4">
                        <UploadCloud size={32} className="text-slate-500" />
                    </div>
                    <h3 className="font-semibold text-slate-700">2. Upload Filled Template</h3>
                    <p className="text-sm text-slate-500 mt-1">Drag and drop or click to browse</p>
                    <p className="text-xs text-slate-400 mt-2">Supports .xlsx, .csv</p>
                </div>
            </div>

            {parsing && (
                <div className="text-center py-4">
                    <Loader2 className="animate-spin mx-auto text-brand-500" />
                    <p className="text-sm text-slate-500 mt-2">Parsing file...</p>
                </div>
            )}

            {uploadError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center text-red-700 text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {uploadError}
                </div>
            )}

            {/* Preview Step */}
            {bulkRecords.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="font-bold text-slate-800">3. Preview Data ({bulkRecords.length} records)</h3>
                         <button 
                            onClick={() => setBulkRecords([])}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Clear
                         </button>
                    </div>
                    
                    <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-60">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 sticky top-0">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Program</th>
                                    <th className="p-2">GPA</th>
                                    <th className="p-2">Courses</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bulkRecords.map((r, i) => (
                                    <tr key={i}>
                                        <td className="p-2">{r.studentName}</td>
                                        <td className="p-2 font-mono text-xs">{r.studentId}</td>
                                        <td className="p-2 text-xs truncate max-w-[150px]">{r.program}</td>
                                        <td className="p-2">{r.gpa}</td>
                                        <td className="p-2 text-xs text-slate-400">{r.courses.length} items</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button 
                        onClick={handleBulkSubmit}
                        disabled={isMining}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex justify-center items-center shadow-lg shadow-green-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isMining ? (
                            <>
                                <Cpu className="animate-spin mr-2" /> Mining {bulkRecords.length} Blocks...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2" /> Confirm & Mine All
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
