import React from 'react';
import { X, Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';

interface ArticleModalProps {
  article: {
    id: string;
    category: string;
    date: string;
    title: string;
    summary: string;
    imageUrl: string;
    readTime: string;
  } | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181A20] border border-[#2D3139] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#111318] text-slate-400 hover:text-white border border-[#2D3139] hover:border-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Hero */}
        <div className="h-56 sm:h-72 rounded-2xl overflow-hidden relative border border-[#2D3139]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-[#111318]/90 backdrop-blur-md px-2.5 py-1 rounded text-xs text-indigo-400 font-bold border border-[#2D3139]">
            {article.category} • {article.date}
          </div>
        </div>

        {/* Article Details */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            {article.title}
          </h2>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-b border-[#2D3139] pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{article.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{article.readTime}</span>
            </span>
            <span className="text-emerald-400 font-semibold">
              Art N Speed Lab Editorial
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed space-y-3">
            <p className="font-semibold text-indigo-300">
              {article.summary}
            </p>
            <p>
              Motor matic memerlukan perhatian khusus terutama pada sistem pendinginan (radiator cairan coolant) dan elastisitas karet V-belt transmisi CVT saat temperatur jalanan meningkat drastis.
            </p>
            <p>
              Di Art N Speed Mechanical Lab, tim kami melakukan pengecekan 21 titik presisi, termasuk ketebalan kampas ganda, kebersihan ruang CVT dari kontaminasi debu friksi, serta kalibrasi debit injektor agar mesin tidak mengalami knocking (ngelitik) dan boros bensin.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#111318] hover:bg-[#1F222A] text-slate-200 hover:text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider border border-[#2D3139] transition-colors"
        >
          Tutup Artikel
        </button>

      </div>
    </div>
  );
};
