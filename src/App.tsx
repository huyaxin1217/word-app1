import { MainApp } from './components/MainApp';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-8">
      {/* Mobile Container Simulation for Desktop viewers */}
      <div className="w-full h-[100dvh] sm:h-[844px] max-w-[390px] bg-white rounded-none sm:rounded-[3rem] shadow-none sm:shadow-[0_0_0_12px_#334155,0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden relative ring-1 ring-slate-900/5">
        <MainApp />
      </div>
    </div>
  );
}
