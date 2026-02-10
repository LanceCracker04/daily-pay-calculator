import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Briefcase, Globe } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    work: '',
    currency: 'USD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this to Firebase Firestore here
    localStorage.setItem(`profile_complete_${formData.name}`, 'true'); 
    navigate('/'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="mb-8">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-emerald-500 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">Almost there!</h2>
        <p className="text-slate-500 mb-8 font-medium">Let's set up your international profile.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><User size={18} /></div>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="John Doe" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Next Step</button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Work Type</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={(e) => setFormData({...formData, work: e.target.value})}>
                   <option>Developer</option>
                   <option>Freelancer</option>
                   <option>Nurse</option>
                   <option>Other</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Complete Setup</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;