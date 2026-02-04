import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { GraduationCap, Lock, Mail, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    
    // Simulate API Auth Request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user generation based on role and email input
    const mockUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), // Use email name part
      role: role,
      institution: 'State University'
    };
    
    setLoading(false);
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-8 text-center border-b border-slate-700">
          <div className="inline-flex items-center justify-center p-3 bg-brand-500/10 rounded-full mb-4 ring-1 ring-brand-500/30">
             <GraduationCap size={32} className="text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ScholarChain</h1>
          <p className="text-slate-400 text-sm mt-1">Decentralized Academic Identity</p>
        </div>

        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Role Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {[UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.REGISTRAR].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
                                role === r 
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {r.charAt(0) + r.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                placeholder="name@institution.edu"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center text-slate-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mr-2" />
                        Remember me
                    </label>
                    <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">Forgot password?</a>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Authenticating...
                        </>
                    ) : (
                        <>
                            Sign In <ArrowRight className="ml-2" size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                    Don't have an institutional account? <a href="#" className="text-brand-600 font-medium hover:underline">Contact Admin</a>
                </p>
            </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 text-slate-500 text-xs">
         &copy; 2024 ScholarChain Network. Secure Login.
      </div>
    </div>
  );
};
