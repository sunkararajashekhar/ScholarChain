import React, { useState, useEffect } from 'react';
import { AppView, Block, AcademicRecord, ChainValidationResult, User, UserRole, RecordType } from './types';
import { createGenesisBlock, mineBlock, validateChain, generateSignature } from './utils/cryptoUtils';
import { BlockCard } from './components/BlockCard';
import { AddRecordForm } from './components/AddRecordForm';
import { LoginScreen } from './components/LoginScreen';
import { SISIntegration } from './components/SISIntegration';
import { IssueCredential } from './components/IssueCredential';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  AlertTriangle,
  Database,
  Link as LinkIcon,
  CheckCircle2,
  Server,
  Award,
  LogOut,
  User as UserIcon,
  BookOpen
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chain, setChain] = useState<Block[]>([]);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isMining, setIsMining] = useState(false);
  const [validationResult, setValidationResult] = useState<ChainValidationResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize chain on mount
  useEffect(() => {
    const init = async () => {
      const genesis = await createGenesisBlock();
      setChain([genesis]);
    };
    init();
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddRecord = async (record: AcademicRecord) => {
    setIsMining(true);
    // Simulate mining delay visually
    await new Promise(r => setTimeout(r, 800)); 

    try {
      // If credential, sign it
      if (record.type === RecordType.CREDENTIAL) {
        const sig = await generateSignature(record, "INSTITUTION_SECRET_KEY");
        record.issuerSignature = sig;
      }

      const previousBlock = chain[chain.length - 1];
      const newIndex = previousBlock.index + 1;
      const newBlock = await mineBlock(newIndex, previousBlock.hash, record);
      
      setChain(prev => [...prev, newBlock]);
      setView(AppView.EXPLORER);
    } catch (error) {
      console.error("Mining failed", error);
    } finally {
      setIsMining(false);
    }
  };

  const handleBatchAdd = async (records: AcademicRecord[]) => {
    setIsMining(true);
    const newBlocks: Block[] = [];
    let previousBlock = chain[chain.length - 1];

    try {
        for (const record of records) {
             const newIndex = previousBlock.index + 1;
             const newBlock = await mineBlock(newIndex, previousBlock.hash, record);
             newBlocks.push(newBlock);
             previousBlock = newBlock;
        }
        setChain(prev => [...prev, ...newBlocks]);
        setView(AppView.EXPLORER);
    } catch (e) {
        console.error("Batch mining failed", e);
    } finally {
        setIsMining(false);
    }
  };

  const handleVerifyChain = async () => {
    setValidationResult(null);
    const result = await validateChain(chain);
    // Simulate processing time
    setTimeout(() => {
        setValidationResult(result);
    }, 1000);
  };

  // Filter Chain logic
  const filteredChain = chain.filter(block => 
    block.hash.includes(searchTerm) || 
    block.data.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.data.studentId.includes(searchTerm)
  );

  // If not logged in, show login screen
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- RBAC PERMISSIONS ---
  const isRegistrar = user.role === UserRole.REGISTRAR;
  const isInstructor = user.role === UserRole.INSTRUCTOR;
  
  // Feature flags based on roles
  const canAddTranscript = isRegistrar || isInstructor; // Instructors can submit grades
  const canIssueCredential = isRegistrar; // Only Registrars can issue Degrees/Diplomas
  const canSyncSIS = isRegistrar; // Only Registrars can access database bridges
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white">
            <GraduationCap size={28} className="text-brand-400" />
            <span className="text-xl font-bold tracking-tight">ScholarChain</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Decentralized Academic Ledger</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === AppView.DASHBOARD ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setView(AppView.EXPLORER)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === AppView.EXPLORER ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'}`}
          >
            <Database size={20} />
            <span className="font-medium">Block Explorer</span>
          </button>

          {/* Academic Actions */}
          {(canAddTranscript || canIssueCredential) && (
             <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
               Academic Management
             </div>
          )}

          {canAddTranscript && (
            <button 
                onClick={() => setView(AppView.ADD_RECORD)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === AppView.ADD_RECORD ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'}`}
            >
                <PlusCircle size={20} />
                <span className="font-medium">Add Transcript</span>
            </button>
          )}

          {canIssueCredential && (
            <button 
                onClick={() => setView(AppView.ISSUE_CREDENTIAL)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === AppView.ISSUE_CREDENTIAL ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'}`}
            >
                <Award size={20} />
                <span className="font-medium">Issue Credential</span>
            </button>
          )}

          {/* Admin Tools */}
          {canSyncSIS && (
            <>
                <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    System Admin
                </div>
                <button 
                    onClick={() => setView(AppView.SIS_INTEGRATION)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === AppView.SIS_INTEGRATION ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'}`}
                >
                    <Server size={20} />
                    <span className="font-medium">SIS Bridge</span>
                </button>
            </>
          )}

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
             Network
          </div>

          <button 
            onClick={() => setView(AppView.VERIFY)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === AppView.VERIFY ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'}`}
          >
            <ShieldCheck size={20} />
            <span className="font-medium">Verify Integrity</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                        <UserIcon size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-white transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
          <div className="text-xs text-slate-500">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Network Status: Active
            </div>
            <p>Height: {chain.length} Blocks</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header Mobile only mostly */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between md:hidden">
            <span className="font-bold text-slate-800">ScholarChain</span>
            <button onClick={handleLogout}><LogOut size={20}/></button>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          
          {/* Dashboard View */}
          {view === AppView.DASHBOARD && (
            <div className="space-y-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
                <p className="text-slate-500 mt-2 flex items-center">
                    {user.role === UserRole.STUDENT && "View your academic achievements securely on the blockchain."}
                    {user.role === UserRole.INSTRUCTOR && "Submit course grades and verify student transcripts."}
                    {user.role === UserRole.REGISTRAR && "Manage institutional records and issue official credentials."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium">Ledger Height</h3>
                    <Database className="text-brand-500" />
                  </div>
                  <p className="text-4xl font-bold text-slate-800">{chain.length}</p>
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></span> Synced
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium">Latest Hash</h3>
                    <LinkIcon className="text-purple-500" />
                  </div>
                  <p className="text-sm font-mono text-slate-600 break-all bg-slate-50 p-2 rounded">
                    {chain[chain.length - 1]?.hash || 'Loading...'}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium">Identity Status</h3>
                    <ShieldCheck className="text-orange-500" />
                  </div>
                  <div className="flex items-center">
                      <div className="mr-3">
                        <p className="text-xl font-bold text-slate-800 capitalize">{user.role.toLowerCase()}</p>
                        <p className="text-xs text-slate-500">{user.institution}</p>
                      </div>
                      <div className="ml-auto px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-mono">
                          {user.id.substring(0,8)}...
                      </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4">Recent Network Activity</h3>
                <div className="space-y-4">
                    {chain.slice().reverse().slice(0, 5).map((block) => (
                        <div key={block.hash} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border-b last:border-0 border-slate-100">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded font-mono text-sm ${block.data.type === RecordType.CREDENTIAL ? 'bg-orange-100 text-orange-600' : 'bg-brand-100 text-brand-600'}`}>#{block.index}</div>
                                <div>
                                    <div className="flex items-center">
                                        <p className="font-medium text-slate-800">{block.data.studentName}</p>
                                        {block.data.type === RecordType.CREDENTIAL && <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded uppercase font-bold">Credential</span>}
                                    </div>
                                    <p className="text-xs text-slate-500">{block.data.program}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-mono">{new Date(block.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Explorer View - Accessible to All */}
          {view === AppView.EXPLORER && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Block Explorer</h1>
                    <p className="text-slate-500">Inspect the immutable ledger of academic records.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search hash, name, ID..." 
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              </div>

              <div className="space-y-0">
                {filteredChain.map((block, idx) => (
                  <BlockCard 
                    key={block.hash} 
                    block={block} 
                    isLatest={idx === chain.length - 1} 
                  />
                ))}
                {filteredChain.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Search size={48} className="mx-auto mb-4 opacity-20"/>
                        <p>No blocks found matching your search.</p>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* Add Record View - Instructor & Registrar Only */}
          {view === AppView.ADD_RECORD && canAddTranscript ? (
            <div>
              <AddRecordForm onAdd={handleAddRecord} onBatchAdd={handleBatchAdd} isMining={isMining} />
            </div>
          ) : view === AppView.ADD_RECORD ? (
            <div className="text-center py-20">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
                <p className="text-slate-500">You do not have permission to add transcripts.</p>
            </div>
          ) : null}

          {/* Issue Credential View - Registrar Only */}
          {view === AppView.ISSUE_CREDENTIAL && canIssueCredential ? (
            <div>
                <IssueCredential onIssue={handleAddRecord} institution={user.institution} />
            </div>
          ) : view === AppView.ISSUE_CREDENTIAL ? (
            <div className="text-center py-20">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
                <p className="text-slate-500">Only Registrars can issue credentials.</p>
            </div>
          ) : null}

          {/* SIS Integration View - Registrar Only */}
          {view === AppView.SIS_INTEGRATION && canSyncSIS ? (
            <div>
                <SISIntegration onBatchAdd={handleBatchAdd} institution={user.institution} />
            </div>
          ) : view === AppView.SIS_INTEGRATION ? (
            <div className="text-center py-20">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
                <p className="text-slate-500">System administration privileges required.</p>
            </div>
          ) : null}

          {/* Verify View - Accessible to All */}
          {view === AppView.VERIFY && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-full mb-4">
                    <ShieldCheck size={48} className="text-brand-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Ledger Integrity Check</h1>
                <p className="text-slate-500 mt-2">Cryptographically verify that no records have been altered.</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                <button 
                    onClick={handleVerifyChain}
                    className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center mx-auto"
                >
                    Run Full Chain Validation
                </button>

                {validationResult && (
                    <div className={`mt-8 p-4 rounded-lg border flex items-start text-left ${validationResult.isValid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {validationResult.isValid ? (
                            <>
                                <CheckCircle2 className="flex-shrink-0 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-bold">Verification Successful</p>
                                    <p className="text-sm mt-1 text-green-700">All {chain.length} blocks are valid. The chain is intact and untampered.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="flex-shrink-0 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-bold">Verification Failed</p>
                                    <p className="text-sm mt-1 text-red-700">Error at Block #{validationResult.errorBlockIndex}: {validationResult.reason}. The ledger may be compromised.</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {!validationResult && chain.length > 0 && (
                    <p className="mt-6 text-xs text-slate-400">
                        This process recalculates the SHA-256 hash for every block and ensures the previous hash pointers align perfectly.
                    </p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;