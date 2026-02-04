import React, { useState } from 'react';
import { AcademicRecord, RecordType } from '../types';
import { Award, PenTool, Stamp, Loader2 } from 'lucide-react';

interface IssueCredentialProps {
  onIssue: (record: AcademicRecord) => Promise<void>;
  institution: string;
}

export const IssueCredential: React.FC<IssueCredentialProps> = ({ onIssue, institution }) => {
  const [isIssuing, setIsIssuing] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    program: '',
    credentialName: 'Bachelor of Science',
    gpa: 4.0,
    graduationYear: new Date().getFullYear(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);

    const newCredential: AcademicRecord = {
        studentId: formData.studentId,
        studentName: formData.studentName,
        institution: institution,
        program: formData.program,
        graduationYear: formData.graduationYear,
        gpa: formData.gpa,
        courses: [], // Credentials might not list all courses, or could be empty
        type: RecordType.CREDENTIAL,
        credentialName: formData.credentialName,
        issueDate: Date.now()
    };

    await onIssue(newCredential);
    setIsIssuing(false);
    // Reset form
    setFormData({
        studentName: '',
        studentId: '',
        program: '',
        credentialName: 'Bachelor of Science',
        gpa: 4.0,
        graduationYear: new Date().getFullYear(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <PenTool size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Issue Credential</h2>
                    <p className="text-sm text-slate-500">Create a cryptographically signed degree.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student Full Name</label>
                    <input 
                        required
                        type="text" 
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                        placeholder="e.g. Jane Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                    <input 
                        required
                        type="text" 
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                        placeholder="e.g. 88120392"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Credential Title</label>
                    <select 
                        name="credentialName"
                        value={formData.credentialName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option>Bachelor of Science</option>
                        <option>Bachelor of Arts</option>
                        <option>Master of Science</option>
                        <option>Master of Business Administration</option>
                        <option>Doctor of Philosophy</option>
                        <option>Associate Degree</option>
                        <option>Professional Certificate</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Major</label>
                    <input 
                        required
                        type="text" 
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                        placeholder="e.g. Computer Science"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Final GPA</label>
                        <input 
                            required
                            type="number" 
                            step="0.01"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                        <input 
                            required
                            type="number" 
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isIssuing}
                    className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20 flex justify-center items-center"
                >
                    {isIssuing ? <Loader2 className="animate-spin mr-2"/> : <Stamp className="mr-2" size={18} />}
                    Sign & Issue to Blockchain
                </button>
            </form>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Live Credential Preview</h3>
            
            <div className="relative bg-[#fffdf0] border-[12px] border-double border-slate-800 p-8 shadow-2xl text-center font-serif text-slate-900 aspect-[1.414/1]">
                {/* Decorative corner elements could go here */}
                
                <div className="h-full flex flex-col justify-between border border-orange-200 p-4">
                    <div className="space-y-4">
                        <div className="flex justify-center mb-2">
                             <Award size={48} className="text-slate-800" />
                        </div>
                        <h1 className="text-2xl font-bold uppercase tracking-widest">{institution || 'Institution Name'}</h1>
                        <p className="text-xs uppercase tracking-widest text-slate-500">Upon recommendation of the faculty</p>
                    </div>

                    <div className="py-6">
                        <p className="italic text-slate-600">has conferred upon</p>
                        <h2 className="text-3xl font-bold text-brand-900 my-4 font-sans">{formData.studentName || 'Student Name'}</h2>
                        <p className="italic text-slate-600">the degree of</p>
                        <h3 className="text-xl font-bold mt-2">{formData.credentialName}</h3>
                        <p className="text-lg">in {formData.program || 'Major'}</p>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-300">
                        <div className="text-center">
                            <div className="w-32 border-b border-slate-400 mb-1"></div>
                            <p className="text-[10px] uppercase">President</p>
                        </div>
                        <div className="mb-2">
                            <div className="w-16 h-16 rounded-full border-2 border-orange-300 flex items-center justify-center mx-auto opacity-50">
                                <Stamp size={32} className="text-orange-300" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="w-32 border-b border-slate-400 mb-1"></div>
                            <p className="text-[10px] uppercase">Registrar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
