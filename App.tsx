import { BrowserRouter as Router } from 'react-router-dom';
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
import Onboarding from './pages/Onboarding';
import { onAuthStateChanged, User } from 'firebase/auth';
// Fix for the final error:
import { Loader2 } from 'lucide-react';

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
        setEntries([]); 
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

  // UI: Show a loading screen while Firebase checks if you're logged in
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Daily Pay</span>
        </div>
      </div>
    );
  }

// RETURN 1: The Waiter (Loading State)
  // This is already in your code near line 92
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Daily Pay</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        /* 1. Login Page: Completely isolated, no sidebar */
        <Login />
      ) : !isDataLoaded ? (
        /* 2. Onboarding: Isolated for new users, no sidebar */
        <Onboarding onComplete={() => setIsDataLoaded(true)} />
      ) : (
        /* 3. Main App: Layout with sidebar only for established users */
        <Layout
          activeView={activeView}
          onViewChange={setActiveView}
          isDark={settings.theme === 'dark'}
          userEmail={user.email || ''}
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
      )}
    </Router>
  );
};

export default App;