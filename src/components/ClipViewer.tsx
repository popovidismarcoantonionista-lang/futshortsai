import React, { useState, useMemo } from "react";
import { 
  Tv, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Bookmark, 
  Share2, 
  Eye, 
  Zap,
  Tag,
  Clock,
  Heart,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen
} from "lucide-react";
import { MatchAnalysis, VideoClip } from "../types";

interface ClipViewerProps {
  analysis: MatchAnalysis;
  onIndividualDownload: (clipId: string) => void;
  onDownloadBatch: (clipIds: string[], matchId: string) => void;
  onDownloadKit: (matchId: string) => void;
  isDownloadingBatch: boolean;
  isDownloadingKit: boolean;
}

export default function ClipViewer({ 
  analysis, 
  onIndividualDownload, 
  onDownloadBatch, 
  onDownloadKit,
  isDownloadingBatch,
  isDownloadingKit
}: ClipViewerProps) {
  const [selectedClipId, setSelectedClipId] = useState<string>(analysis.clips[0]?.id || "");
  const [selectedLength, setSelectedLength] = useState<30 | 45 | 60 | 90>(30);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<"shorts" | "tiktok" | "reels">("shorts");
  const [sortBy, setSortBy] = useState<"default" | "viral" | "duration-asc" | "duration-desc">("default");
  const [viewMode, setViewMode] = useState<"cards" | "workspace">("cards");

  const sortedClips = useMemo(() => {
    const clipsCopy = [...analysis.clips];
    if (sortBy === "viral") {
      return clipsCopy.sort((a, b) => b.scores.viral - a.scores.viral);
    }
    if (sortBy === "duration-asc") {
      return clipsCopy.sort((a, b) => a.duration - b.duration);
    }
    if (sortBy === "duration-desc") {
      return clipsCopy.sort((a, b) => b.duration - a.duration);
    }
    return clipsCopy;
  }, [analysis.clips, sortBy]);

  const currentClip = analysis.clips.find(c => c.id === selectedClipId) || analysis.clips[0];

  if (!currentClip) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400 font-mono text-xs">
        Nenhum clipe de futebol disponível para esta partida. Envie um vídeo primeiro.
      </div>
    );
  }

  // Calculate dynamic sliced timestamps based on selectedLength user choice
  const calculateDynamicTimestamps = (clip: VideoClip, len: number) => {
    const originalStart = clip.timestamps.start;
    const parts = originalStart.split(":");
    const startSec = parts.length === 2 ? (parseInt(parts[0]) * 60 + parseInt(parts[1])) : 65;
    const endSec = startSec + len;
    
    const formatTime = (totalSecs: number) => {
      const m = Math.floor(totalSecs / 60);
      const s = totalSecs % 60;
      return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
    };

    return {
      start: originalStart,
      end: formatTime(endSec)
    };
  };

  const activeSegmentTimes = calculateDynamicTimestamps(currentClip, selectedLength);

  const handleCopyText = (text: string, index: number, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedIndex(null);
      setCopiedType(null);
    }, 2000);
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "gol": return "bg-red-500/20 text-red-300 border border-red-500/30";
      case "polêmica": return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      case "cartão": return "bg-red-655/20 text-rose-300 border border-red-600/30";
      case "provocação": return "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30";
      case "análise tática": return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "quase gol": return "bg-orange-500/20 text-orange-300 border border-orange-500/25";
      case "assistência": return "bg-teal-500/20 text-teal-350 border border-teal-500/25";
      case "entrevista": return "bg-sky-500/20 text-sky-305 border border-sky-505/25";
      case "bastidores": return "bg-emerald-500/20 text-emerald-350 border border-emerald-505/25";
      default: return "bg-brand-neon/20 text-brand-neon border border-brand-neon/30";
    }
  };

  const handlePreviewClip = (clipId: string) => {
    setSelectedClipId(clipId);
    setViewMode("workspace");
  };

  return (
    <div className="space-y-6" id="clip-viewer-root">
      {/* Batch Actions & Meta Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-950 border border-gray-800 p-5 rounded-2xl" id="clip-header-actions">
        <div>
          <span className="text-[10px] bg-brand-neon/10 text-brand-neon border border-brand-neon/30 font-mono px-2.5 py-0.5 rounded uppercase font-bold">
            Clipping Concluído com Sucesso
          </span>
          <h3 className="text-base font-display font-bold text-white mt-2 flex items-center gap-2">
            ⚽️ {analysis.matchInfo.teams}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{analysis.matchInfo.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onDownloadBatch(analysis.clips.map(c => c.id), analysis.id)}
            disabled={isDownloadingBatch}
            className="px-4.5 py-2.5 bg-gray-901 border border-gray-800 hover:bg-gray-850 hover:border-gray-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 font-mono"
            id="download-batch-btn"
          >
            {isDownloadingBatch ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-brand-neon" />
            )}
            <span>BAIXAR TODOS (.ZIP)</span>
          </button>

          <button
            onClick={() => onDownloadKit(analysis.id)}
            disabled={isDownloadingKit}
            className="px-4.5 py-2.5 bg-brand-neon hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-brand-neon/10 font-mono"
            id="download-kit-btn"
          >
            {isDownloadingKit ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-black text-black" />
            )}
            <span>BAIXAR KIT COMPLETO</span>
          </button>
        </div>
      </div>

      {/* VIEW TOGGLE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-850 pb-4">
        <div className="flex items-center gap-2 bg-gray-950 p-1 rounded-xl border border-gray-850">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2 ${
              viewMode === "cards" 
                ? "bg-brand-neon text-black" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GRADE DE CARDS ({analysis.clips.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode("workspace")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2 ${
              viewMode === "workspace" 
                ? "bg-brand-neon text-black" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>MESA DE EDIÇÃO</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[10px] uppercase font-mono text-gray-500 whitespace-nowrap">Ordenar cortes:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-950 border border-gray-800 text-[11px] font-mono font-bold text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-neon cursor-pointer outline-none"
            id="clip-sort-select"
          >
            <option value="default">Ordem tática</option>
            <option value="viral">Score Viral (Mais Altos)</option>
            <option value="duration-asc">Duração (Menor)</option>
            <option value="duration-desc">Duração (Maior)</option>
          </select>
        </div>
      </div>

      {/* RENDER VIEWMODE DIRECTIVE */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="clips-cards-grid">
          {sortedClips.map((clip) => {
            const originalIndex = analysis.clips.findIndex(c => c.id === clip.id);
            return (
              <div 
                key={clip.id}
                className="bg-gray-900 border border-gray-850 hover:border-gray-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group relative"
                id={`clip-card-${clip.id}`}
              >
                {/* 1. Portrait Thumbnail Container (Simulated Soccer Pitch) */}
                <div className="relative aspect-[9/16] bg-gray-950 flex flex-col justify-between p-4 overflow-hidden soccer-field-graphic border-b border-gray-850">
                  {/* Subtle Soccer Pitch Layout lines backdrop */}
                  <div className="absolute inset-0 opacity-[0.05] border-2 border-white m-6 pointer-events-none rounded flex items-center justify-center">
                    <div className="w-1/2 h-full border-r border-white" />
                    <div className="w-16 h-16 rounded-full border-2 border-white absolute" />
                  </div>

                  {/* Top line metadata overlay */}
                  <div className="z-10 flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 bg-black/60 px-2.5 py-0.5 rounded border border-gray-800">
                      CORTE #0{originalIndex + 1}
                    </span>
                    <span className={`text-[9px] font-mono uppercase font-black px-2.5 py-0.5 rounded border shadow-sm ${getCategoryTheme(clip.category)}`}>
                      {clip.category}
                    </span>
                  </div>

                  {/* 2. Visual Preview & Play Simulation Trigger (Center of card) */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                      onClick={() => handlePreviewClip(clip.id)}
                      className="w-14 h-14 bg-brand-neon text-black rounded-full flex items-center justify-center shadow-lg shadow-brand-neon/20 hover:scale-105 active:scale-95 transition-all outline-none"
                      title="Assistir Pré-visualização com Áudio"
                    >
                      <Tv className="w-6 h-6 ml-0 text-black fill-black/10" />
                    </button>
                    {/* Pulsing indicator banner */}
                    <div className="absolute bottom-[28%] bg-black/60 border border-white/5 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-mono text-brand-neon uppercase font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-brand-neon rounded-full animate-ping" />
                      <span>PRÉ-VISUALIZAR</span>
                    </div>
                  </div>

                  {/* 3D-styled clickbait Thumbnail Text overlay on the bottom */}
                  <div className="z-10 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent p-3 pt-12 -mx-4 -mb-4 space-y-2">
                    <h5 
                      className="text-lg font-display font-black leading-none uppercase tracking-tighter text-center"
                      style={{ 
                        color: clip.thumbnail.suggestedColors[0] || "#FBBF24",
                        textShadow: "2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #050, -1px 1px 0px #000"
                      }}
                    >
                      {clip.thumbnail.text}
                    </h5>
                    <p className="text-[9.5px] text-gray-400 text-center font-mono leading-tight line-clamp-2 italic px-2">
                      "{clip.thumbnail.layoutDescription}"
                    </p>
                  </div>
                </div>

                {/* 2. Textual metadata & copy information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-gray-900">
                  <div className="space-y-2">
                    {/* Suggested dynamic social title */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white leading-relaxed line-clamp-2">
                        {clip.title}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-gray-500 whitespace-nowrap uppercase">
                        ⏱️ {clip.duration}s
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                      {clip.report.whySelected}
                    </p>
                  </div>

                  {/* Progress Matrix inside Card */}
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-brand-neon font-bold flex items-center gap-1">
                        🔥 Viral Score: {clip.scores.viral}%
                      </span>
                      <span className="text-gray-500">
                        Retenção: {clip.scores.retention}%
                      </span>
                    </div>
                    {/* Linear glowing progress bar */}
                    <div className="w-full h-1 bg-gray-850 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-neon" style={{ width: `${clip.scores.viral}%` }} />
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center justify-between gap-2.5 pt-1">
                    <button
                      onClick={() => handlePreviewClip(clip.id)}
                      className="px-3.5 py-2 text-[11px] font-mono font-bold text-gray-300 hover:text-white bg-gray-950 hover:bg-gray-855 border border-gray-850 rounded-xl transition-all flex items-center gap-1 flex-1 justify-center"
                    >
                      <span>TEXTOS DO KIT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onIndividualDownload(clip.id)}
                      className="px-4 py-2 bg-brand-neon hover:opacity-90 text-black text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-brand-neon/5 font-mono"
                    >
                      <Download className="w-3.5 h-3.5 text-black" />
                      <span>BAIXAR MP4</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ORIGINAL WORKSPACE SPLIT (OPUSCLIP SaaS COMPONENT) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="clip-viewer-split">
          {/* Left column: List of clips with interactive sorting switcher */}
          <div className="lg:col-span-4 space-y-3" id="clips-navigation-list">
            <div className="flex items-center justify-between px-1 pb-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brand-neon" />
                CORTES DETECTADOS ({analysis.clips.length})
              </h4>
            </div>
            
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {sortedClips.map((clip) => {
                const isActive = clip.id === selectedClipId;
                const originalIndex = analysis.clips.findIndex(c => c.id === clip.id);
                return (
                  <button
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col gap-2 cursor-pointer ${
                      isActive 
                        ? "bg-gray-800 border-brand-neon shadow shadow-brand-neon/10" 
                        : "bg-gray-900 border-gray-850 hover:border-gray-800 hover:bg-gray-850"
                    }`}
                    id={`clip-nav-${clip.id}`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-[10px] font-mono font-bold text-gray-500">
                        CORTE #0{originalIndex + 1}
                      </span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${getCategoryTheme(clip.category)}`}>
                        {clip.category}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-white line-clamp-1">
                      {clip.title}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {clip.timestamps.start} • {clip.duration}s
                      </span>
                      <span className="flex items-center gap-1 font-mono text-brand-neon font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {clip.scores.viral} Score
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column: Interactive Sandbox Workspace */}
          <div className="lg:col-span-8 space-y-6" id="clip-sandbox-workspace">
            {/* Main workspace section */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Topbar: Clip Name and Dynamic Duration Toggle */}
              <div className="p-4 bg-gray-950 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${getCategoryTheme(currentClip.category)}`}>
                    {currentClip.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{currentClip.title}</h4>
                </div>

                {/* Multi-duration variant requested */}
                <div className="bg-gray-900 p-1 rounded-lg border border-gray-800 flex items-center">
                  <span className="text-[10px] font-mono text-gray-500 px-2 uppercase">Tempo:</span>
                  {[30, 45, 60, 90].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSelectedLength(dur as any)}
                      className={`px-2 py-1 text-[10px] font-mono font-bold rounded transition-all ${
                        selectedLength === dur 
                          ? "bg-brand-neon text-black font-semibold" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Player Canvas Simulation */}
              <div className="relative aspect-video bg-black/60 flex items-center justify-center p-4 pitch-grid" id="soccer-player-canvas">
                {/* Field Lines Simulation Backdrop */}
                <div className="absolute inset-0 border-[3px] border-white/5 m-10 pointer-events-none rounded flex items-center justify-center">
                  <div className="w-1/2 h-full border-r border-white/5" />
                  <div className="w-24 h-24 rounded-full border-2 border-white/5 absolute" />
                </div>

                {/* Animated Screen Overlay of the Soccer Video Match Slicer */}
                <div className="z-10 text-center max-w-sm bg-gray-950/90 border border-gray-800 p-6 rounded-xl space-y-4">
                  <div className="bg-brand-neon/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-brand-neon animate-pulse border border-brand-neon/20">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono tracking-widest text-brand-neon uppercase font-bold">Preview Inteligente de Canal</h5>
                    <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-sans">
                      Sincronizando feed de futebol de <span className="text-white font-mono font-bold">{activeSegmentTimes.start}</span> até <span className="text-white font-mono font-bold">{activeSegmentTimes.end}</span> ({selectedLength} segundos).
                    </p>
                  </div>

                  {/* Simulated Audio Stream Wave Bar */}
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 5, 7, 8, 5, 2].map((val, i) => (
                      <span 
                        key={i} 
                        className="w-1 bg-brand-neon rounded-full transition-all duration-300"
                        style={{ 
                          height: `${val * 3}px`,
                          animation: `pulse 1.2s infinite ease-in-out ${i * 0.05}s`
                        }} 
                      />
                    ))}
                  </div>

                  {/* Simulated video playback indicators */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button 
                      onClick={() => onIndividualDownload(currentClip.id)}
                      className="px-4 py-1.5 bg-brand-neon text-black text-[11px] font-bold rounded-md hover:bg-opacity-95 flex items-center gap-1 transition-all glow-btn"
                    >
                      <Download className="w-3 h-3" /> Baixar Corte MP4
                    </button>
                    <span className="text-[10px] text-gray-500 font-mono">FUT_CLIP_0{selectedLength}S.MP4</span>
                  </div>
                </div>

                {/* Small branding anchor */}
                <span className="absolute bottom-3 right-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-gray-950 px-2 py-0.5 rounded">
                  Live Renderer v1.2
                </span>
              </div>

              {/* Virality Scoring Matrix */}
              <div className="p-4 bg-gray-950/60 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center" id="viral-scoring-matrix">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">Viral Score</span>
                  <span className="block text-lg font-display font-black text-brand-neon mt-1">
                    🔥 {currentClip.scores.viral}
                  </span>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-1.5 overflow-hidden">
                    <div className="h-full bg-brand-neon" style={{ width: `${currentClip.scores.viral}%` }} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">Retenção AI</span>
                  <span className="block text-lg font-display font-black text-cyan-400 mt-1">
                    👁️ {currentClip.scores.retention}
                  </span>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-1.5 overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${currentClip.scores.retention}%` }} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">Engajamento</span>
                  <span className="block text-lg font-display font-black text-rose-400 mt-1">
                    💬 {currentClip.scores.engagement}
                  </span>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-1.5 overflow-hidden">
                    <div className="h-full bg-rose-400" style={{ width: `${currentClip.scores.engagement}%` }} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">CTR Estimado</span>
                  <span className="block text-lg font-display font-black text-amber-400 mt-1">
                    📈 {currentClip.scores.ctr}
                  </span>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-1.5 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${currentClip.scores.ctr}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Title Multi-Generation Package Component */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4" id="titles-pack-container">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-neon" />
                TÍTULOS VIRAIS AUTOMÁTICOS (10 OPÇÕES DE ENGAJAMENTO)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentClip.titles.map((titleText, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gray-950 p-2.5 rounded-lg border border-gray-850 hover:border-gray-800 flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="text-gray-300 font-medium line-clamp-1 pr-2 font-sans">
                      <span className="text-brand-neon text-[10px] font-mono mr-1.5">#{idx + 1}</span> {titleText}
                    </span>
                    <button
                      onClick={() => handleCopyText(titleText, idx, "title")}
                      className="p-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded text-[10px] font-mono flex items-center gap-1 transition-colors"
                      title="Copiar Título"
                    >
                      {copiedIndex === idx && copiedType === "title" ? (
                        <Check className="w-3.5 h-3.5 text-brand-neon" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedIndex === idx && copiedType === "title" ? "Ok!" : "Copiar"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Descriptions Tab panel */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4" id="desc-pack-container">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-neon" />
                  Copiar Descrições Prontas por Plataforma
                </h4>
                <div className="flex gap-1.5 bg-gray-950 p-1 rounded-md border border-gray-850">
                  {(["shorts", "tiktok", "reels"] as const).map((net) => (
                    <button
                      key={net}
                      onClick={() => setSelectedNetwork(net)}
                      className={`px-2 py-1 text-[10px] font-mono uppercase rounded transition-all ${
                        selectedNetwork === net 
                          ? "bg-brand-neon text-black font-semibold" 
                          : "text-gray-400"
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 relative">
                <p className="text-xs text-gray-200 leading-relaxed pr-8 whitespace-pre-wrap font-sans">
                  {currentClip.descriptions[selectedNetwork]}
                </p>
                
                <button
                  onClick={() => handleCopyText(currentClip.descriptions[selectedNetwork], 99, "desc")}
                  className="absolute top-3.5 right-3.5 p-1.5 bg-gray-850/80 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white rounded flex items-center gap-1"
                  title="Copiar tudo"
                >
                  {copiedIndex === 99 && copiedType === "desc" ? (
                    <Check className="w-4 h-4 text-brand-neon" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Hashtags display */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-mono text-gray-500 mr-2 flex items-center gap-1">
                  💡 Hashtags:
                </span>
                {currentClip.hashtags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="bg-brand-neon/10 text-brand-neon text-[10px] font-mono px-2 py-0.5 rounded border border-brand-neon/20 hover:bg-brand-neon/20 transition-all cursor-pointer"
                    onClick={() => handleCopyText(`#${tag}`, i, "hashtag")}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Thumbnail Builder Planner */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4" id="thumb-suggestions-container">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-neon" />
                SUGESTÃO DE THUMBNAIL RECOMENDADA PELO ALGORITMO
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thumbnail Suggestion card */}
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col justify-between" id="thumb-visual-planner">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-brand-neon/10 text-brand-neon border border-brand-neon/20 font-mono px-2 py-0.5 rounded uppercase font-bold">TEXTO EM DESTAQUE</span>
                    </div>
                    <h5 className="text-lg font-display font-extrabold tracking-tight uppercase leading-none" style={{ color: currentClip.thumbnail.suggestedColors[0] }}>
                      {currentClip.thumbnail.text}
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      <strong className="text-white">Estrutura Sugerida:</strong> {currentClip.thumbnail.layoutDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500">Paleta de alto impacto:</span>
                    <div className="flex gap-1.5">
                      {currentClip.thumbnail.suggestedColors.map((color, idx) => (
                        <span 
                          key={idx} 
                          className="w-5 h-5 rounded border border-white/20 inline-block shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Efficacy explanation report */}
                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800 space-y-3" id="ai-emotional-report">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-neon" />
                    <span className="text-xs font-mono text-gray-400 uppercase font-bold">Diagnóstico Psicológico do Vídeo</span>
                  </div>
                  
                  <div className="space-y-2 text-xs font-sans">
                    <p className="text-gray-350 leading-relaxed font-sans">
                      <strong className="text-brand-neon">Por que foi selecionado:</strong> {currentClip.report.whySelected}
                    </p>
                    <p className="text-gray-350">
                      <strong className="text-cyan-400">Emoção Dominante:</strong> {currentClip.report.emotionDetected}
                    </p>
                    <p className="text-gray-350">
                      <strong className="text-rose-400">Taxa de Audiência e Retenção:</strong> {currentClip.report.retentionPotential}
                    </p>
                    <p className="text-gray-350">
                      <strong className="text-amber-400">Gatilho de Compartilhamento:</strong> {currentClip.report.sharingPotential}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
