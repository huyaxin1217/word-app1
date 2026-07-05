import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetOutfit } from '../types';
import { Pet } from './Pet';
import { X, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomModal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40" 
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl rounded-t-[2.5rem] p-6 pt-4 border-t border-white shadow-2xl z-50 flex flex-col max-h-[85vh]"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-8 hide-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function PetDressUpModal({ isOpen, onClose, currentOutfit, onSelectOutfit }: { isOpen: boolean, onClose: () => void, currentOutfit: PetOutfit, onSelectOutfit: (o: PetOutfit) => void }) {
  const items: { id: PetOutfit, name: string, emoji: string }[] = [
    { id: 'none', name: '默认', emoji: '🌱' },
    { id: 'hat', name: '探险帽', emoji: '🎩' },
    { id: 'glasses', name: '学霸镜', emoji: '👓' },
    { id: 'headphone', name: '音乐耳机', emoji: '🎧' },
  ];

  return (
    <BottomModal isOpen={isOpen} onClose={onClose} title="宠物换装">
      <div className="flex flex-col items-center">
        {/* Preview Area */}
        <div className="w-32 h-32 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center mb-8 shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-50" />
           <div className="scale-150">
             <Pet outfit={currentOutfit} isIdle={false} onTap={() => {}} />
           </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {items.map(item => {
            const isActive = currentOutfit === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => onSelectOutfit(item.id)}
                className={`relative p-4 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' : 'bg-white border-2 border-slate-100 hover:border-slate-200'}`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 text-blue-500">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                <span className="text-3xl mb-2 block">{item.emoji}</span>
                <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>{item.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </BottomModal>
  );
}

export function UserProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <BottomModal isOpen={isOpen} onClose={onClose} title="账号与设置">
      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-[2rem]">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-emerald-400 rounded-full shadow-sm" />
          <div>
            <h4 className="font-semibold text-lg text-slate-800">学习者 89757</h4>
            <p className="text-sm text-slate-500">已连续学习 12 天</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-2">偏好设置</h5>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <SettingRow label="每日学习目标" value="50 词" />
            <div className="h-px bg-slate-100 mx-4" />
            <SettingRow label="发音口音" value="美音" />
            <div className="h-px bg-slate-100 mx-4" />
            <SettingRow label="A4纸泛背模式" value="关闭" />
          </div>
        </div>
        
        <button className="w-full py-4 text-rose-500 font-semibold bg-rose-50 rounded-3xl border border-rose-100 active:bg-rose-100 transition-colors">
          退出登录
        </button>
      </div>
    </BottomModal>
  );
}

function SettingRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
      <span className="text-slate-700 font-medium">{label}</span>
      <div className="flex items-center text-slate-400">
        <span className="text-sm mr-2">{value}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
