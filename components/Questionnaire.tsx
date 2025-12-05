import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Book, Clock, Heart, Shield, Skull, Sword, Flame } from 'lucide-react';

interface QuestionnaireProps {
  onSubmit: (prefs: UserPreferences) => void;
}

const GENRES = [
  'Epic Fantasy', 'History of Wars', 'Political Intrigue', 'Dark Mystery', 'Philosophy', 
  'Biography of Kings', 'Strategies of War', 'Forbidden Lore', 'Legends', 'Tragedy', 
  'Adventure', 'Dragons & Beasts', 'Ancient Prophecies', 'Noble Romance'
];

const MOOD_OPTIONS = [
  { label: 'Vengeful', description: 'Fire and Blood' },
  { label: 'Ambitious', description: 'Chaos is a Ladder' },
  { label: 'Melancholic', description: 'Winter is Coming' },
  { label: 'Honorable', description: 'The Man Who Passes the Sentence' },
  { label: 'Cunning', description: 'I Drink and I Know Things' },
  { label: 'Romantic', description: 'The Things I Do for Love' },
  { label: 'Adventurous', description: 'Go Where the Maps End' },
  { label: 'Weary', description: 'My Watch Has Ended' }
];

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onSubmit }) => {
  const [favoriteBook, setFavoriteBook] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [readingSpeed, setReadingSpeed] = useState<'Slow' | 'Moderate' | 'Fast'>('Moderate');
  const [currentMood, setCurrentMood] = useState('');
  const [ageGroup, setAgeGroup] = useState('');

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (favoriteBook && selectedGenres.length > 0 && currentMood) {
      onSubmit({
        favoriteBook,
        preferredGenres: selectedGenres,
        readingSpeed,
        currentMood,
        ageGroup: ageGroup || undefined
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center relative">
        <div className="w-1 bg-gradient-to-b from-transparent via-lannister-gold to-transparent h-24 mx-auto mb-6"></div>
        <h2 className="text-4xl md:text-5xl font-got font-bold text-stone-200 mb-4 tracking-widest uppercase text-shadow-lg">The Council of Books</h2>
        <p className="text-stone-500 font-serif italic text-lg max-w-2xl mx-auto border-t border-stone-800 pt-4">
            "A mind needs books as a sword needs a whetstone, if it is to keep its edge."
        </p>
      </div>

      <div className="relative bg-iron/80 backdrop-blur-md rounded-sm border border-stone-700 shadow-2xl p-1">
         
         <form onSubmit={handleSubmit} className="space-y-12 p-8 sm:p-12 relative overflow-hidden">
            {/* Background Map Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none"></div>

            {/* Favorite Book */}
            <div className="relative z-10 border-l-4 border-lannister-red pl-6">
                <label className="block text-xl font-got text-stone-300 mb-3 flex items-center gap-3 uppercase tracking-wider">
                    <Book className="w-5 h-5 text-lannister-red" />
                    Which Chronicles Do You Favor?
                </label>
                <input
                    type="text"
                    required
                    value={favoriteBook}
                    onChange={(e) => setFavoriteBook(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-stone-600 text-stone-200 text-lg font-serif placeholder-stone-600 focus:border-lannister-gold focus:ring-1 focus:ring-lannister-gold focus:outline-none transition-all"
                    placeholder="Enter the title of the tome..."
                />
            </div>

            {/* Genres */}
            <div className="relative z-10 border-l-4 border-lannister-gold pl-6">
                <label className="block text-xl font-got text-stone-300 mb-4 flex items-center gap-3 uppercase tracking-wider">
                    <Shield className="w-5 h-5 text-lannister-gold" />
                    Realms of Knowledge (Choose up to 5)
                </label>
                <div className="flex flex-wrap gap-3">
                    {GENRES.map(genre => (
                    <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-4 py-2 text-xs font-got uppercase tracking-widest border transition-all duration-300 ${
                        selectedGenres.includes(genre)
                            ? 'bg-lannister-gold text-black border-lannister-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                            : 'bg-transparent text-stone-500 border-stone-700 hover:border-stone-400 hover:text-stone-300'
                        }`}
                    >
                        {genre}
                    </button>
                    ))}
                </div>
            </div>

            {/* Reading Speed */}
            <div className="relative z-10 border-l-4 border-stark-grey pl-6">
                <label className="block text-xl font-got text-stone-300 mb-4 flex items-center gap-3 uppercase tracking-wider">
                    <Clock className="w-5 h-5 text-stark-grey" />
                    Your Pace Through The Pages?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { val: 'Slow', label: 'The Long Night', desc: 'Slow and deliberate' },
                        { val: 'Moderate', label: 'March of the Unsullied', desc: 'Steady and disciplined' }, 
                        { val: 'Fast', label: 'Flight of the Dragon', desc: 'Swift and conquering' }
                    ].map((option) => (
                    <label key={option.val} className={`cursor-pointer border p-6 flex flex-col items-center justify-center transition-all duration-300 group ${
                        readingSpeed === option.val 
                        ? 'border-stark-grey bg-stark-grey/10' 
                        : 'border-stone-800 bg-black/20 hover:border-stone-600'
                    }`}>
                        <input
                        type="radio"
                        name="readingSpeed"
                        value={option.val}
                        checked={readingSpeed === option.val}
                        onChange={(e) => setReadingSpeed(e.target.value as any)}
                        className="sr-only"
                        />
                        <span className={`font-got font-bold text-sm uppercase tracking-wider mb-2 ${readingSpeed === option.val ? 'text-stone-200' : 'text-stone-500 group-hover:text-stone-400'}`}>{option.label}</span>
                        <span className="text-xs font-serif italic text-stone-600">{option.desc}</span>
                    </label>
                    ))}
                </div>
            </div>

            {/* Current Mood */}
            <div className="relative z-10 border-l-4 border-winter-blue pl-6">
                <label className="block text-xl font-got text-stone-300 mb-3 flex items-center gap-3 uppercase tracking-wider">
                    <Heart className="w-5 h-5 text-winter-blue" />
                    State of Your Spirit
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.label}
                      type="button"
                      onClick={() => setCurrentMood(mood.label)}
                      className={`p-4 border text-left transition-all duration-300 hover:shadow-lg ${
                        currentMood === mood.label
                          ? 'bg-winter-blue/20 border-winter-blue text-stone-100 shadow-[0_0_15px_rgba(141,166,184,0.3)]'
                          : 'bg-black/20 border-stone-800 text-stone-500 hover:border-winter-blue/50 hover:text-stone-300'
                      }`}
                    >
                      <span className="block font-got text-xs sm:text-sm uppercase font-bold tracking-wider mb-1">{mood.label}</span>
                      <span className="block text-[10px] font-serif italic opacity-70">"{mood.description}"</span>
                    </button>
                  ))}
                </div>
            </div>

            {/* Age Group */}
            <div className="relative z-10 border-l-4 border-white/50 pl-6">
                <label className="block text-xl font-got text-stone-300 mb-3 flex items-center gap-3 uppercase tracking-wider">
                    <Skull className="w-5 h-5 text-stone-400" />
                    Years in the Realm
                </label>
                <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-stone-600 text-stone-200 text-lg font-serif focus:border-stone-400 focus:ring-1 focus:ring-stone-400 focus:outline-none transition cursor-pointer"
                >
                    <option value="">Unknown</option>
                    <option value="Under 18">Squire (Under 18)</option>
                    <option value="18-24">Knight (18-24)</option>
                    <option value="25-34">Maester (25-34)</option>
                    <option value="35-44">Lord/Lady (35-44)</option>
                    <option value="45-54">Hand of the King (45-54)</option>
                    <option value="55+">Archmaester (55+)</option>
                </select>
            </div>

            <div className="pt-8 relative z-10 text-center">
                <button
                    type="submit"
                    disabled={!favoriteBook || selectedGenres.length === 0 || !currentMood}
                    className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-lannister-red to-red-950 text-stone-100 font-got font-bold text-lg tracking-[0.2em] uppercase border border-red-900 hover:border-lannister-gold hover:text-white shadow-[0_0_20px_rgba(122,0,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <div className="flex items-center justify-center gap-4">
                        <Flame className="w-5 h-5 group-hover:animate-pulse text-lannister-gold" />
                        <span>Consult the Flames</span>
                        <Flame className="w-5 h-5 group-hover:animate-pulse text-lannister-gold" />
                    </div>
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
