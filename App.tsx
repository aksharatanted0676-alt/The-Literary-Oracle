import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { Loading } from './components/Loading';
import { getBookRecommendations } from './services/gemini';
import { AppState, User, UserPreferences, OracleResult } from './types';
import { AlertTriangle } from 'lucide-react';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<OracleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          name: firebaseUser.displayName || 'Traveler of the Realm',
          email: firebaseUser.email || ''
        });
        
        // Only transition to questionnaire if we were in LOGIN state
        setAppState((prev) => 
          prev === AppState.LOGIN ? AppState.QUESTIONNAIRE : prev
        );
      } else {
        // User is signed out
        setUser(null);
        setAppState(AppState.LOGIN);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login is now handled by the component via Firebase, updates via useEffect above
  const handleLogin = (loggedInUser: User) => {
     // This legacy handler is optional now as the Effect handles state,
     // but we keep the structure consistent if needed.
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setResults(null);
      // AppState update handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePreferenceSubmit = async (prefs: UserPreferences) => {
    setAppState(AppState.LOADING);
    setError(null);
    
    try {
      const data = await getBookRecommendations(prefs);
      setResults(data);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setResults(null);
    setAppState(AppState.QUESTIONNAIRE);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-westeros-bg flex items-center justify-center">
         <div className="text-lannister-gold font-got animate-pulse tracking-widest">Opening the Gates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-westeros-bg text-paper selection:bg-lannister-red selection:text-white relative">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542256844-3112dc263f35?q=80&w=2574&auto=format&fit=crop" 
          alt="Dark Castle Map Background" 
          className="w-full h-full object-cover opacity-20 grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-grow flex flex-col">
          <div className="w-full">
            {appState === AppState.LOGIN && (
              <Login onLogin={handleLogin} />
            )}

            {appState === AppState.QUESTIONNAIRE && (
              <Questionnaire onSubmit={handlePreferenceSubmit} />
            )}

            {appState === AppState.LOADING && (
              <Loading />
            )}

            {appState === AppState.RESULTS && results && (
              <Results result={results} onReset={handleReset} user={user} />
            )}

            {appState === AppState.ERROR && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
                <div className="bg-night-watch p-8 rounded-sm border border-lannister-red/50 max-w-md text-center shadow-[0_0_30px_rgba(122,0,0,0.3)] relative overflow-hidden">
                  <AlertTriangle className="h-12 w-12 text-lannister-red mx-auto mb-4" />
                  <h3 className="text-xl font-got font-bold text-lannister-red mb-2 uppercase tracking-widest">The Night is Dark</h3>
                  <p className="text-stone-400 mb-6 font-serif italic border-l-2 border-lannister-red pl-4">{error}</p>
                  <button 
                    onClick={() => setAppState(AppState.QUESTIONNAIRE)}
                    className="px-6 py-2 bg-transparent border border-lannister-red text-lannister-red hover:bg-lannister-red hover:text-white font-got font-bold uppercase tracking-widest transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="bg-black/90 border-t border-iron py-8 mt-auto backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-stone-600 text-xs font-got uppercase tracking-widest">
              &copy; {new Date().getFullYear()} The Literary Oracle. A Service of the Citadel.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;