
import React from 'react';
import { LayoutDashboard, PlusCircle, History, Settings as SettingsIcon, LogOut, Wallet } from 'lucide-react';
import { View } from '../types';
import { auth } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  isDark: boolean;
  userEmail?: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, isDark, userEmail }) => {
  const navItems: { id: View; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'add', label: 'Log', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Setup', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      auth.signOut();
    }
  };

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-100">
            <Wallet size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">Daily Pay</span>
        </div>
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden sm:inline text-xs font-medium text-slate-400 max-w-[120px] truncate">{userEmail}</span>
          )}
          <button 
            onClick={handleLogout}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        {children}
      </main>

      {/* Sticky Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} pb-safe shadow-lg z-50`}>
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive 
                    ? 'text-emerald-500' 
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <Icon size={24} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
