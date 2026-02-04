import React, { useState } from 'react';
import { Block, AIAnalysisResult, RecordType } from '../types';
import { ChevronDown, ChevronUp, Box, Clock, CheckCircle2, Bot, Loader2, Award, FileCheck, Shield } from 'lucide-react';
import { analyzeRecord } from '../services/geminiService';

interface BlockCardProps {
  block: Block;
  isLatest: boolean;
}

export const BlockCard: React.FC<BlockCardProps> = ({ block, isLatest }) => {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const isCredential = block.data.type === RecordType.CREDENTIAL;

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (analysis) return;
    
    setAnalyzing(true);
    const result = await analyzeRecord(block.data);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-slate-200 last:border-0 last:pb-0">
      {/* Connector Node */}
      <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white ${isLatest ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-slate-400'}`} />
      
      <div 
        className={`bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden 
            ${expanded ? 'shadow-lg' : 'shadow-sm hover:border-brand-300'}
            ${isCredential ? 'border-orange-200' : 'border-slate-200'}
        `}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className={`p-4 flex items-center justify-between ${isCredential ? 'bg-orange-50/50' : 'bg-slate-50/50'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCredential ? 'bg-orange-100 text-orange-600' : (isLatest ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600')}`}>
              {isCredential ? <Award size={20} /> : <Box size={20} />}
            </div>
            <div>
              <div className="flex items-center">
                  <h3 className="font-semibold text-slate-800">Block #{block.index}</h3>
                  {isCredential && <span className="ml-2 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Credential</span>}
              </div>
              <p className="text-xs text-slate-500 font-mono truncate max-w-[150px] sm:max-w-xs">{block.hash}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500 flex items-center bg-white px-2 py-1 rounded border border-slate-100">
              <Clock size={12} className="mr-1" />
              {new Date(block.timestamp).toLocaleTimeString()}
            </span>
            {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </div>
        </div>

        {/* Content */}
        {expanded && (
          <div className="p-4 border-t border-slate-100 space-y-4 animate-fadeIn">
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Previous Hash</span>
                <div className="font-mono text-xs text-slate-600 bg-slate-50 p-2 rounded break-all border border-slate-100">
                  {block.previousHash}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nonce</span>
                <div className="font-mono text-slate-700">{block.nonce}</div>
              </div>
            </div>

            {/* Record Details */}
            <div className={`rounded-lg p-4 border relative overflow-hidden ${isCredential ? 'bg-orange-50/30 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
              
              {isCredential && (
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Award size={100} />
                  </div>
              )}

              <div className="flex items-start justify-between mb-3 relative z-10">
                <h4 className="font-semibold text-slate-700 flex items-center">
                  {isCredential ? (
                      <>
                        <Shield size={16} className="mr-2 text-orange-500" />
                        Verifiable Credential
                      </>
                  ) : (
                      <>
                        <CheckCircle2 size={16} className="mr-2 text-green-500" />
                        Transcript Verified
                      </>
                  )}
                </h4>
                
                {!isCredential && (
                    <button 
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="text-xs bg-white border border-indigo-100 text-indigo-600 px-3 py-1 rounded-full flex items-center hover:bg-indigo-50 transition-colors disabled:opacity-50"
                    >
                        {analyzing ? <Loader2 size={12} className="mr-1 animate-spin" /> : <Bot size={12} className="mr-1" />}
                        {analysis ? "Re-Analyze" : "AI Insight"}
                    </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 relative z-10">
                {isCredential ? (
                    <>
                        <div className="col-span-2 pb-2 mb-2 border-b border-orange-200">
                            <p className="text-lg font-bold text-slate-800">{block.data.credentialName}</p>
                            <p className="text-xs uppercase text-slate-500 tracking-wider">Awarded by {block.data.institution}</p>
                        </div>
                        <p><span className="font-medium text-slate-500">Recipient:</span> {block.data.studentName}</p>
                        <p><span className="font-medium text-slate-500">ID:</span> {block.data.studentId}</p>
                        <p><span className="font-medium text-slate-500">Program:</span> {block.data.program}</p>
                        <p><span className="font-medium text-slate-500">Graduated:</span> {block.data.graduationYear}</p>
                        <div className="col-span-2 mt-2 pt-2 border-t border-orange-200">
                             <p className="font-mono text-[10px] text-orange-800 break-all bg-orange-100/50 p-2 rounded">
                                <span className="font-bold">Digital Signature:</span><br/>
                                {block.data.issuerSignature || 'sig_placeholder_8f7a9c2b1d3e4f5a6b7c8d9e0f1a2b3c'}
                             </p>
                        </div>
                    </>
                ) : (
                    <>
                        <p><span className="font-medium text-slate-500">Student:</span> {block.data.studentName}</p>
                        <p><span className="font-medium text-slate-500">ID:</span> {block.data.studentId}</p>
                        <p><span className="font-medium text-slate-500">Institution:</span> {block.data.institution}</p>
                        <p><span className="font-medium text-slate-500">Degree:</span> {block.data.program}</p>
                        <p><span className="font-medium text-slate-500">GPA:</span> {block.data.gpa.toFixed(2)}</p>
                        <p><span className="font-medium text-slate-500">Year:</span> {block.data.graduationYear}</p>
                    </>
                )}
              </div>

              {/* AI Analysis Section (Transcripts Only) */}
              {analysis && !isCredential && (
                  <div className="mt-4 pt-4 border-t border-indigo-100 bg-indigo-50/50 -mx-4 -mb-4 p-4 rounded-b-lg">
                      <h5 className="text-indigo-900 font-semibold text-sm mb-2 flex items-center">
                          <Bot size={14} className="mr-2" /> AI Assessment
                      </h5>
                      <p className="text-sm text-indigo-800 mb-2 italic">"{analysis.summary}"</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                          {analysis.strengths.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white text-indigo-600 text-xs rounded border border-indigo-100 shadow-sm">{s}</span>
                          ))}
                      </div>
                      
                      <div className="mt-3">
                          <span className="text-xs font-semibold text-indigo-400 uppercase">Career Matches</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                              {analysis.careerPath.map((path, i) => (
                                  <span key={i} className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded">{path}</span>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
