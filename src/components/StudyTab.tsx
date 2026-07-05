import React, { useState, useEffect } from 'react';
import { Word, WordFamiliarity, PetOutfit } from '../types';
import { TreeProgress } from './TreeProgress';
import { Pet } from './Pet';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Shirt } from 'lucide-react';

const mockWords: Word[] = [
  { id: '1', english: 'Serendipity', phonetic: '/ˌserənˈdipədē/', definition: '意外发现珍奇事物的本领；机缘凑巧', exampleEn: 'A fortunate stroke of serendipity.', exampleZh: '一次幸运的机缘巧合。', familiarity: 0 },
  { id: '2', english: 'Ephemeral', phonetic: '/əˈfem(ə)rəl/', definition: '短暂的，朝生暮死的', exampleEn: 'Fashions are ephemeral.', exampleZh: '时尚是短暂的。', familiarity: 1 },
];

interface StudyTabProps {
  outfit: PetOutfit;
  onOpenDressUp: () => void;
  onAddCoins: (amount: number) => void;
}

export function StudyTab({ outfit, onOpenDressUp, onAddCoins }: StudyTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [words, setWords] = useState<Word[]>(mockWords);
  const [idleTime, setIdleTime] = useState(0);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetIdle = () => setIdleTime(0);

  const handleAction = (action: 'forgot' | 'vague' | 'know') => {
    resetIdle();
    const updatedWords = [...words];
    let newFam = currentWord.familiarity;
    
    if (action === 'know') {
      newFam = Math.min(3, newFam + 1) as WordFamiliarity;
    } else if (action === 'forgot') {
      newFam = Math.max(0, newFam - 1) as WordFamiliarity;
    }

    updatedWords[currentIndex] = { ...currentWord, familiarity: newFam };
    setWords(updatedWords);

    if (newFam === 3 && currentWord.familiarity < 3) {
      onAddCoins(10);
    }

    setTimeout(() => {
      setShowDefinition(false);
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex flex-col h-full px-6"
      onClick={resetIdle}
    >
      {/* Tree Progress */}
      <div className="h-28 flex items-center justify-center mb-4">
        <TreeProgress familiarity={currentWord.familiarity} />
      </div>

      {/* Word Card - Apple Style Glass Card */}
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
            className="flex-1 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center justify-center relative cursor-pointer overflow-hidden group"
          >
             <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-2 text-center break-words w-full">{currentWord.english}</h2>
             <p className="text-slate-400 font-mono text-sm mb-6 text-center">{currentWord.phonetic}</p>

             {!showDefinition ? (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                  <div className="flex items-center text-slate-600 bg-white/90 px-6 py-3 rounded-full backdrop-blur-md text-sm font-semibold shadow-lg">
                    <Eye className="w-4 h-4 mr-2" /> 点击查看释义
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }} 
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="flex flex-col items-center w-full"
                >
                  <p className="text-lg font-medium text-slate-800 mb-6 text-center">{currentWord.definition}</p>
                  <div className="w-full h-px bg-slate-200/60 mb-6"></div>
                  <div className="text-left w-full text-sm text-slate-600 space-y-2">
                    <p className="italic text-slate-500 font-medium">"{currentWord.exampleEn}"</p>
                    <p>{currentWord.exampleZh}</p>
                  </div>
                </motion.div>
              )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between space-x-3 mb-2">
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
      <div className="absolute bottom-[4.5rem] right-0 z-20 flex flex-col items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onOpenDressUp(); }}
          className="mb-2 p-2.5 bg-white/90 backdrop-blur-xl rounded-full shadow-lg text-slate-600 hover:text-blue-500 hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Shirt className="w-4 h-4" />
        </button>
        <Pet outfit={outfit} isIdle={idleTime > 10} onTap={() => resetIdle()} />
      </div>
    </motion.div>
  );
}

function ActionButton({ label, disabled, onClick, variant }: any) {
  const base = "flex-1 py-4 rounded-[1.5rem] font-semibold text-sm transition-all duration-300 flex justify-center items-center shadow-sm active:scale-95";
  let styles = "bg-white/40 text-slate-400 border border-white/20 backdrop-blur-md";
  
  if (!disabled) {
    if (variant === 'danger') styles = "bg-rose-100/90 text-rose-600 hover:bg-rose-200 border border-rose-200/50";
    if (variant === 'warning') styles = "bg-amber-100/90 text-amber-700 hover:bg-amber-200 border border-amber-200/50";
    if (variant === 'success') styles = "bg-emerald-100/90 text-emerald-700 hover:bg-emerald-200 border border-emerald-200/50";
  }

  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {label}
    </button>
  );
}
