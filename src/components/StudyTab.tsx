import React, { useState, useEffect } from 'react';
import { Word, WordFamiliarity, PetOutfit } from '../types';
import { TreeProgress } from './TreeProgress';
import { Pet } from './Pet';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Shirt, Sparkles, Loader2, Volume2 } from 'lucide-react';
import { updateWordProgress, updateWordData } from '../services/db';
import { playAudio } from '../utils/audio';

interface StudyTabProps {
  outfit: PetOutfit;
  onOpenDressUp: () => void;
  onAddCoins: (amount: number) => void;
  words: Word[];
  userId: string | null;
  onWordStudied: (updatedWord: Word) => void;
}

export function StudyTab({ outfit, onOpenDressUp, onAddCoins, words, userId, onWordStudied }: StudyTabProps) {
  const [queue, setQueue] = useState<Word[]>([]);
  const [showDefinition, setShowDefinition] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);

  useEffect(() => {
    if (queue.length === 0 && words.length > 0) {
      setQueue(words);
    }
  }, [words]);

  const currentWord = queue[0];

  useEffect(() => {
    if (currentWord && !showDefinition) {
      playAudio(currentWord.english);
    }
  }, [currentWord?.id, showDefinition]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetIdle = () => setIdleTime(0);

  const generateExample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentWord || isGeneratingInfo) return;
    setIsGeneratingInfo(true);
    resetIdle();
    
    try {
      const res = await fetch('/api/generate-example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: currentWord.english })
      });
      if (res.ok) {
        const data = await res.json();
        
        // Update local state
        const updatedWord = { ...currentWord, exampleEn: data.exampleEn, exampleZh: data.exampleZh };
        setQueue(prev => [updatedWord, ...prev.slice(1)]);
        
        // Update global DB
        await updateWordData(currentWord.id, { exampleEn: data.exampleEn, exampleZh: data.exampleZh });
      }
    } catch (e) {
      console.error("Failed to generate example:", e);
    } finally {
      setIsGeneratingInfo(false);
    }
  };

  const handleAction = async (action: 'forgot' | 'vague' | 'know') => {
    resetIdle();
    
    if (userId && currentWord) {
      const prevFam = currentWord.progress?.familiarity || 0;
      const newProg = await updateWordProgress(userId, currentWord.id, action, currentWord.progress);
      
      if (newProg.familiarity === 3 && prevFam < 3) {
        onAddCoins(10);
      }
      
      const updatedWord = { ...currentWord, familiarity: newProg.familiarity as WordFamiliarity, progress: newProg };

      setTimeout(() => {
        setShowDefinition(false);
        if (action === 'know') {
           onWordStudied(updatedWord);
           setQueue(prev => prev.slice(1));
        } else {
           setQueue(prev => [...prev.slice(1), updatedWord]);
        }
      }, 600);
    }
  };

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 font-medium">今天的新词已经学完啦！</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full px-6"
      onClick={resetIdle}
    >
      <div className="flex items-center justify-between mb-2 mt-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">今日新词</h2>
        <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">剩余 {queue.length}</span>
      </div>

      {/* Tree Progress */}
      <div className="h-28 flex items-center justify-center mb-2">
        <TreeProgress familiarity={currentWord.familiarity} />
      </div>

      {/* Word Card - Generic Liquid Glass */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <div 
            onClick={() => { setShowDefinition(true); resetIdle(); }}
            className="flex-1 bg-white/40 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(31,38,135,0.05)] border border-white/60 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden group"
          >
             <div className="flex items-center justify-center space-x-3 mb-3">
               <h2 className="text-4xl font-bold text-slate-800 tracking-wide text-center break-words">{currentWord.english}</h2>
               <button 
                 onClick={(e) => { e.stopPropagation(); playAudio(currentWord.english); }}
                 className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
               >
                 <Volume2 className="w-5 h-5" />
               </button>
             </div>
             <p className="text-teal-600/70 font-mono text-sm mb-6 text-center">{currentWord.phonetic}</p>

             {!showDefinition ? (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm">
                  <div className="flex items-center text-teal-700 bg-white/80 px-6 py-3 rounded-2xl shadow-sm border border-white/50">
                    <Eye className="w-5 h-5 mr-2" /> <span>点击查看释义</span>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center w-full"
                >
                  <p className="text-lg font-medium text-slate-700 mb-6 text-center leading-relaxed">{currentWord.definition}</p>
                  <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent mb-6"></div>
                  <div className="text-left w-full text-sm text-slate-600 space-y-3">
                    {currentWord.exampleEn ? (
                      <>
                        <p className="text-slate-500 font-medium">"{currentWord.exampleEn}"</p>
                        <p className="text-slate-600">{currentWord.exampleZh}</p>
                      </>
                    ) : (
                      <button 
                        onClick={generateExample}
                        disabled={isGeneratingInfo}
                        className="flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors bg-teal-50/50 px-4 py-2 rounded-xl"
                      >
                        {isGeneratingInfo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {isGeneratingInfo ? "生成中..." : "AI 生成例句"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between space-x-4 mb-4">
        <ActionButton 
          label="忘记" 
          disabled={!showDefinition} 
          onClick={() => handleAction('forgot')} 
          variant="danger" 
        />
        <ActionButton 
          label="模糊" 
          disabled={!showDefinition} 
          onClick={() => handleAction('vague')} 
          variant="warning" 
        />
        <ActionButton 
          label="认识" 
          disabled={!showDefinition} 
          onClick={() => handleAction('know')} 
          variant="success" 
        />
      </div>

      {/* Floating Pet Component */}
      <div className="absolute bottom-[5.5rem] right-4 z-20 flex flex-col items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onOpenDressUp(); }}
          className="mb-3 p-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm text-slate-500 hover:text-teal-600 hover:bg-white/80 active:scale-95 transition-all border border-white/60"
        >
          <Shirt className="w-5 h-5" />
        </button>
        <Pet outfit={outfit} isIdle={idleTime > 10} onTap={() => resetIdle()} />
      </div>
    </motion.div>
  );
}

function ActionButton({ label, disabled, onClick, variant }: any) {
  const base = "flex-1 py-4 rounded-2xl font-medium text-sm transition-all duration-300 flex justify-center items-center shadow-sm active:scale-95";
  let styles = "bg-white/30 text-slate-400 border border-white/40 backdrop-blur-md";
  
  if (!disabled) {
    if (variant === 'danger') styles = "bg-rose-50/80 text-rose-600 hover:bg-rose-100/90 border border-rose-200/50";
    if (variant === 'warning') styles = "bg-amber-50/80 text-amber-700 hover:bg-amber-100/90 border border-amber-200/50";
    if (variant === 'success') styles = "bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/90 border border-emerald-200/50";
  }

  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {label}
    </button>
  );
}
