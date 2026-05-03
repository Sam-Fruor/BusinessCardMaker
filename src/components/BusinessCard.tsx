"use client";

import { useState, useRef } from "react";
import { User, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Trophy, Printer, Star, Download, CheckCircle2 } from "lucide-react";
import { toPng } from "html-to-image";

// --- Custom Brand Icons ---
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

// --- Material Themes ---
const THEMES = {
  stone: {
    id: 'stone', label: 'Stone Paper', colorHex: '#f5f5f4',
    bg: 'bg-stone-50', textMain: 'text-stone-900', textSub: 'text-stone-700', 
    accent: 'text-emerald-800', border: 'border-stone-300', skillBg: 'bg-stone-800', skillText: 'text-stone-100'
  },
  steel: {
    id: 'steel', label: 'Brushed Steel', colorHex: '#e2e8f0',
    bg: 'bg-slate-200 bg-[linear-gradient(120deg,#f8fafc,#e2e8f0)]', textMain: 'text-slate-900', textSub: 'text-slate-700', 
    accent: 'text-blue-800', border: 'border-slate-400', skillBg: 'bg-slate-800', skillText: 'text-slate-100'
  },
  midnight: {
    id: 'midnight', label: 'Midnight', colorHex: '#030712',
    bg: 'bg-gray-950', textMain: 'text-gray-100', textSub: 'text-gray-400', 
    accent: 'text-indigo-400', border: 'border-gray-800', skillBg: 'bg-gray-800', skillText: 'text-gray-200'
  },
  emerald: {
    id: 'emerald', label: 'Executive', colorHex: '#022c22',
    bg: 'bg-emerald-950', textMain: 'text-emerald-50', textSub: 'text-emerald-400', 
    accent: 'text-amber-400', border: 'border-emerald-800', skillBg: 'bg-emerald-900 border border-emerald-700', skillText: 'text-emerald-100'
  }
};

export default function BusinessCard({ user }: { user: any }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>('stone');
  const [toast, setToast] = useState<string | null>(null);
  
  const exportRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeKey];

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setToast(`${label} copied!`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    try {
      const dataUrl = await toPng(exportRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        backgroundColor: 'rgba(0,0,0,0)' 
      });
      const link = document.createElement("a");
      link.download = `${user.name.replace(/\s+/g, "_")}_Identity.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  // --- REUSABLE COMPONENT: FRONT CARD ---
  const renderFrontCard = () => (
    <div className={`w-[480px] h-[270px] rounded-xl border p-6 flex flex-col justify-between transition-colors duration-300 ${theme.bg} ${theme.border} shadow-2xl`}>
      <div className="flex gap-4">
        <div className={`w-20 h-20 rounded-full border-4 shadow-md flex items-center justify-center overflow-hidden shrink-0 ${themeKey === 'midnight' || themeKey === 'emerald' ? 'bg-stone-800 border-stone-700' : 'bg-stone-200 border-white'}`}>
          {user.image ? <img src={user.image} alt="Profile" className="w-full h-full object-cover" /> : <User size={32} className="text-stone-400" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className={`text-2xl font-serif tracking-tight leading-tight truncate ${theme.textMain}`}>{user.name}</h2>
          <p className={`text-[11px] uppercase tracking-widest font-bold mb-2 truncate ${theme.accent}`}>{user.role}</p>
          
          {/* THE ULTIMATE DYNAMIC GRID */}
          <div className={`grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] uppercase tracking-wider font-semibold leading-tight ${theme.textSub}`}>
            {user.experience && <span className="flex items-start gap-1.5 min-w-0"><Briefcase size={10} className="shrink-0 mt-0.5"/> <span className="break-words">{user.experience}</span></span>}
            {user.education && <span className="flex items-start gap-1.5 min-w-0"><GraduationCap size={10} className="shrink-0 mt-0.5"/> <span className="break-words">{user.education}</span></span>}
            {user.award && <span className={`flex items-start gap-1.5 min-w-0 ${themeKey === 'stone' ? 'text-amber-700' : theme.accent}`}><Trophy size={10} className="shrink-0 mt-0.5"/> <span className="break-words">{user.award}</span></span>}
            {user.website && <span className="flex items-center gap-1.5 min-w-0 hover:text-emerald-500 transition-colors cursor-pointer" onClick={(e) => handleCopy(e, user.website, "Website")}><Globe size={10} className="shrink-0"/> <span className="truncate">{user.website}</span></span>}
            {user.linkedin && <span className="flex items-center gap-1.5 min-w-0 hover:text-emerald-500 transition-colors cursor-pointer" onClick={(e) => handleCopy(e, user.linkedin, "LinkedIn")}><LinkedinIcon size={10} className="shrink-0"/> <span className="truncate">{user.linkedin}</span></span>}
            {user.github && <span className="flex items-center gap-1.5 min-w-0 hover:text-emerald-500 transition-colors cursor-pointer" onClick={(e) => handleCopy(e, user.github, "GitHub")}><GithubIcon size={10} className="shrink-0"/> <span className="truncate">{user.github}</span></span>}
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-start content-start gap-1.5 mt-3">
          {user.skills?.map((skill: string, i: number) => (
            <span key={i} className={`px-2 py-1 text-[9px] uppercase tracking-wider rounded-md shadow-sm ${theme.skillBg} ${theme.skillText}`}>{skill}</span>
          ))}
        </div>
      </div>

      <div className={`pt-3 border-t flex justify-between items-start text-[9px] font-medium leading-tight ${theme.border} ${theme.textMain}`}>
        {user.email ? <span className="flex items-center gap-1.5 min-w-0 hover:text-emerald-500 transition-colors cursor-pointer" onClick={(e) => handleCopy(e, user.email, "Email")}><Mail size={12} className="shrink-0"/> <span className="truncate">{user.email}</span></span> : <span/>}
        {user.phone ? <span className="flex items-center gap-1.5 shrink-0 hover:text-emerald-500 transition-colors cursor-pointer" onClick={(e) => handleCopy(e, user.phone, "Phone")}><Phone size={12} className="shrink-0"/> {user.phone}</span> : <span/>}
        {user.location ? <span className="flex items-start gap-1.5 min-w-0"><MapPin size={12} className="shrink-0 mt-0.5"/> <span className="truncate">{user.location}</span></span> : <span/>}
      </div>
    </div>
  );

  // --- REUSABLE COMPONENT: BACK CARD ---
  const renderBackCard = () => (
    <div className="w-[480px] h-[270px] bg-stone-900 rounded-xl border border-stone-800 p-6 flex items-center shadow-2xl">
      <div className="w-1/3 flex justify-center border-r border-stone-700 pr-6">
        <div className="bg-white p-2 rounded-lg shadow-xl"><img src={user.qrCode} alt="QR Code" className="w-24 h-24" /></div>
      </div>
      <div className="w-2/3 pl-6 flex flex-col justify-center">
        <div className="mb-4">
          <h3 className="text-stone-300 font-serif text-lg tracking-wide mb-1">About</h3>
          <p className="text-[11px] text-stone-400 leading-relaxed font-light break-words">{user.summary || "Scan the QR code to view my complete professional history, portfolio, and contact information."}</p>
        </div>
        {user.featured_project && (
          <div className="pt-3 border-t border-stone-800">
            <h3 className="text-emerald-500 font-serif text-[10px] tracking-widest uppercase flex items-center gap-1 mb-1"><Star size={10} /> Featured Work</h3>
            <p className="text-[10px] text-stone-500 italic leading-snug break-words">{user.featured_project}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="absolute -top-12 z-50 animate-in slide-in-from-bottom-2 fade-in flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* Theme Selector */}
      <div className="print:hidden flex items-center gap-3 bg-stone-900/80 p-2 rounded-full border border-stone-800 backdrop-blur-md">
        {Object.values(THEMES).map((t) => (
          <button
            key={t.id} onClick={() => setThemeKey(t.id as keyof typeof THEMES)} title={t.label}
            className={`w-6 h-6 rounded-full border-2 transition-all ${themeKey === t.id ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent hover:scale-110'}`}
            style={{ backgroundColor: t.colorHex }}
          />
        ))}
      </div>

      {/* --- SCREEN VIEW (Interactive 3D on Mobile Scaler) --- */}
      <div className="w-full flex justify-center scale-[0.70] sm:scale-100 origin-top mb-[-75px] sm:mb-0 transition-transform duration-300">
        <div className="print:hidden w-[480px] h-[270px] [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
              {renderFrontCard()}
            </div>
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {renderBackCard()}
            </div>
          </div>
        </div>
      </div> 

      {/* --- HIDDEN EXPORT ENGINE (For PNG Download) --- */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={exportRef} className="flex flex-col gap-6 p-6 bg-transparent w-[528px]">
          {renderFrontCard()}
          {renderBackCard()}
        </div>
      </div>

      {/* --- PRINT VIEW (For Physical Paper) --- */}
      <div className="hidden print:flex flex-col gap-8 w-[3.5in]">
        <div className="h-[2in] bg-white border border-black p-4 flex flex-col overflow-hidden">
          <div className="flex gap-3 items-start border-b border-gray-400 pb-2 mb-2">
            {user.image && <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-500 shrink-0" />}
            <div className="flex-1 w-full">
              <h2 className="text-lg font-serif text-black leading-tight">{user.name}</h2>
              <p className="text-[7px] uppercase tracking-widest text-black font-bold mb-1.5">{user.role}</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[6px] text-gray-900 leading-tight">
                {user.experience && <span><strong className="font-semibold">Exp:</strong> {user.experience}</span>}
                {user.education && <span><strong className="font-semibold">Edu:</strong> {user.education}</span>}
                {user.award && <span><strong className="font-semibold">Honors:</strong> {user.award}</span>}
                {user.website && <span><strong className="font-semibold">Web:</strong> {user.website}</span>}
                {user.linkedin && <span><strong className="font-semibold">In:</strong> {user.linkedin}</span>}
                {user.github && <span><strong className="font-semibold">Git:</strong> {user.github}</span>}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap items-start content-start gap-1 pt-1">
            {user.skills?.map((skill: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 border border-gray-500 text-black font-medium text-[6px] uppercase rounded">{skill}</span>
            ))}
          </div>
          <div className="mt-auto pt-2 border-t border-gray-400 flex justify-between items-center text-[6px] font-medium text-black">
            {user.email && <span>{user.email}</span>}
            {user.phone && <span>{user.phone}</span>}
            {user.location && <span>{user.location}</span>}
          </div>
        </div>
        <div className="h-[2in] bg-white border border-black p-4 flex items-center overflow-hidden">
          <div className="w-1/3 border-r border-gray-400 pr-3"><img src={user.qrCode} alt="QR Code" className="w-full h-auto" /></div>
          <div className="w-2/3 pl-3 flex flex-col justify-center">
            <div className="mb-2">
              <h3 className="font-serif text-xs font-bold text-black mb-0.5">About</h3>
              <p className="text-[7px] text-gray-900 leading-snug">{user.summary || "Scan the QR code to view my complete professional history, portfolio, and contact information."}</p>
            </div>
            {user.featured_project && (
              <div className="pt-2 border-t border-gray-300 mt-1">
                <h3 className="font-serif text-[6px] font-bold text-black uppercase mb-0.5">Featured Work</h3>
                <p className="text-[6px] text-gray-800 leading-tight">{user.featured_project}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-2">
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium rounded-xl transition border border-stone-700 shadow-lg active:scale-[0.98]"
        >
          <Printer size={18} /> Print Card
        </button>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition border border-emerald-600 shadow-lg active:scale-[0.98]"
        >
          <Download size={18} /> Save PNG
        </button>
      </div>

    </div>
  );
}