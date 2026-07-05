import React, { useState } from 'react';
import { TabType, PetOutfit } from '../types';
import { StudyTab } from './StudyTab';
import { LibraryTab } from './LibraryTab';
import { ProgressTab } from './ProgressTab';
import { PetDressUpModal, UserProfileModal } from './Modals';
import { User, Book, Layers, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('study');
  const [outfit, setOutfit] = useState<PetOutfit>('none');
  const [showDressUp, setShowDressUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [coins, setCoins] = useState(120);

  return (
    <div className="flex flex-col h-full w-full relative bg-[#f5f5f7] overflow-hidden font-sans">
      {/* Background visual effects - Apple inspired subtle blur elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/30 blur-[100px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-200/30 blur-[100px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-purple-200/30 blur-[80px] rounded-full mix-blend-multiply" />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
        {/* User Account Button (Top Left) */}
        <button 
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl shadow-sm border border-white flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
        >
          <User className="w-5 h-5 text-slate-700" />
        </button>

        {/* Coins indicator */}
        <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white shadow-sm">
          <span className="text-sm font-bold text-slate-700">{coins}</span>
          <span className="text-xs text-amber-500 font-black">G</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'study' && (
            <StudyTab key="study" outfit={outfit} onOpenDressUp={() => setShowDressUp(true)} onAddCoins={(c) => setCoins(prev => prev + c)} />
          )}
          {activeTab === 'library' && (
             <LibraryTab key="library" />
          )}
          {activeTab === 'progress' && (
             <ProgressTab key="progress" />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav (Apple iOS style floating dock) */}
      <div className="relative z-20 px-8 pb-8 pt-2">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60">
          <NavButton active={activeTab === 'study'} onClick={() => setActiveTab('study')} icon={<Book />} label="背单词" />
          <NavButton active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<Layers />} label="词书" />
          <NavButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} icon={<BarChart2 />} label="进度" />
        </div>
      </div>

      {/* Modals */}
      <PetDressUpModal isOpen={showDressUp} onClose={() => setShowDressUp(false)} currentOutfit={outfit} onSelectOutfit={setOutfit} />
      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-[4.5rem] h-14 rounded-[2rem] transition-all duration-500 ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-white shadow-sm rounded-[2rem] border border-white pointer-events-none"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center space-y-1">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        <span className="text-[10px] font-bold tracking-wider">{label}</span>
      </div>
    </button>
  );
}
