
import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  Target, 
  AlertCircle,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { EarningEntry, UserSettings } from '../types';
import { getStatistics, formatCurrency } from '../utils/finance';

interface DashboardProps {
  entries: EarningEntry[];
  settings: UserSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, settings }) => {
  const stats = getStatistics(entries, settings);
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Last 7 days chart data
  const chartData = sortedEntries.slice(-7).map(entry => ({
    name: new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' }),
    net: entry.net,
  }));

  const isDark = settings.theme === 'dark';

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Welcome back, freelancer</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-emerald-500 font-semibold">
            <span className="text-2xl">{stats.healthScore}</span>
            <span className="text-xs">/100</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Health Score</p>
        </div>
      </header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2 text-emerald-500">
            <Wallet size={16} />
            <span className="text-xs font-bold uppercase tracking-tight">Today's Net</span>
          </div>
          <p className="text-xl font-bold">
            {formatCurrency(entries[entries.length - 1]?.net || 0, settings.currency)}
          </p>
        </div>
        <div className={`p-4 rounded-2xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2 text-blue-500">
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase tracking-tight">Monthly Est.</span>
          </div>
          <p className="text-xl font-bold">
            {formatCurrency(stats.monthlyProjection, settings.currency)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className={`p-4 rounded-2xl shadow-sm h-64 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            7-Day Trend
          </h3>
        </div>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff', 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="net" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorNet)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="space-y-3">
        {/* Daily Average */}
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Target size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Average Daily</p>
              <p className="font-bold">{formatCurrency(stats.avgDailyNet, settings.currency)}</p>
            </div>
          </div>
          <div className="text-right">
             <span className={`text-xs px-2 py-1 rounded-full font-bold ${stats.avgDailyNet >= settings.dailyGoal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {Math.round((stats.avgDailyNet / settings.dailyGoal) * 100)}% of Goal
             </span>
          </div>
        </div>

        {/* Savings & Tax */}
        <div className={`p-4 rounded-xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs text-slate-400 font-medium">Savings Target ({settings.savingsTargetPercent}%)</p>
              <p className="font-bold">{formatCurrency(stats.savingsTarget, settings.currency)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Est. Tax ({settings.taxPercent}%)</p>
              <p className="font-bold text-rose-500">-{formatCurrency((stats.totalNet * settings.taxPercent) / 100, settings.currency)}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (stats.healthScore))}%` }}
            />
          </div>
        </div>

        {/* Burn Rate */}
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.burnRate > 30 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Expense Burn Rate</p>
              <p className="font-bold">{stats.burnRate.toFixed(1)}%</p>
            </div>
          </div>
          <ArrowUpRight size={20} className={stats.burnRate > 30 ? 'text-rose-500' : 'text-emerald-500'} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
