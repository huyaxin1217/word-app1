import React from 'react';
import { motion } from 'motion/react';

export function ProgressTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex flex-col h-full px-6 py-4"
    >
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">正在学习</h2>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-sm border border-white mb-6">
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight mb-1">考研英语真题词汇</h3>
        <p className="text-sm text-slate-500 mb-6">已学习 45 / 5500 词</p>
        
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '15%' }}
            transition={{ duration: 1.5, delay: 0.2, type: 'spring', damping: 20 }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50/80 backdrop-blur-md rounded-[2rem] p-5 border border-emerald-100 shadow-sm flex flex-col justify-center">
          <span className="text-emerald-800 font-bold text-4xl tracking-tighter mb-1">12</span>
          <span className="text-emerald-600 text-sm font-medium">成型树木 (棵)</span>
        </div>
        <div className="bg-amber-50/80 backdrop-blur-md rounded-[2rem] p-5 border border-amber-100 shadow-sm flex flex-col justify-center">
          <span className="text-amber-800 font-bold text-4xl tracking-tighter mb-1">120</span>
          <span className="text-amber-600 text-sm font-medium">获取金币 (G)</span>
        </div>
      </div>
    </motion.div>
  );
}
