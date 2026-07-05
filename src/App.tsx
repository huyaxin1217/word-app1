import { MainApp } from './components/MainApp';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-8">
      {/* Container for Desktop viewers, clean unbranded generic rectangle */}
      <div className="w-full h-[100dvh] sm:h-[844px] max-w-[390px] bg-slate-50 rounded-none sm:rounded-[2rem] shadow-none sm:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden relative ring-1 ring-white/10 border border-slate-700/50">
        <MainApp />
      </div>
    </div>
  );
}
