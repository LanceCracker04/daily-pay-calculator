
import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Clock, ChevronRight } from 'lucide-react';
import { EarningEntry, UserSettings } from '../types';
import { formatCurrency } from '../utils/finance';

interface HistoryProps {
  entries: EarningEntry[];
  settings: UserSettings;
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ entries, settings, onDelete }) => {
  const isDark = settings.theme === 'dark';
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">History</h1>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Your recent logs</p>
      </header>

      {entries.length === 0 ? (
        <div className={`p-10 text-center rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-slate-400" />
          </div>
          <p className="font-bold text-slate-400">No logs found yet.</p>
          <p className="text-xs text-slate-500 mt-1">Add your first daily earning to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEntries.map((entry) => (
            <div 
              key={entry.id}
              className={`p-4 rounded-xl shadow-sm transition-all hover:scale-[1.01] ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-sm">
                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <span>{entry.hoursWorked} hrs</span>
                    <span>•</span>
                    <span>{entry.platformFeePercent}% Fee</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(entry.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-2">
                <div className="flex gap-4">
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase font-bold">Gross</p>
                     <p className="text-sm font-semibold">{formatCurrency(entry.gross, settings.currency)}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase font-bold">Costs</p>
                     <p className="text-sm font-semibold text-amber-500">{formatCurrency(entry.expenses, settings.currency)}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Net Pay</p>
                  <p className="text-lg font-bold text-emerald-500">{formatCurrency(entry.net, settings.currency)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
