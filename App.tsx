import React, { useState, useEffect } from 'react';
import { Goal, Calendar, Settings as SettingsIcon, LayoutDashboard, LogOut } from 'lucide-react';
import { GoalManager } from './components/GoalManager';
import { MonthlyRecordManager } from './components/MonthlyRecord';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { OnboardingModal } from './components/OnboardingModal';
import { supabase } from './services/supabase';
import { User } from './types';
import { DEMO_USER } from './demoData';

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'GOALS' | 'RECORDS' | 'SETTINGS'>('GOALS');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isInitializing, setIsInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (mounted && isInitializing) {
        console.warn('Auth check timed out, falling back to demo mode');
        setIsInitializing(false);
      }
    }, 2000);

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        // Show onboarding modal for first-time visitors
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }
      setIsInitializing(false);
    }).catch(err => {
      console.error('Auth check failed:', err);
      if (mounted) setIsInitializing(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
        });
        setShowAuth(false);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('GOALS');
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleSignUp = () => {
    setShowOnboarding(false);
    setShowAuth(true);
    setActiveTab('SETTINGS');
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-indigo-500">Loading...</div>;
  }

  // Use demo user if not logged in
  const displayUser = currentUser || DEMO_USER;
  const isDemoMode = !currentUser;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          onClose={handleCloseOnboarding}
          onSignUp={handleSignUp}
        />
      )}

      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 mx-auto w-full max-w-[430px] z-20 border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('GOALS')}>
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
            <h1 className="text-xl font-bold text-indigo-900 tracking-tight">
              OKR 플래너
            </h1>
            {isDemoMode && (
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">DEMO</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isDemoMode ? (
              <button
                onClick={handleSignUp}
                className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
              >
                시작하기
              </button>
            ) : (
              <>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-gray-100 text-sm font-semibold text-gray-700 py-1.5 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {[2023, 2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="로그아웃"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-6 min-h-[calc(100vh-140px)] pt-20">
        {showAuth && isDemoMode ? (
          <Auth onLogin={() => { }} />
        ) : (
          <>
            {activeTab === 'GOALS' && (
              <GoalManager user={displayUser} year={selectedYear} isDemoMode={isDemoMode} />
            )}
            {activeTab === 'RECORDS' && (
              <MonthlyRecordManager user={displayUser} year={selectedYear} isDemoMode={isDemoMode} />
            )}
            {activeTab === 'SETTINGS' && (
              isDemoMode ? (
                <Auth onLogin={() => { }} />
              ) : (
                <Settings currentUser={displayUser} onLogin={() => { }} onLogout={handleLogout} />
              )
            )}
          </>
        )}
      </main>

      {/* Bottom GNB */}
      <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] bg-white border-t border-gray-200 pb-safe z-30">
        <div className="max-w-2xl mx-auto grid grid-cols-3 h-16 relative">

          <button
            onClick={() => { setActiveTab('GOALS'); setShowAuth(false); }}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'GOALS' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Goal size={24} strokeWidth={activeTab === 'GOALS' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">목표</span>
          </button>

          <button
            onClick={() => { setActiveTab('RECORDS'); setShowAuth(false); }}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'RECORDS' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Calendar size={24} strokeWidth={activeTab === 'RECORDS' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">기록</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'SETTINGS' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <SettingsIcon size={24} strokeWidth={activeTab === 'SETTINGS' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{isDemoMode ? '로그인' : '설정'}</span>
          </button>

          {/* Active Indicator Line */}
          <div
            className="absolute top-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out"
            style={{
              width: '33.33%',
              left: activeTab === 'GOALS' ? '0%' : activeTab === 'RECORDS' ? '33.33%' : '66.66%'
            }}
          />
        </div>
      </nav>
      {/* Safe area spacer for bottom nav */}
      <div className="h-16" />
    </div>
  );
};

export default App;