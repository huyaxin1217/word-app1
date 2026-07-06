import React, { useState } from 'react';
import { Word } from '../types';
import { motion } from 'motion/react';
import { Volume2, Search, Filter, BookOpen } from 'lucide-react';
import { playAudio } from '../utils/audio';

export function A4Tab({ words, currentBook, onChangeBook }: { words: Word[], currentBook: string, onChangeBook: (book: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hideDefinition, setHideDefinition] = useState(false);

  const filteredWords = words.filter(w => 
    w.english.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.definition.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">A4 泛背</h1>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <select 
              value={currentBook} 
              onChange={(e) => onChangeBook(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="CET4">四级核心词汇</option>
              <option value="CET6">六级核心词汇</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1">快速浏览所有单词，提升复习效率。</p>
      </div>

      {/* Controls */}
      <div className="px-6 pb-4 flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索单词..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setHideDefinition(!hideDefinition)}
          className={`p-2.5 rounded-xl border transition-colors shadow-sm ${hideDefinition ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-white border-slate-200 text-slate-600'}`}
          title={hideDefinition ? "显示释义" : "隐藏释义"}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Word List */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {filteredWords.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-400 text-sm">
                没有找到匹配的单词
              </div>
            ) : (
              filteredWords.map((word, index) => (
                <div key={word.id} className="group flex items-start border-b border-slate-50 last:border-0 pb-3">
                  <span className="text-slate-300 text-xs w-6 mt-1 flex-shrink-0">{index + 1}.</span>
                  <div className="flex-1 ml-1 flex flex-col justify-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-800 font-semibold">{word.english}</span>
                      <button 
                        onClick={() => playAudio(word.english)}
                        className="text-slate-300 hover:text-teal-500 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    {!hideDefinition && (
                      <span className="text-slate-500 text-sm mt-0.5">{word.definition}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
