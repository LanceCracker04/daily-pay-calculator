
import React from 'react';
import { 
  Moon, 
  Sun, 
  LogOut,
  Info,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { UserSettings } from '../types';
import { auth } from '../firebase';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onClearData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onClearData }) => {
  const isDark = settings.theme === 'dark';
  const currentUser = auth.currentUser;

  const handleChange = (key: keyof UserSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Customize your preferences</p>
      </header>

      <div className="space-y-4">
        {/* User Profile */}
        <section className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             Profile
           </h3>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="font-bold text-sm truncate max-w-[200px]">{currentUser?.email || 'User'}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase">
                  <ShieldCheck size={10} />
                  <span>Secure Account</span>
                </div>
              </div>
           </div>
        </section>

        {/* Appearance */}
        <section className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             Appearance
           </h3>
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
               {isDark ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
               <span className="font-semibold">Dark Mode</span>
             </div>
             <button 
               onClick={() => handleChange('theme', isDark ? 'light' : 'dark')}
               className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-emerald-500' : 'bg-slate-200'}`}
             >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
             </button>
           </div>
        </section>

        {/* Financial Setup */}
        <section className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             Financial Setup
           </h3>
           
           <div className="space-y-4">
             <div>
               <label className="flex items-center justify-between text-sm font-semibold mb-2">
                 <span>Currency Symbol</span>
                 <span className="text-slate-400">{settings.currency}</span>
               </label>
               <div className="grid grid-cols-4 gap-2">
                 {['$', '£', '€', '¥'].map(symbol => (
                   <button
                     key={symbol}
                     onClick={() => handleChange('currency', symbol)}
                     className={`py-2 rounded-lg font-bold border-2 transition-all ${settings.currency === symbol ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                   >
                     {symbol}
                   </button>
                 ))}
               </div>
             </div>

             <div>
                <label className="flex items-center justify-between text-sm font-semibold mb-2">
                  <span>Daily Earnings Goal</span>
                  <span className="text-emerald-500 font-bold">{settings.currency}{settings.dailyGoal}</span>
                </label>
                <input 
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={settings.dailyGoal}
                  onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Savings Target %</label>
                   <input 
                      type="number"
                      value={settings.savingsTargetPercent}
                      onChange={(e) => handleChange('savingsTargetPercent', parseInt(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Estimated Tax %</label>
                   <input 
                      type="number"
                      value={settings.taxPercent}
                      onChange={(e) => handleChange('taxPercent', parseInt(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}
                   />
                </div>
             </div>
           </div>
        </section>

        {/* Data Management */}
        <section className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             Privacy & Data
           </h3>
           <div className="space-y-3">
             <button 
               onClick={() => {
                 if(window.confirm('Are you sure? This will delete all logs associated with this account.')) {
                   onClearData();
                 }
               }}
               className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-500 font-bold hover:bg-rose-100 transition-colors text-sm"
             >
               Delete All History
             </button>
             <button 
               onClick={() => auth.signOut()}
               className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors text-sm ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}
             >
               <LogOut size={18} />
               Sign Out
             </button>
           </div>
           <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1 leading-tight">
             <Info size={10} /> Data is linked to your unique user ID and stored on this device.
           </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
