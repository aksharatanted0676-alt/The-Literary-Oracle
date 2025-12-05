import React, { useState } from 'react';
import { OracleResult, LibraryLocation, User } from '../types';
import { Headphones, BookOpen, Smartphone, RefreshCw, MapPin, Loader2, ScrollText, X, Crown, Shield, MessageSquare, Send, User as UserIcon, Users, Lock, Eye } from 'lucide-react';
import { findNearbyLibraries } from '../services/gemini';

interface ResultsProps {
  result: OracleResult;
  onReset: () => void;
  user: User | null;
}

const FormatIcon = ({ format }: { format: string }) => {
  switch (format) {
    case 'Audiobook': return <Headphones className="w-3 h-3" />;
    case 'E-Book': return <Smartphone className="w-3 h-3" />;
    default: return <BookOpen className="w-3 h-3" />;
  }
};

const DifficultyBadge = ({ level }: { level: string }) => {
  let colorClass = '';
  let borderColor = '';
  
  switch(level) {
    case 'Beginner':
        colorClass = 'text-stark-grey';
        borderColor = 'border-stark-grey';
        break;
    case 'Intermediate':
        colorClass = 'text-lannister-gold';
        borderColor = 'border-lannister-gold';
        break;
    case 'Advanced':
        colorClass = 'text-lannister-red';
        borderColor = 'border-lannister-red';
        break;
    default:
        colorClass = 'text-stone-500';
        borderColor = 'border-stone-500';
  }

  return (
    <span className={`px-2 py-1 bg-black/80 border ${borderColor} ${colorClass} text-[10px] font-got uppercase tracking-widest`}>
      {level}
    </span>
  );
};

// Collection of old tome images
const BOOK_IMAGES = [
  "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop", // Stack of old books
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop", // Library shelf
  "https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800&auto=format&fit=crop", // Dark book
  "https://images.unsplash.com/photo-1463320726281-696a41370361?q=80&w=800&auto=format&fit=crop", // Mysterious atmosphere
  "https://images.unsplash.com/photo-1585862705417-671ae64f043a?q=80&w=800&auto=format&fit=crop"  // Red book
];

const MOCK_COMMENTS = [
  { user: 'Samwell_Tarly', text: 'The citations are impeccable. A true masterpiece of knowledge.' },
  { user: 'Arya_NoOne', text: 'Useful techniques for one who wishes to remain unseen.' },
  { user: 'The_Imp', text: 'I drank wine and I read this. 10/10, would recommend to a friend.' },
  { user: 'Lord_Snow', text: 'I knew nothing before reading this. Now I know... slightly more.' },
];

const MOCK_USERS_REGISTRY = [
  { name: 'Jon Snow', email: 'jon@wall.com', house: 'House Stark', joined: 'The Long Night' },
  { name: 'Daenerys Targaryen', email: 'dany@dragonstone.com', house: 'House Targaryen', joined: 'Before the Storm' },
  { name: 'Tyrion Lannister', email: 'imp@casterlyrock.com', house: 'House Lannister', joined: 'Age of Heroes' },
  { name: 'Arya Stark', email: 'noone@braavos.com', house: 'House Stark', joined: 'War of Five Kings' },
  { name: 'Sansa Stark', email: 'queen@winterfell.com', house: 'House Stark', joined: 'Battle of Bastards' },
];

export const Results: React.FC<ResultsProps> = ({ result, onReset, user }) => {
  const [findingLibrary, setFindingLibrary] = useState<string | null>(null);
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraries, setLibraries] = useState<LibraryLocation[]>([]);
  const [searchStatus, setSearchStatus] = useState<string>('');
  
  // Community State
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [activeCommunityBook, setActiveCommunityBook] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Registry State
  const [registryModalOpen, setRegistryModalOpen] = useState(false);
  
  // Define Admin Email
  const ADMIN_EMAIL = 'maester@citadel.com';
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleFindInLibrary = (bookTitle: string) => {
    setFindingLibrary(bookTitle);
    setSearchStatus('Sending ravens to the Citadel...');
    setLibraries([]);
    
    if (!navigator.geolocation) {
      alert("Geolocation is required to scour the Seven Kingdoms.");
      setFindingLibrary(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setSearchStatus('Consulting the maps...');
          const foundLibraries = await findNearbyLibraries(latitude, longitude);
          
          setLibraries(foundLibraries);
          setLibraryModalOpen(true);
        } catch (error) {
          console.error("Failed to find libraries", error);
          alert("The ravens were intercepted. Could not find nearby libraries.");
        } finally {
          setFindingLibrary(null);
        }
      },
      (error) => {
        console.warn("Geolocation denied or failed", error);
        alert("We need your location to find the nearest archives.");
        setFindingLibrary(null);
      }
    );
  };

  const handleOpenCommunity = (bookTitle: string) => {
    setActiveCommunityBook(bookTitle);
    setCommunityModalOpen(true);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setNewComment('');
    alert("Your raven has been sent to the realm.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      {/* Header Actions */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={() => setRegistryModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-stone-600 bg-black/80 text-stone-400 hover:text-lannister-gold hover:border-lannister-gold transition-all font-got text-xs uppercase tracking-widest shadow-lg"
        >
           <Users className="w-4 h-4" />
           Registry of the Realm
        </button>
      </div>

      <div className="text-center mb-16 relative z-10">
        <div className="inline-block mb-4 p-3 border border-lannister-gold/30 rounded-full bg-black/50">
             <Crown className="w-10 h-10 text-lannister-gold" />
        </div>
        <h2 className="text-4xl md:text-5xl font-got font-bold text-stone-200 mb-8 tracking-[0.1em] uppercase border-b-2 border-stone-800 pb-8 inline-block px-12">
          The Grand Maester's Decree
        </h2>
        
        <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-iron/40 border-l-4 border-lannister-red p-6 backdrop-blur-sm text-left relative">
                <p className="font-serif italic text-stone-300 text-lg leading-relaxed">
                "{result.motivationalMessage}"
                </p>
                <div className="absolute -right-2 -bottom-2 opacity-20">
                    <Shield className="w-24 h-24 text-lannister-red" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {result.recommendations.map((book, index) => (
          <div key={index} className="group relative">
             <div className="bg-black border border-stone-800 hover:border-lannister-gold/50 transition-colors duration-500 h-full flex flex-col shadow-2xl">
                
                {/* Book Image */}
                <div className="h-56 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-lannister-red/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                        src={BOOK_IMAGES[index % BOOK_IMAGES.length]} 
                        alt="Tome Cover" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-between items-end">
                        <div className="w-8 h-8 bg-lannister-red flex items-center justify-center text-white font-got font-bold text-sm shadow-lg border border-red-900">
                           {index + 1}
                        </div>
                        <DifficultyBadge level={book.difficulty} />
                    </div>
                </div>

                <div className="p-6 flex-grow flex flex-col border-t border-lannister-red/20">
                   <h3 className="text-xl font-got font-bold text-stone-200 mb-1 leading-tight min-h-[3rem] group-hover:text-lannister-gold transition-colors">{book.title}</h3>
                   <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">by {book.author}</p>

                   <div className="mb-6">
                       <p className="text-stone-400 text-sm font-serif leading-relaxed line-clamp-4 border-l-2 border-stone-800 pl-3">
                         {book.summary}
                       </p>
                   </div>

                   <div className="mt-auto space-y-4">
                       <div className="bg-stone-900/50 p-4 border border-stone-800">
                           <p className="text-[10px] text-lannister-red uppercase font-got tracking-widest mb-1">Maester's Note</p>
                           <p className="text-sm text-stone-300 italic">"{book.matchReason}"</p>
                       </div>

                       <div className="pt-2 border-t border-stone-800 flex flex-col gap-3">
                           <div className="flex items-center justify-between">
                                <span className="text-[10px] text-stone-600 font-bold uppercase tracking-widest">Format</span>
                                <span className="text-xs font-bold text-stone-400 flex items-center gap-2">
                                    <FormatIcon format={book.formatSuggestion} />
                                    {book.formatSuggestion}
                                </span>
                           </div>

                           <div className="flex gap-2">
                             <button 
                                 onClick={() => handleFindInLibrary(book.title)}
                                 className="flex-1 flex items-center justify-center gap-2 py-3 px-2 border border-stone-600 bg-stone-900 text-stone-400 hover:bg-lannister-red hover:text-white hover:border-lannister-red transition-all font-got font-bold text-[10px] uppercase tracking-[0.1em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                 disabled={!!findingLibrary}
                             >
                                 {findingLibrary === book.title ? (
                                     <Loader2 className="w-3 h-3 animate-spin" />
                                 ) : (
                                     <MapPin className="w-3 h-3" />
                                 )}
                                 {findingLibrary === book.title ? 'Searching...' : 'Locate Tome'}
                             </button>

                             <button 
                                onClick={() => handleOpenCommunity(book.title)}
                                className="px-3 py-3 border border-stone-600 bg-black text-stone-400 hover:bg-stone-800 hover:border-stone-400 hover:text-white transition-all shadow-lg"
                                title="Consult the Realm"
                             >
                                <MessageSquare className="w-4 h-4" />
                             </button>
                           </div>
                       </div>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center px-8 py-4 border border-lannister-gold text-lannister-gold bg-transparent hover:bg-lannister-gold hover:text-black font-got font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300"
        >
          <RefreshCw className="mr-3 h-4 w-4" />
          Consult the Oracle Again
        </button>
      </div>

      {/* Registry of the Realm Modal */}
      {registryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-iron w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-stone-600 relative overflow-hidden flex flex-col max-h-[85vh]">
               {/* Background Texture */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-50 pointer-events-none"></div>

               <button 
                onClick={() => setRegistryModalOpen(false)}
                className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors z-20"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="p-8 border-b border-stone-700 bg-black/60 relative z-10 text-center">
                   <h3 className="text-2xl font-got font-bold text-lannister-gold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                     <Users className="w-6 h-6" />
                     {isAdmin ? 'The Great Census' : 'Your Personal Record'}
                   </h3>
                   <p className="text-xs font-serif text-stone-500 mt-2 italic">
                     {isAdmin ? 'A list of all souls known to the Citadel (Visible only to the Grand Maester).' : 'Your identity as recorded in the archives.'}
                   </p>
               </div>

               <div className="p-8 overflow-y-auto relative z-10 custom-scrollbar">
                   {isAdmin ? (
                       // ADMIN VIEW
                       <div className="space-y-4">
                           <div className="bg-lannister-red/10 border border-lannister-red/30 p-4 mb-6 flex items-start gap-3">
                               <Eye className="w-5 h-5 text-lannister-red flex-shrink-0 mt-1" />
                               <div>
                                   <p className="text-lannister-red font-got text-xs font-bold uppercase tracking-wider mb-1">Eyes of the Dragon</p>
                                   <p className="text-stone-300 text-sm font-serif italic">You are viewing this list as an Administrator of the Realm.</p>
                               </div>
                           </div>

                           <div className="overflow-hidden border border-stone-700 rounded-sm">
                               <table className="w-full text-left border-collapse">
                                   <thead>
                                       <tr className="bg-stone-900 border-b border-stone-700">
                                           <th className="p-4 font-got text-xs text-stone-500 uppercase tracking-wider">Name & House</th>
                                           <th className="p-4 font-got text-xs text-stone-500 uppercase tracking-wider">Raven Address</th>
                                           <th className="p-4 font-got text-xs text-stone-500 uppercase tracking-wider hidden sm:table-cell">Era Joined</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-stone-800 bg-black/40">
                                       {/* Current User Row */}
                                       <tr className="hover:bg-lannister-gold/5 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-stone-200">{user?.name}</div>
                                                <div className="text-[10px] text-lannister-gold uppercase">(You)</div>
                                            </td>
                                            <td className="p-4 text-stone-400 font-mono text-xs">{user?.email}</td>
                                            <td className="p-4 text-stone-500 text-xs italic hidden sm:table-cell">Just now</td>
                                       </tr>
                                       {/* Mock Users */}
                                       {MOCK_USERS_REGISTRY.map((u, i) => (
                                           <tr key={i} className="hover:bg-white/5 transition-colors">
                                               <td className="p-4">
                                                   <div className="font-bold text-stone-300">{u.name}</div>
                                                   <div className="text-[10px] text-stone-600 uppercase">{u.house}</div>
                                               </td>
                                               <td className="p-4 text-stone-500 font-mono text-xs">{u.email}</td>
                                               <td className="p-4 text-stone-500 text-xs italic hidden sm:table-cell">{u.joined}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                       </div>
                   ) : (
                       // REGULAR USER VIEW
                       <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-24 h-24 bg-stone-900 rounded-full border-4 border-stone-700 flex items-center justify-center mb-6 shadow-xl relative">
                                <UserIcon className="w-10 h-10 text-stone-500" />
                                <div className="absolute bottom-0 right-0 bg-lannister-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-black">
                                    USER
                                </div>
                            </div>

                            <h2 className="text-3xl font-got text-stone-100 font-bold mb-2">{user?.name}</h2>
                            <p className="text-stone-500 font-mono mb-8 flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-stone-800">
                                {user?.email}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                                <div className="bg-black/40 border border-stone-700 p-4 text-center">
                                    <p className="text-[10px] text-stone-500 font-got uppercase tracking-widest mb-1">Allegiance</p>
                                    <p className="text-lannister-red font-serif font-bold">The Literary Oracle</p>
                                </div>
                                <div className="bg-black/40 border border-stone-700 p-4 text-center">
                                    <p className="text-[10px] text-stone-500 font-got uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-lannister-gold font-serif font-bold">Active Scholar</p>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-lannister-red/5 border border-lannister-red/20 w-full max-w-md flex items-start gap-3">
                                <Lock className="w-4 h-4 text-lannister-red/60 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-stone-500 font-serif italic text-left">
                                    Your record is sealed within the Citadel. Only the Grand Maester (Admin) may view the full registry of the realm.
                                </p>
                            </div>
                       </div>
                   )}
               </div>
           </div>
        </div>
      )}

      {/* Library Modal */}
      {libraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-paper w-full max-w-lg shadow-2xl border-4 border-double border-stone-600 relative overflow-hidden">
               {/* Parchment texture */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-90 pointer-events-none mix-blend-multiply"></div>
               
               <button 
                onClick={() => setLibraryModalOpen(false)}
                className="absolute top-4 right-4 text-stone-800 hover:text-lannister-red transition-colors z-20"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="p-8 relative z-10">
                   <h3 className="text-xl font-got font-bold text-ink mb-4 text-center uppercase tracking-widest border-b border-ink/20 pb-4 flex items-center justify-center gap-3">
                     <ScrollText className="w-5 h-5" />
                     The Citadel Archives
                   </h3>
                   
                   <p className="text-stone-700 font-serif italic text-center mb-6 text-sm">
                     Locations of knowledge discovered in your vicinity:
                   </p>

                   <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {libraries.length > 0 ? (
                        libraries.map((lib, idx) => (
                          <a 
                            key={idx}
                            href={lib.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 border border-stone-400 bg-white/20 hover:bg-lannister-red/10 hover:border-lannister-red transition-all group"
                          >
                             <div className="flex items-start justify-between">
                               <div>
                                  <h4 className="font-bold text-ink font-serif text-lg group-hover:text-lannister-red transition-colors">{lib.name}</h4>
                                  <p className="text-xs text-stone-600 font-got uppercase mt-1 tracking-wider">Show on Map</p>
                               </div>
                               <MapPin className="w-5 h-5 text-stone-500 group-hover:text-lannister-red" />
                             </div>
                          </a>
                        ))
                      ) : (
                        <div className="text-center py-8 border border-dashed border-stone-400">
                           <p className="text-stone-600 font-got text-xs uppercase tracking-widest">No archives found in this realm.</p>
                        </div>
                      )}
                   </div>
               </div>
           </div>
        </div>
      )}

      {/* Community Modal */}
      {communityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-iron w-full max-w-lg shadow-2xl border border-stone-600 relative overflow-hidden flex flex-col max-h-[85vh]">
               {/* Dark Metal Texture */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
               
               <button 
                onClick={() => setCommunityModalOpen(false)}
                className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors z-20"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="p-6 border-b border-stone-700 bg-black/40 relative z-10">
                   <h3 className="text-lg font-got font-bold text-stone-200 uppercase tracking-widest flex items-center gap-3">
                     <MessageSquare className="w-5 h-5 text-lannister-gold" />
                     Whispers of the Realm
                   </h3>
                   <p className="text-xs font-serif text-stone-500 mt-1 italic">
                     Regarding the tome: <span className="text-lannister-gold">{activeCommunityBook}</span>
                   </p>
               </div>

               <div className="p-6 overflow-y-auto flex-grow space-y-4 relative z-10 custom-scrollbar">
                   {MOCK_COMMENTS.map((comment, i) => (
                       <div key={i} className="flex gap-3 animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center border border-stone-600 flex-shrink-0">
                              <UserIcon className="w-4 h-4 text-stone-400" />
                          </div>
                          <div className="bg-black/40 border border-stone-800 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg flex-grow">
                              <p className="text-[10px] font-got font-bold text-lannister-red uppercase tracking-wider mb-1">{comment.user}</p>
                              <p className="text-sm text-stone-300 font-serif leading-relaxed">"{comment.text}"</p>
                          </div>
                       </div>
                   ))}
               </div>

               <div className="p-4 bg-black/60 border-t border-stone-700 relative z-10">
                   <form onSubmit={handlePostComment} className="flex gap-2">
                       <input 
                          type="text" 
                          placeholder="Send a raven..." 
                          className="flex-grow bg-stone-900/50 border border-stone-600 text-stone-300 text-sm px-4 py-2 focus:outline-none focus:border-lannister-gold font-serif placeholder-stone-600"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                       />
                       <button 
                          type="submit"
                          className="bg-lannister-red/80 hover:bg-lannister-red text-white p-2 border border-lannister-red transition-colors"
                       >
                           <Send className="w-4 h-4" />
                       </button>
                   </form>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};