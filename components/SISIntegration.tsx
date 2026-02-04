import React, { useState } from 'react';
import { AcademicRecord, RecordType } from '../types';
import { Server, ArrowRight, Database, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';

interface SISIntegrationProps {
  onBatchAdd: (records: AcademicRecord[]) => Promise<void>;
  institution: string;
}

const MOCK_SIS_DATA: AcademicRecord[] = [
    {
        studentId: "2024-001",
        studentName: "Michael Chang",
        institution: "State University",
        program: "B.S. Mathematics",
        graduationYear: 2025,
        gpa: 3.9,
        courses: [
            { code: "MAT301", name: "Abstract Algebra", grade: "A", credits: 4 },
            { code: "CS201", name: "Data Structures", grade: "A-", credits: 4 }
        ],
        type: RecordType.TRANSCRIPT
    },
    {
        studentId: "2024-042",
        studentName: "Sarah Connor",
        institution: "State University",
        program: "B.A. History",
        graduationYear: 2024,
        gpa: 3.6,
        courses: [
            { code: "HIS400", name: "Modern European History", grade: "B+", credits: 3 },
            { code: "ART101", name: "Art History I", grade: "A", credits: 3 }
        ],
        type: RecordType.TRANSCRIPT
    },
    {
        studentId: "2024-089",
        studentName: "James T. Kirk",
        institution: "State University",
        program: "B.S. Aerospace Engineering",
        graduationYear: 2025,
        gpa: 3.2,
        courses: [
            { code: "ENG305", name: "Propulsion Systems", grade: "B", credits: 4 },
            { code: "PHY201", name: "Quantum Mechanics", grade: "B-", credits: 4 }
        ],
        type: RecordType.TRANSCRIPT
    }
];

export const SISIntegration: React.FC<SISIntegrationProps> = ({ onBatchAdd, institution }) => {
    const [fetched, setFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [records, setRecords] = useState<AcademicRecord[]>([]);

    const handleFetch = () => {
        setLoading(true);
        // Simulate API call to Legacy SIS
        setTimeout(() => {
            const mappedRecords = MOCK_SIS_DATA.map(r => ({...r, institution}));
            setRecords(mappedRecords);
            setSelectedRecords(mappedRecords.map(r => r.studentId));
            setFetched(true);
            setLoading(false);
        }, 1500);
    };

    const toggleSelection = (id: string) => {
        if (selectedRecords.includes(id)) {
            setSelectedRecords(selectedRecords.filter(rid => rid !== id));
        } else {
            setSelectedRecords([...selectedRecords, id]);
        }
    };

    const handleSync = async () => {
        if (selectedRecords.length === 0) return;
        setSyncing(true);
        const recordsToSync = records.filter(r => selectedRecords.includes(r.studentId));
        await onBatchAdd(recordsToSync);
        setSyncing(false);
        setFetched(false); // Reset view
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Server className="mr-2 text-brand-600" /> SIS Integration Bridge
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Connect to legacy Student Information Systems for automated data transfer.</p>
                </div>
                {!fetched && (
                    <button 
                        onClick={handleFetch}
                        disabled={loading}
                        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <RefreshCw className="mr-2" size={16} />}
                        Fetch New Records
                    </button>
                )}
            </div>

            {loading && (
                <div className="p-12 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <Database size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-500">Querying Oracle Database (Port 1521)...</p>
                    </div>
                </div>
            )}

            {!loading && fetched && (
                <div className="p-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start">
                        <CheckCircle className="text-blue-500 mt-0.5 mr-3" size={20} />
                        <div>
                            <h4 className="font-semibold text-blue-800">Data Retrieved Successfully</h4>
                            <p className="text-sm text-blue-600">Found {records.length} pending academic updates ready for blockchain commitment.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="p-3 w-10">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRecords.length === records.length}
                                            onChange={() => {
                                                if (selectedRecords.length === records.length) setSelectedRecords([]);
                                                else setSelectedRecords(records.map(r => r.studentId));
                                            }}
                                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                    </th>
                                    <th className="p-3">Student ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Program</th>
                                    <th className="p-3">Courses Updated</th>
                                    <th className="p-3">GPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {records.map(record => (
                                    <tr key={record.studentId} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRecords.includes(record.studentId)}
                                                onChange={() => toggleSelection(record.studentId)}
                                                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                            />
                                        </td>
                                        <td className="p-3 font-mono text-slate-600">{record.studentId}</td>
                                        <td className="p-3 font-medium text-slate-900">{record.studentName}</td>
                                        <td className="p-3 text-slate-600">{record.program}</td>
                                        <td className="p-3 text-slate-600">{record.courses.map(c => c.code).join(", ")}</td>
                                        <td className="p-3 font-bold text-slate-700">{record.gpa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleSync}
                            disabled={syncing || selectedRecords.length === 0}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center shadow-lg shadow-green-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {syncing ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Encrypting & Mining...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="mr-2" />
                                    Sync {selectedRecords.length} Records to Blockchain
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            {!loading && !fetched && (
                <div className="p-12 text-center text-slate-400">
                    <p>No active connection. Click "Fetch New Records" to query the SIS.</p>
                </div>
            )}
        </div>
    );
};
