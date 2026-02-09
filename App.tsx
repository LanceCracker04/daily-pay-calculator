
import React, { useState, useEffect } from 'react';
import { View, EarningEntry, UserSettings } from './types';
import { DEFAULT_SETTINGS, LOCAL_STORAGE_ENTRIES_KEY, LOCAL_STORAGE_SETTINGS_KEY } from './constants';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddEarnings from './pages/AddEarnings';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [entries, setEntries] = useState<EarningEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      // Reset view and loading state when user changes
      if (!currentUser) {
        setIsDataLoaded(false);
        setEntries([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load user-specific data from localStorage
  useEffect(() => {
    if (user) {
      const userEntriesKey = `${LOCAL_STORAGE_ENTRIES_KEY}_${user.uid}`;
      const userSettingsKey = `${LOCAL_STORAGE_SETTINGS_KEY}_${user.uid}`;
      
      const savedEntries = localStorage.getItem(userEntriesKey);
      const savedSettings = localStorage.getItem(userSettingsKey);

      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      } else {
        setEntries([]); // Clear for new user if no history
      }

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      
      setIsDataLoaded(true);
    }
  }, [user]);

  // Sync to user-specific localStorage
  useEffect(() => {
    if (user && isDataLoaded) {
      const userEntriesKey = `${LOCAL_STORAGE_ENTRIES_KEY}_${user.uid}`;
      const userSettingsKey = `${LOCAL_STORAGE_SETTINGS_KEY}_${user.uid}`;
      
      localStorage.setItem(userEntriesKey, JSON.stringify(entries));
      localStorage.setItem(userSettingsKey, JSON.stringify(settings));
    }
  }, [entries, settings, user, isDataLoaded]);

  const handleSaveEntry = (entry: EarningEntry) => {
    setEntries(prev => [...prev, entry]);
    setActiveView('dashboard');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleClearData = () => {
    if (user) {
      const userEntriesKey = `${LOCAL_STORAGE_ENTRIES_KEY}_${user.uid}`;
      setEntries([]);
      localStorage.removeItem(userEntriesKey);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Daily Pay</span>
        </div>
      </div>
    );
  }

  // If not logged in, show Login page
  if (!user) {
    return <Login />;
  }

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView} 
      isDark={settings.theme === 'dark'}
      userEmail={user.email}
    >
      {activeView === 'dashboard' && (
        <Dashboard entries={entries} settings={settings} />
      )}
      {activeView === 'add' && (
        <AddEarnings 
          settings={settings} 
          onSave={handleSaveEntry} 
          onCancel={() => setActiveView('dashboard')} 
        />
      )}
      {activeView === 'history' && (
        <History 
          entries={entries} 
          settings={settings} 
          onDelete={handleDeleteEntry} 
        />
      )}
      {activeView === 'settings' && (
        <Settings 
          settings={settings} 
          onUpdate={setSettings} 
          onClearData={handleClearData} 
        />
      )}
    </Layout>
  );
};

export default App;
