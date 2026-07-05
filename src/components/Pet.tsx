import React, { useState, useEffect } from 'react';
import { PetOutfit } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PetProps {
  outfit: PetOutfit;
  isIdle: boolean;
  onTap: () => void;
}

export function Pet({ outfit, isIdle, onTap }: PetProps) {
  const [quote, setQuote] = useState("今天也要加油哦！");
  const [showQuote, setShowQuote] = useState(true);

  const idleQuotes = [
    "累了吗？休息一下眼睛吧~",
    "不要放弃，你很棒！",
    "背单词就像种树，慢慢来。",
    "我在陪着你哦！",
    "摸摸我！"
  ];

  useEffect(() => {
    if (isIdle) {
      setQuote(idleQuotes[Math.floor(Math.random() * idleQuotes.length)]);
      setShowQuote(true);
      const timer = setTimeout(() => setShowQuote(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isIdle]);

  const handleTap = () => {
    setQuote("好痒！哈哈~");
    setShowQuote(true);
    onTap();
    setTimeout(() => setShowQuote(false), 3000);
  };

  return (
    <div className="relative flex flex-col items-center cursor-pointer select-none" onClick={handleTap}>
      <AnimatePresence>
        {showQuote && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-12 whitespace-nowrap bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-medium text-slate-600 shadow-sm border border-white/50 z-10"
          >
            {quote}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/80 rotate-45 border-r border-b border-white/50"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          y: [0, -8, 0],
          scale: isIdle ? [1, 1.05, 1] : 1
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: isIdle ? 3 : 4,
          ease: "easeInOut"
        }}
        className="relative w-16 h-16"
      >
        {/* Base Slime Body */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path 
            d="M50 90 C 20 90, 10 70, 10 50 C 10 30, 30 15, 50 15 C 70 15, 90 30, 90 50 C 90 70, 80 90, 50 90 Z" 
            fill="#a7f3d0" 
            stroke="#34d399" 
            strokeWidth="3"
          />
          {/* Eyes */}
          <circle cx="35" cy="45" r="4" fill="#334155" />
          <circle cx="65" cy="45" r="4" fill="#334155" />
          {/* Blush */}
          <ellipse cx="25" cy="52" rx="5" ry="3" fill="#fecdd3" opacity="0.6" />
          <ellipse cx="75" cy="52" rx="5" ry="3" fill="#fecdd3" opacity="0.6" />
          {/* Mouth */}
          <path d="M 45 55 Q 50 60 55 55" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Highlight */}
          <path d="M 25 30 Q 40 20 60 25" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4" />
        </svg>

        {/* Accessories */}
        {outfit === 'hat' && (
          <motion.div initial={{y: -10, opacity: 0}} animate={{y:0, opacity: 1}} className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10">
            <svg viewBox="0 0 100 100">
              <path d="M 20 80 L 80 80 L 70 40 C 70 20, 30 20, 30 40 Z" fill="#fcd34d" />
              <rect x="10" y="80" width="80" height="10" rx="5" fill="#f59e0b" />
            </svg>
          </motion.div>
        )}
        {outfit === 'glasses' && (
          <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} className="absolute top-8 left-1/2 -translate-x-1/2 w-14 h-6">
            <svg viewBox="0 0 100 40">
              <rect x="10" y="10" width="30" height="20" rx="5" fill="#1e293b" />
              <rect x="60" y="10" width="30" height="20" rx="5" fill="#1e293b" />
              <line x1="40" y1="20" x2="60" y2="20" stroke="#1e293b" strokeWidth="3" />
            </svg>
          </motion.div>
        )}
        {outfit === 'headphone' && (
          <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-12">
            <svg viewBox="0 0 100 100">
              <path d="M 20 50 C 20 20, 80 20, 80 50" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <rect x="5" y="40" width="20" height="30" rx="5" fill="#3b82f6" />
              <rect x="75" y="40" width="20" height="30" rx="5" fill="#3b82f6" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
