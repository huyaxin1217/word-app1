import React from 'react';
import { motion } from 'motion/react';
import { Book, CheckCircle } from 'lucide-react';

export function LibraryTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex flex-col h-full px-6 py-4"
    >
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">词书更换</h2>
      
      <div className="space-y-4 overflow-y-auto pb-20 hide-scrollbar">
        <BookCard title="考研英语真题词汇" desc="包含 2010-2023 年高频词汇" isCurrent />
        <BookCard title="四级核心词汇" desc="精选 2000 个四级必背单词" />
        <BookCard title="六级核心词汇" desc="精选 2500 个六级必背单词" />
        <BookCard title="雅思核心词汇" desc="雅思 7.0 必备词汇集合" />
      </div>
    </motion.div>
  );
}

function BookCard({ title, desc, isCurrent }: any) {
  return (
    <div className={`p-5 rounded-[2rem] border ${isCurrent ? 'bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white/80 backdrop-blur-xl text-slate-800 border-white shadow-sm'} flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-2xl ${isCurrent ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
          <Book className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
          <p className={`text-sm mt-0.5 ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>{desc}</p>
        </div>
      </div>
      {isCurrent && <CheckCircle className="w-6 h-6 text-white" />}
    </div>
  );
}
