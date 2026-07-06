import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Set persistence to LOCAL (which persists indefinitely until logout, easily satisfying the "half a year" requirement)
      await setPersistence(auth, browserLocalPersistence);
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('该邮箱已被注册');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('邮箱或密码错误');
      } else if (err.code === 'auth/weak-password') {
        setError('密码太弱，请输入至少6位字符');
      } else {
        setError('发生错误，请稍后再试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 relative overflow-hidden">
      {/* Background decoration matching main app */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-sm px-8"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 mb-2">
            {isLogin ? '登录' : '创建账户'}
          </h1>
          <p className="text-slate-500 text-sm">
            开始你的极简词汇学习之旅
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="电子邮件"
                className="w-full bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white rounded-xl py-3 font-medium flex items-center justify-center hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-slate-500 text-sm hover:text-slate-800 transition-colors"
          >
            {isLogin ? '没有账户？点击注册' : '已有账户？点击登录'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
