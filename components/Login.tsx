import React, { useState } from 'react';
import { User } from '../types';
import { Feather, Shield, AlertTriangle, Lock } from 'lucide-react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name) {
          throw new Error("You must declare your House Name.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        // onLogin handled by auth state listener in App.tsx
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // onLogin handled by auth state listener in App.tsx
      }
    } catch (err: any) {
      let message = "The gates remain closed.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = "Incorrect secret phrase or raven address.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This raven address is already known to the Citadel.";
      } else if (err.code === 'auth/weak-password') {
        message = "Your secret phrase is too weak. Strengthen your defenses.";
      } else {
         message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="max-w-md w-full relative group perspective-1000">
        
        {/* Wax Seal */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 shadow-xl">
             <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-950 rounded-full border-4 border-red-900/50 shadow-inner flex items-center justify-center relative">
                <div className="absolute inset-1 border border-red-700/50 rounded-full"></div>
                <Shield className="w-8 h-8 text-red-900/60 drop-shadow-md" />
             </div>
        </div>

        <div className="bg-paper p-8 pt-16 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden transform transition-all hover:translate-y-1">
          {/* Parchment texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-80 pointer-events-none mix-blend-multiply"></div>
          {/* Burnt edges effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] pointer-events-none"></div>

          <div className="text-center relative z-10 mb-8">
            <h2 className="text-2xl font-got font-bold text-ink mb-2 uppercase tracking-widest border-b-2 border-ink/10 pb-4">
              {isSignUp ? 'Oath of Fealty' : 'Who Goes There?'}
            </h2>
            <p className="text-stone-600 font-serif italic text-sm mt-4">
              {isSignUp 
                ? 'Pledge your name and secrets to the archives.' 
                : 'Speak your name and enter.'}
            </p>
          </div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-5">
              
              {/* Name Field (Signup Only) */}
              {isSignUp && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <label htmlFor="name" className="block text-xs font-bold font-got text-stone-500 mb-1 uppercase tracking-widest">Title & House Name</label>
                  <div className="relative">
                      <input
                          id="name"
                          name="name"
                          type="text"
                          required={isSignUp}
                          className="appearance-none rounded-none block w-full px-4 py-3 border border-stone-400 placeholder-stone-400/70 text-ink bg-stone-100/50 focus:outline-none focus:ring-1 focus:ring-lannister-red focus:border-lannister-red font-serif transition-colors"
                          placeholder="e.g. Tyrion of House Lannister"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email-address" className="block text-xs font-bold font-got text-stone-500 mb-1 uppercase tracking-widest">Raven Messenger (Email)</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none block w-full px-4 py-3 border border-stone-400 placeholder-stone-400/70 text-ink bg-stone-100/50 focus:outline-none focus:ring-1 focus:ring-lannister-red focus:border-lannister-red font-serif transition-colors"
                  placeholder="e.g. tyrion@casterlyrock.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold font-got text-stone-500 mb-1 uppercase tracking-widest">Secret Word (Password)</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    className="appearance-none rounded-none block w-full px-4 py-3 border border-stone-400 placeholder-stone-400/70 text-ink bg-stone-100/50 focus:outline-none focus:ring-1 focus:ring-lannister-red focus:border-lannister-red font-serif transition-colors"
                    placeholder="*******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute right-3 top-3 text-stone-400">
                      <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-lannister-red bg-red-50 p-3 border border-lannister-red/20 text-xs font-serif italic">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-lannister-red bg-lannister-red text-stone-100 font-got font-bold text-sm uppercase tracking-[0.15em] hover:bg-red-900 transition-all duration-500 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Feather className="h-4 w-4 text-stone-300 group-hover:text-white transition-colors" />
                </span>
                {loading ? 'Consulting...' : (isSignUp ? 'Seal the Scroll' : 'Enter the Citadel')}
              </button>
            </div>
            
            <div className="text-center pt-2">
              <button
                type="button"
                className="text-xs font-got text-stone-500 hover:text-lannister-red transition-colors uppercase tracking-wide border-b border-transparent hover:border-lannister-red"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
              >
                {isSignUp ? 'Already Sworn? Enter Here' : "New to the Realm? Pledge Here"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
