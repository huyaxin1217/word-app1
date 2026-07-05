import React, { useState, useEffect } from 'react';
import { TabType, PetOutfit, Word } from '../types';
import { StudyTab } from './StudyTab';
import { ReviewTab } from './ReviewTab';
import { LibraryTab } from './LibraryTab';
import { ProgressTab } from './ProgressTab';
import { PetDressUpModal, UserProfileModal } from './Modals';
import { User, Book, Layers, BarChart2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { initializeVocabulary, getUserData, fetchWordsForStudy, updateUserData } from '../services/db';

export function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('study');
  const [outfit, setOutfit] = useState<PetOutfit>('none');
  const [showDressUp, setShowDressUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [coins, setCoins] = useState(0);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [newWords, setNewWords] = useState<Word[]>([]);
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        let uid = 'local-user';
        try {
          const userCred = await signInAnonymously(auth);
          uid = userCred.user.uid;
        } catch (authErr) {
          console.warn("Auth failed, using local fallback ID", authErr);
          let localId = localStorage.getItem('vocab_user_id');
          if (!localId) {
            localId = 'user_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('vocab_user_id', localId);
          }
          uid = localId;
        }
        setUserId(uid);
        
        await initializeVocabulary();
        const userData = await getUserData(uid);
        setCoins(userData?.coins || 0);
        if (userData?.petOutfit) setOutfit(userData.petOutfit);
        
        const fetchedWords = await fetchWordsForStudy(uid, userData?.currentBook || 'CET6');
        setAllWords(fetchedWords);
        
        const now = Date.now();
        const unstudied = fetchedWords.filter(w => !w.progress);
        const toReview = fetchedWords.filter(w => w.progress && w.progress.nextReviewTime <= now);
        
        setNewWords(unstudied);
        setReviewWords(toReview);
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleUpdateCoins = (amount: number) => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    if (userId) updateUserData(userId, { coins: newCoins });
  };
  
  const handleOutfitChange = (newOutfit: PetOutfit) => {
    setOutfit(newOutfit);
    if (userId) updateUserData(userId, { petOutfit: newOutfit });
  };

  const handleWordStudied = (updatedWord: Word) => {
    setNewWords(prev => prev.filter(w => w.id !== updatedWord.id));
    setAllWords(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
  };
  
  const handleWordReviewed = (updatedWord: Word) => {
    setReviewWords(prev => prev.filter(w => w.id !== updatedWord.id));
    setAllWords(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-slate-50 overflow-hidden font-sans">
      {/* Background visual effects - Generic fluid glassmorphism */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-indigo-50">
        <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-white/40 blur-3xl rounded-full mix-blend-overlay" />
        <div className="absolute bottom-[20%] right-[10%] w-[60%] h-[40%] bg-emerald-100/40 blur-3xl rounded-full mix-blend-overlay" />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-10 pb-4">
        {/* User Account Button (Top Left) */}
        <button 
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-2xl bg-white/50 backdrop-blur-md shadow-sm border border-white/60 flex items-center justify-center hover:bg-white/70 active:scale-95 transition-all"
        >
          <User className="w-5 h-5 text-slate-600" />
        </button>

        {/* Coins indicator */}
        <div className="flex items-center space-x-1.5 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 shadow-sm">
          <span className="text-sm font-bold text-slate-600">{coins}</span>
          <span className="text-xs text-amber-500 font-black">G</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
             <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'study' && (
              <StudyTab key="study" outfit={outfit} onOpenDressUp={() => setShowDressUp(true)} onAddCoins={handleUpdateCoins} words={newWords} userId={userId} onWordStudied={handleWordStudied} />
            )}
            {activeTab === 'review' && (
              <ReviewTab key="review" outfit={outfit} onOpenDressUp={() => setShowDressUp(true)} onAddCoins={handleUpdateCoins} words={reviewWords} userId={userId} onWordReviewed={handleWordReviewed} />
            )}
            {activeTab === 'library' && (
               <LibraryTab key="library" />
            )}
            {activeTab === 'progress' && (
               <ProgressTab key="progress" words={allWords} coins={coins} />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Nav (Full width liquid glass style) */}
      <div className="relative z-20">
        <div className="flex items-center justify-around bg-white/50 backdrop-blur-xl border-t border-white/60 p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          <NavButton active={activeTab === 'study'} onClick={() => setActiveTab('study')} icon={<Book />} label="背单词" />
          <NavButton active={activeTab === 'review'} onClick={() => setActiveTab('review')} icon={<RefreshCcw />} label="复习" />
          <NavButton active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<Layers />} label="词书" />
          <NavButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} icon={<BarChart2 />} label="进度" />
        </div>
      </div>

      {/* Modals */}
      <PetDressUpModal isOpen={showDressUp} onClose={() => setShowDressUp(false)} currentOutfit={outfit} onSelectOutfit={handleOutfitChange} />
      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 ${active ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-white/60 shadow-sm rounded-xl border border-white/80 pointer-events-none"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center space-y-1.5">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
      </div>
    </button>
  );
}
