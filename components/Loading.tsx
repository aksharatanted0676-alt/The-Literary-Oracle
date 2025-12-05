import React from 'react';
import { Sword } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-lannister-red/10 rounded-full blur-[100px] animate-pulse"></div>
      
      <div className="relative mb-12">
        {/* Swords spinning */}
        <div className="relative w-32 h-32 animate-[spin_4s_linear_infinite]">
            <Sword className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-stone-500" />
            <Sword className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 text-stone-500 rotate-180" />
            <Sword className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-stone-500 -rotate-90" />
            <Sword className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-stone-500 rotate-90" />
            
            <div className="absolute inset-0 border-2 border-dashed border-lannister-gold rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
        </div>
        
        {/* Center Fire */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-lannister-red rounded-full animate-ping"></div>
        </div>
      </div>
      
      <h3 className="text-2xl font-got font-bold text-stone-300 mb-4 tracking-[0.2em] uppercase">Consulting the Flames</h3>
      <div className="flex flex-col gap-2 font-serif italic text-stone-500 text-sm">
        <span className="animate-pulse delay-75">Sending ravens to the Citadel...</span>
        <span className="animate-pulse delay-150">Forging your destiny in Valyrian steel...</span>
        <span className="animate-pulse delay-300">Winter is coming...</span>
      </div>
    </div>
  );
};