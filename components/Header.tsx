import React from 'react';
import { Book, LogOut, Crown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-black/90 border-b border-lannister-gold/20 sticky top-0 z-50 shadow-2xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center group cursor-pointer">
            <div className="relative p-2 border border-lannister-gold/30 rounded-full mr-4 bg-iron/30">
              <Crown className="h-6 w-6 text-lannister-gold transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-got font-bold text-stone-200 tracking-[0.2em] uppercase drop-shadow-md">
                The Literary Oracle
              </h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-lannister-red to-transparent opacity-50 my-1"></div>
              <p className="text-[0.65rem] text-stone-500 font-got uppercase tracking-widest">
                Knowledge is Power
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {user && (
              <>
                <span className="text-sm text-stone-400 font-got tracking-wide hidden md:inline border-r border-stone-800 pr-6">
                  Welcome, <span className="text-lannister-gold ml-1">{user.name}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-5 py-2 border border-stone-700 text-xs font-got font-bold uppercase tracking-widest rounded-sm text-stone-400 bg-black hover:bg-lannister-red hover:text-white hover:border-lannister-red transition-all duration-300"
                >
                  <LogOut className="h-3 w-3 mr-2" />
                  End Watch
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};