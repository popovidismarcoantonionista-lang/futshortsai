import React, { useState } from "react";
import { 
  Upload, 
  Link2, 
  HelpCircle, 
  FileVideo, 
  Play, 
  Sparkles, 
  ArrowRight,
  Info 
} from "lucide-react";

interface InboundFormProps {
  onAnalyze: (payload: {
    videoName: string;
    videoSourceType: "upload" | "url";
    videoUrl?: string;
    selectedTopCount: number;
    userMatchContext: string;
  }) => void;
  isLoading: boolean;
}

export default function InboundForm({ onAnalyze, isLoading }: InboundFormProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [selectedTopCount, setSelectedTopCount] = useState<number>(5);
  const [userMatchContext, setUserMatchContext] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Football presets to fast-track testing for the client/reviewer
  const PRESETS = [
    {
      title: "Real Madrid 2x3 Barcelona (El Clásico)",
      desc: "VAR controverso, gol de Messi nos acréscimos e expulsão de Sérgio Ramos.",
      url: "https://www.youtube.com/watch?v=clásico-magico"
    },
    {
      title: "Brasil 2x0 Alemanha (Final da Copa)",
      desc: "Dois gols históricos do Ronaldo Fenômeno no segundo tempo, grande drama tático.",
      url: "https://www.youtube.com/watch?v=brasil-pentacampeao"
    },
    {
      title: "Corinthians 1x0 Palmeiras (Derby Paulista)",
      desc: "Confusão entre bancos, expulsão do volante e comemoração icônica da vitória do timão.",
      url: "https://www.youtube.com/watch?v=derby-tenso-paulista"
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFile({ name: file.name, size: `${sizeInMB} MB` });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFile({ name: file.name, size: `${sizeInMB} MB` });
    }
  };

  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setActiveTab("url");
    setVideoUrl(p.url);
    setUserMatchContext(p.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "upload" && !uploadedFile) {
      alert("Por favor, selecione ou arreste um arquivo de vídeo para processamento.");
      return;
    }
    if (activeTab === "url" && !videoUrl) {
      alert("Por favor, digite o link/URL do vídeo do jogo de futebol.");
      return;
    }

    onAnalyze({
      videoName: activeTab === "upload" ? (uploadedFile?.name || "Vídeo Inserido") : videoUrl,
      videoSourceType: activeTab,
      videoUrl: activeTab === "url" ? videoUrl : undefined,
      selectedTopCount,
      userMatchContext
    });
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 space-y-6" id="inbound-container">
      {/* Platform Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 bg-brand-neon/10 text-brand-neon text-xs px-3 py-1 bg-gray-950 rounded-full border border-brand-neon/25 font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin-pulse text-brand-neon" />
          <span>SaaS DE VÍDEOS DE FUTEBOL COM INTELIGÊNCIA ARTIFICIAL</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight" id="main-form-title">
          Fut Shorts AI
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-lg mx-auto leading-relaxed">
          Envie um vídeo ou cole uma URL para gerar cortes virais automaticamente.
        </p>
      </div>

      {/* Football Specialized Badges Area */}
      <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/65">
        <span className="block text-[10px] uppercase font-mono tracking-wider text-brand-neon mb-2 text-center">
          ⚡ MOTOR DE INTELIGÊNCIA ESPECIALIZADO EM FUTEBOL
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
          {[
            "Gols", "Quase Gols", "Assistências", "Entrevistas", "Lesões", 
            "Polêmicas", "Contratações", "Rumores", "Reações", "Coletivas", 
            "Bastidores", "Provocações", "Declarações Fortes"
          ].map((item, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-[10.5px] font-medium text-gray-300 hover:border-brand-neon/40 hover:text-white transition-colors duration-200"
            >
              ⚽️ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800" id="form-tabs">
        <button
          onClick={() => { setActiveTab("upload"); setUploadedFile(null); }}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 font-mono transition-all duration-150 ${
            activeTab === "upload"
              ? "border-brand-neon text-brand-neon"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
          type="button"
          id="tab-btn-upload"
        >
          <span className="flex items-center gap-2">
            <FileVideo className="w-3.5 h-3.5" /> Enviar Arquivo (MP4, MKV...)
          </span>
        </button>
        <button
          onClick={() => { setActiveTab("url"); setVideoUrl(""); }}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 font-mono transition-all duration-150 ${
            activeTab === "url"
              ? "border-brand-neon text-brand-neon"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
          type="button"
          id="tab-btn-url"
        >
          <span className="flex items-center gap-2">
            <Link2 className="w-3.5 h-3.5" /> Colar Link de Vídeo
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Methods */}
        {activeTab === "upload" ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 ${
              dragActive ? "border-brand-neon bg-brand-neon/5" : "border-gray-800 hover:border-gray-700 bg-gray-950/40"
            }`}
            id="drag-and-drop-box"
          >
            <input
              type="file"
              id="file-upload-input"
              accept=".mp4,.mov,.mkv,.avi,.webm"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="text-center" id="upload-success-indicator">
                <div className="bg-brand-neon/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-neon border border-brand-neon/20">
                  <Play className="w-6 h-6 fill-brand-neon" />
                </div>
                <h4 className="text-sm font-semibold text-white">{uploadedFile.name}</h4>
                <p className="text-xs text-gray-400 mt-1 font-mono">{uploadedFile.size} • Pronto para Processar</p>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="text-[11px] underline text-red-400 mt-3 hover:text-red-300 font-mono transition-all"
                >
                  Substituir Arquivo
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-800">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-gray-300">
                  Clique para navegar ou arraste seu arquivo de vídeo aqui
                </h4>
                <p className="text-[10px] text-gray-500 mt-2">
                  Formatos de futebol aceitos: .MP4, .MOV, .MKV, .AVI ou .WEBM (Máx 2 GB)
                </p>
                <label
                  htmlFor="file-upload-input"
                  className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-xs font-medium cursor-pointer inline-block transition-all"
                >
                  Selecionar Vídeo
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4" id="url-method-box">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Cole a URL do vídeo</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... ou link público de mídia"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-brand-neon/50 text-gray-100"
                />
                <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Presets Selection */}
            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-2 uppercase">Quer testar rapidamente? Aplique um Clássico:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="bg-gray-950 hover:bg-gray-800/80 border border-gray-800/80 hover:border-brand-neon/30 text-left p-3 rounded-lg text-xs transition-all duration-150 flex flex-col justify-between"
                  >
                    <span className="font-semibold text-brand-neon block truncate">{p.title}</span>
                    <span className="text-[10px] text-gray-400 line-clamp-1 mt-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Configurations Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Top Selection (Top 5, Top 10, Top 20) */}
          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-gray-400 mb-2.5 uppercase">Meta de Cortes de IA</label>
            <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1.5 rounded-lg border border-gray-800">
              {[5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedTopCount(num)}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded transition-all duration-150 ${
                    selectedTopCount === num
                      ? "bg-brand-neon text-black font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  TOP {num}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-gray-500 mt-1.5 block font-mono">
              IA prioriza o ranking com maior viralização.
            </span>
          </div>

          {/* User Context Guidance */}
          <div className="md:col-span-7">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">
              Diretrizes de Jogo ou Eventos (Opcional)
            </label>
            <textarea
              placeholder="Descreva detalhes específicos (ex: 'Flamengo fez gol aos 32 do 1o tempo, teve discussão do técnico Abel e drible do Estevão')"
              value={userMatchContext}
              onChange={(e) => setUserMatchContext(e.target.value)}
              rows={2}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-brand-neon/50 text-gray-100"
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="border-t border-gray-800/80 pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3.5 bg-gradient-to-r from-brand-green to-brand-neon hover:opacity-95 text-black font-extrabold uppercase rounded-lg text-xs md:text-sm font-sans flex items-center gap-2.5 shadow-md shadow-brand-neon/10 hover:shadow-brand-neon/20 transition-all ${
              isLoading ? "cursor-wait opacity-50" : "cursor-pointer"
            }`}
            id="start-analyze-btn"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>PROCESSANDO AUDIO & IMAGEM DE FUTEBOL...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black animate-pulse" />
                <span>GERAR CORTES</span>
                <ArrowRight className="w-4.5 h-4.5 text-black stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
