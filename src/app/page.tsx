"use client";

import { useState } from "react";
import BusinessCard from "@/components/BusinessCard";
import { UploadCloud, Link as LinkIcon, Loader2, ImagePlus, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cvLink, setCvLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);

  const extractTextFromPDF = async (pdfFile: File) => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(" ") + " ";
    }
    return fullText;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(imgFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !cvLink) return alert("Please provide both a PDF and a link.");

    setLoading(true);
    try {
      const rawText = await extractTextFromPDF(file);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, cvLink, image }), 
      });

      if (!res.ok) throw new Error("Failed to generate card");
      const data = await res.json();
      setCardData(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong processing your CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(28,25,23,0))] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-200 relative overflow-x-hidden">
      
      {/* Mobile-Optimized Header */}
      <header className="absolute top-0 w-full max-w-6xl p-4 sm:p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <Sparkles className="text-white" size={16} />
          </div>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Fruor<span className="text-emerald-500">.</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12 max-w-2xl z-10 mt-20 sm:mt-16 w-full px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 sm:mb-6 tracking-tight text-white drop-shadow-xl leading-tight">
          Elevate Your <br className="hidden sm:block"/> Professional Presence.
        </h1>
        <p className="text-stone-400 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto">
          Upload your CV to generate an enterprise-grade digital and printable business card in seconds.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-md px-2 sm:px-0">
        {cardData ? (
          <div className="flex flex-col items-center gap-6 sm:gap-8 animate-in fade-in zoom-in-95 duration-500 w-full">
            <BusinessCard user={cardData} />
            <button 
              onClick={() => setCardData(null)} 
              className="text-sm font-medium text-stone-400 hover:text-white transition flex items-center gap-2 mt-2 sm:mt-4 bg-stone-900/50 px-6 py-3 rounded-full border border-stone-800 backdrop-blur-md"
            >
              Generate another card <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-stone-900/60 backdrop-blur-xl border border-stone-800 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-5 sm:gap-6 w-full">
            
            {/* Photo Upload (Mobile Touch Friendly) */}
            <div className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-stone-950/50 border border-stone-800/50">
              <label className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-stone-600 hover:border-emerald-500 flex items-center justify-center cursor-pointer overflow-hidden transition-colors group bg-stone-900">
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="text-stone-500 group-hover:text-emerald-400 transition-colors" size={20} />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <div className="text-xs sm:text-sm text-stone-400">
                <p className="font-semibold text-stone-200">Profile Photo <span className="text-stone-500 font-normal">(Optional)</span></p>
                <p className="text-[10px] sm:text-xs mt-0.5">Tap to upload a headshot</p>
              </div>
            </div>

            {/* CV Upload */}
            <label className="flex flex-col items-center justify-center w-full h-24 sm:h-28 border-2 border-dashed border-stone-700 rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer group bg-stone-950/30 active:scale-[0.98]">
              <UploadCloud className="text-stone-500 group-hover:text-emerald-400 mb-2 transition-colors" size={24} />
              <span className="text-xs sm:text-sm font-medium text-stone-400 group-hover:text-emerald-400 transition-colors">
                {file ? file.name : "Tap to Upload CV (PDF)"}
              </span>
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
            </label>

            {/* Link Input */}
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
              <input 
                type="url" 
                placeholder="Portfolio or LinkedIn link" 
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm text-stone-200 placeholder:text-stone-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
                value={cvLink} 
                onChange={(e) => setCvLink(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !file || !cvLink} 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 sm:py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> 
                  Generating Identity...
                </>
              ) : (
                "Initialize Card"
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}