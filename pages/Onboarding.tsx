import React, { useState } from 'react';
import { User, Calendar, Briefcase, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    work: 'Freelancer'
  });

  const workOptions = ['Developer', 'Designer', 'Freelancer', 'Virtual Assistant', 'Student', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we save to local storage so the app remembers you're done
    localStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Personalize your Profile</h2>
        <p className="text-slate-500 mb-8 font-medium">Tell us a bit about yourself to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><User size={18} /></div>
              <input 
                type="text" required placeholder="Erwin"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Calendar size={18} /></div>
              <input 
                type="number" required placeholder="25"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
          </div>

          {/* Work Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Occupation</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Briefcase size={18} /></div>
              <select 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none"
                value={formData.work}
                onChange={(e) => setFormData({...formData, work: e.target.value})}
              >
                {workOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-4"
          >
            Go to Dashboard <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;