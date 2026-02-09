
import React, { useState, useEffect } from 'react';
import { DollarSign, Save, X, Calculator, Info } from 'lucide-react';
import { UserSettings, EarningEntry } from '../types';
import { calculateNet, formatCurrency } from '../utils/finance';

interface AddEarningsProps {
  settings: UserSettings;
  onSave: (entry: EarningEntry) => void;
  onCancel: () => void;
}

const AddEarnings: React.FC<AddEarningsProps> = ({ settings, onSave, onCancel }) => {
  const [gross, setGross] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [platformFee, setPlatformFee] = useState<string>('0');
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [net, setNet] = useState<number>(0);

  useEffect(() => {
    const g = parseFloat(gross) || 0;
    const e = parseFloat(expenses) || 0;
    const f = parseFloat(platformFee) || 0;
    setNet(calculateNet(g, e, f));
  }, [gross, expenses, platformFee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gross) return;

    const newEntry: EarningEntry = {
      id: crypto.randomUUID(),
      date,
      gross: parseFloat(gross),
      expenses: parseFloat(expenses) || 0,
      platformFeePercent: parseFloat(platformFee) || 0,
      hoursWorked: parseFloat(hours) || 0,
      net: net,
    };
    onSave(newEntry);
  };

  const isDark = settings.theme === 'dark';

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Log Earnings</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Fill in today's performance</p>
        </div>
        <button 
          onClick={onCancel}
          className={`p-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}
        >
          <X size={20} />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Net Highlight Card */}
        <div className={`p-6 rounded-2xl border-2 transition-colors ${net > 0 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'} ${isDark ? 'dark:bg-slate-800' : ''}`}>
           <div className="flex justify-between items-center mb-1">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Income Result</span>
             <Calculator size={18} className="text-emerald-500" />
           </div>
           <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
             {formatCurrency(net, settings.currency)}
           </p>
           {net > 0 && (
             <p className="text-xs text-emerald-600 mt-2 font-medium">Excellent work! This is added to your total.</p>
           )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Today's Gross Earnings</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="font-bold">{settings.currency}</span>
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={gross}
                onChange={(e) => setGross(e.target.value)}
                className={`w-full pl-8 pr-4 py-4 rounded-xl font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Expenses</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Platform Fee %</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Hours Worked</label>
              <input
                type="number"
                step="0.5"
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Work Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!gross}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
        >
          <Save size={22} />
          Save Record
        </button>
      </form>
    </div>
  );
};

export default AddEarnings;
