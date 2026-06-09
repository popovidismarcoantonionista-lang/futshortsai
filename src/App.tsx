import React, { useState, useEffect } from "react";
import { 
  Tv, 
  Sparkles, 
  Calendar, 
  Trash2, 
  ArrowRight,
  Play,
  Share2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Award,
  BookOpen,
  DownloadCloud
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import MetricsPanel from "./components/MetricsPanel";
import InboundForm from "./components/InboundForm";
import ClipViewer from "./components/ClipViewer";
import { MatchAnalysis, SaaSMetrics, UserSubscription } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"novo_projeto" | "historico" | "downloads" | "configuracoes" | "ajuda">("novo_projeto");
  const [analyses, setAnalyses] = useState<MatchAnalysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>("");
  const [metrics, setMetrics] = useState<SaaSMetrics>({
    totalUsers: 1482,
    activeSubscriptions: 423,
    totalRevenue: 24391.50,
    processedSeconds: 834190,
    clipsGenerated: 12431
  });
  
  const [activeSub, setActiveSub] = useState<UserSubscription>({
    id: "sub_1",
    email: "tony6044101aa@gmail.com",
    plan: "Champions",
    status: "active",
    price: "R$ 149,90",
    renewalDate: "2026-07-08"
  });

  const [adminStats, setAdminStats] = useState({
    metrics: metrics,
    subscriptions: [] as UserSubscription[],
    payments: [] as any[],
    logs: [] as any[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [isDownloadingBatch, setIsDownloadingBatch] = useState(false);
  const [isDownloadingKit, setIsDownloadingKit] = useState(false);

  // SaaS interactive settings parameters
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [captionsStyle, setCaptionsStyle] = useState<string>("yellow-outline");
  const [watermarkText, setWatermarkText] = useState<string>("@futshorts.ai");
  const [enableSmartZoom, setEnableSmartZoom] = useState<boolean>(true);
  const [soccerEngineSensitivity, setSoccerEngineSensitivity] = useState<number>(85);
  const [apiKey, setApiKey] = useState<string>("••••••••••••••••••••••••");

  // Sync state & metrics with the express server
  const loadInitialData = async () => {
    try {
      const analysesResponse = await fetch("/api/analyses");
      if (analysesResponse.ok) {
        const analysesData = await analysesResponse.json();
        setAnalyses(analysesData);
        if (analysesData.length > 0) {
          setSelectedAnalysisId(analysesData[0].id);
        }
      }

      const metricsResponse = await fetch("/api/metrics");
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      const adminResponse = await fetch("/api/admin/stats");
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        setAdminStats(adminData);
        // Bind the current user email to match standard sub plan
        const userEmail = "tony6044101aa@gmail.com";
        const found = adminData.subscriptions.find((s: any) => s.email === userEmail);
        if (found) {
          setActiveSub(found);
        }
      }
    } catch (e) {
      console.error("Unable to connect to live Express backend, running inside client fallback.", e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Trigger clip analysis request
  const handleAnalyze = async (payload: {
    videoName: string;
    videoSourceType: "upload" | "url";
    videoUrl?: string;
    selectedTopCount: number;
    userMatchContext: string;
  }) => {
    setIsLoading(true);
    setIsProcessingStep(1);
    setProcessingStatus("Transcrevendo vídeo");

    // Build cinematic progressive loader timeline
    const steps = [
      "Analisando conteúdo",
      "Detectando melhores momentos",
      "Calculando Viral Score",
      "Gerando cortes",
      "Finalizando"
    ];

    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep < 6) {
        currentStep++;
        setIsProcessingStep(currentStep);
        setProcessingStatus(steps[currentStep - 2]);
      }
    }, 2000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      clearInterval(interval);
      if (res.ok) {
        const newAnalysis: MatchAnalysis = await res.json();
        setAnalyses(prev => [newAnalysis, ...prev]);
        setSelectedAnalysisId(newAnalysis.id);
        await loadInitialData();
        setActiveTab("dashboard");
      } else {
        alert("Erro no motor de clipping, confira os logs do servidor.");
      }
    } catch (e) {
      clearInterval(interval);
      console.error(e);
      alert("Erro ao contatar o servidor de cortes. Tente novamente.");
    } finally {
      setIsLoading(false);
      setIsProcessingStep(0);
      setProcessingStatus("");
    }
  };

  // Triggers batch ZIP downloads
  const handleDownloadBatch = async (clipIds: string[], matchId: string) => {
    setIsDownloadingBatch(true);
    try {
      const response = await fetch("/api/download/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clipIds, matchId })
      });
      if (!response.ok) throw new Error("Erro ao compilar ZIP de cortes");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `futshorts_cortes_${matchId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert("Falha no download em lote: " + error.message);
    } finally {
      setIsDownloadingBatch(false);
    }
  };

  // Triggers full kit compile download
  const handleDownloadKit = async (matchId: string) => {
    setIsDownloadingKit(true);
    try {
      const response = await fetch("/api/download/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId })
      });
      if (!response.ok) throw new Error("Erro ao compilar Kit Completo");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FUTSHORTS_COMPLETE_KIT_${matchId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert("Falha no download do kit completo: " + error.message);
    } finally {
      setIsDownloadingKit(false);
    }
  };

  // Single MP4 mock download
  const handleIndividualDownload = (clipId: string) => {
    window.open(`/api/download/clip/${clipId}`, "_blank");
  };

  // Deletes analysis record
  const handleDeleteAnalysis = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Deseja realmente apagar esta análise do histórico de futebol?")) return;
    try {
      const response = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (response.ok) {
        const filtered = analyses.filter(a => a.id !== id);
        setAnalyses(filtered);
        if (selectedAnalysisId === id) {
          setSelectedAnalysisId(filtered[0]?.id || "");
        }
        await loadInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedAnalysis = analyses.find(a => a.id === selectedAnalysisId) || analyses[0];

  return (
    <div className="flex h-screen bg-[#070b0d] text-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        subscription={activeSub} 
        onRefreshStats={loadInitialData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Banner */}
        <header className="bg-brand-dark/85 backdrop-blur-md border-b border-gray-800 py-4 px-8 sticky top-0 z-40 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
              ⚽️ Cortador de Vídeos de Futebol com IA
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Transforme partidas inteiras em Shorts, TikToks e Reels de alto impacto viral em segundos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">Status Server:</span>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PORT 3000 ONLINE
            </span>
          </div>
        </header>

        {/* Dashboard Frame Container */}
        <main className="p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          
          {/* SaaS Metrics row */}
          <MetricsPanel metrics={metrics} />

          {/* 1. PROGRESSIVE LOADING ANIMATION OVERLAY */}
          {isLoading && (
            <div className="bg-gray-900 border border-brand-neon/30 p-6 rounded-2xl space-y-4 shadow-lg shadow-brand-neon/5 animate-fade-in" id="cinematic-loader">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-neon uppercase font-bold tracking-wider">Etapa {isProcessingStep} de 6</span>
                <span className="text-xs text-gray-400 font-mono">Gerando recortes táticos</span>
              </div>
              
              <div className="w-full bg-gray-950 h-3.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-brand-green to-brand-neon transition-all duration-500 rounded-full"
                  style={{ width: `${(isProcessingStep / 6) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-brand-neon border-t-transparent rounded-full animate-spin shrink-0" />
                <p className="text-xs text-white font-mono uppercase tracking-wider">{processingStatus}...</p>
              </div>
            </div>
          )}

          {/* NAVIGATION CONTEXT SWITCH */}
          {activeTab === "novo_projeto" && (
            <div className="space-y-8 animate-fade-in" id="novo-projeto-tab-view">
              {/* Inbound Form Block */}
              <InboundForm onAnalyze={handleAnalyze} isLoading={isLoading} />

              {/* Show active analysis if processing completed, so they can directly see it on this screen! */}
              {selectedAnalysis ? (
                <div className="pt-4 border-t border-gray-800">
                  <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/25 mb-4 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      CORES E CORTES LOCALIZADOS COM SUCESSO: <strong>{selectedAnalysis.matchInfo.teams}</strong>
                    </span>
                    <span className="text-[10px] text-gray-400">Plano Champions Ativado</span>
                  </div>
                  <ClipViewer
                    analysis={selectedAnalysis}
                    onIndividualDownload={handleIndividualDownload}
                    onDownloadBatch={handleDownloadBatch}
                    onDownloadKit={handleDownloadKit}
                    isDownloadingBatch={isDownloadingBatch}
                    isDownloadingKit={isDownloadingKit}
                  />
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-gray-800 bg-gray-950/40">
                  <Tv className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-xs text-gray-400 font-mono">
                    O editor inteligente de futebol está aguardando você enviar um material acima para exibir os shorts virais estruturados.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "historico" && (
            <div className="space-y-6 animate-fade-in" id="historico-tab-view">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-white">
                    Histórico de Jogos Processados ({analyses.length})
                  </h3>
                  <p className="text-xs text-gray-500 font-sans mt-1">
                    Selecione uma análise tática anterior para carregar os cortes de IA correspondentes.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-gray-950 text-gray-400 border border-gray-800 px-3 py-1 rounded">
                  {analyses.length} Partidas
                </span>
              </div>

              {analyses.length === 0 ? (
                <div className="bg-gray-950/40 p-16 text-center rounded-2xl border border-dashed border-gray-800">
                  <p className="text-sm text-gray-400 font-mono">Nenhum jogo enviado ao histórico ainda. Vá em "Novo Projeto"!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="match-history-grid">
                  {analyses.map((item) => {
                    const isSelected = item.id === selectedAnalysisId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedAnalysisId(item.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? "bg-gray-900 border-brand-neon shadow-lg shadow-brand-neon/5" 
                            : "bg-gray-950/50 border-gray-850 hover:bg-gray-900/60"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[9px] font-mono font-bold text-brand-neon bg-brand-neon/10 border border-brand-neon/20 px-2 py-0.5 rounded uppercase">
                            {item.videoSourceType === "url" ? "🌐 URL Link" : "📁 Arquivo Bruto"}
                          </span>
                          <button
                            onClick={(e) => handleDeleteAnalysis(item.id, e)}
                            className="p-1 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Apagar jogo do histórico"
                            id={`delete-match-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="text-sm font-semibold text-white mt-3 line-clamp-1">
                          {item.matchInfo.teams || item.videoName}
                        </h4>

                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.matchInfo.summary}
                        </p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mt-4 pt-3 border-t border-gray-800/40 font-semibold">
                          <span className="text-brand-neon">{item.clips.length} cortes gerados</span>
                          <span>{new Date(item.uploadedAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedAnalysis && (
                <div className="pt-6 border-t border-gray-800">
                  <h4 className="text-xs font-mono text-white bg-gray-950 px-4 py-2.5 border border-gray-800 rounded inline-block mb-4 font-bold tracking-wider">
                    ⚽ EXIBINDO DECK DE CORTES: {selectedAnalysis.matchInfo.teams}
                  </h4>
                  <ClipViewer
                    analysis={selectedAnalysis}
                    onIndividualDownload={handleIndividualDownload}
                    onDownloadBatch={handleDownloadBatch}
                    onDownloadKit={handleDownloadKit}
                    isDownloadingBatch={isDownloadingBatch}
                    isDownloadingKit={isDownloadingKit}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "downloads" && (
            <div className="space-y-6 animate-fade-in" id="downloads-tab-view">
              <div className="border-b border-gray-800 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-widest text-white">
                  Central de Downloads & ZIPs
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Gerencie as exportações compiladas em lote dos lances esportivos, títulos, descrições e hashtags.
                </p>
              </div>

              {selectedAnalysis ? (
                <div className="space-y-6">
                  {/* Active Match Banner */}
                  <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-brand-neon uppercase tracking-wider font-bold">Mídia Pronta para Exportação</span>
                      <h4 className="text-base font-bold text-white">{selectedAnalysis.matchInfo.teams}</h4>
                      <p className="text-xs text-gray-400 font-mono">{selectedAnalysis.clips.length} cortes • Qualidade Ultra HD</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => handleDownloadBatch(selectedAnalysis.clips.map(c => c.id), selectedAnalysis.id)}
                        disabled={isDownloadingBatch}
                        className="px-5 py-2.5 bg-brand-neon hover:opacity-90 disabled:opacity-50 text-black text-xs font-bold rounded-lg flex items-center gap-2 transition-all font-mono"
                      >
                        {isDownloadingBatch ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>COMPACTANDO...</span>
                          </>
                        ) : (
                          <>
                            <DownloadCloud className="w-4 h-4 text-black" />
                            <span>BAIXAR TODOS (ZIP)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadKit(selectedAnalysis.id)}
                        disabled={isDownloadingKit}
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all border border-gray-700 font-mono"
                      >
                        {isDownloadingKit ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>PREPARANDO KIT...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-brand-neon animate-pulse" />
                            <span>BAIXAR KIT COMPLETO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bulk Download explanation box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-905/60 p-5 rounded-xl border border-gray-800 space-y-2">
                      <h5 className="text-[11px] font-mono uppercase text-brand-neon font-bold">📂 O que vem no BAIXAR TODOS (ZIP)?</h5>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Contém todos os clipes de vídeo do jogo no formato MP4 (com proporção de clipes otimizadas para canais verticais). Prontos para publicação imediata no Shorts, reels e Tiktok.
                      </p>
                      <ul className="text-[11px] text-gray-500 space-y-1 list-disc list-inside font-mono">
                        <li>Framerates preservados (60 FPS)</li>
                        <li>Legendas embutidas no render vertical</li>
                        <li>Tags de corte de 01 a {selectedAnalysis.clips.length}</li>
                      </ul>
                    </div>

                    <div className="bg-gray-905/60 p-5 rounded-xl border border-gray-800 space-y-2">
                      <h5 className="text-[11px] font-mono uppercase text-teal-400 font-bold">📦 O que vem no KIT COMPLETO?</h5>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        O pacote definitivo de crescimento orgânico. Compacta os vídeos táticos do futebol adicionando metadados de altíssima conversão de funil.
                      </p>
                      <ul className="text-[11px] text-gray-500 space-y-1 list-disc list-inside font-mono">
                        <li>Todos os vídeos MP4 prontos</li>
                        <li>10 títulos com alta taxa de abertura (.TXT)</li>
                        <li>Descrições de vídeo detalhadas para Shorts e Reels</li>
                        <li>Planilha de hashtags recomendadas</li>
                        <li>Relatório analítico de retenção da IA</li>
                      </ul>
                    </div>
                  </div>

                  {/* Deliveries Queue table */}
                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                    <h5 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Fila de Entregas Digitais</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-gray-800 text-gray-500 uppercase text-[10px]">
                            <th className="pb-2">ID DO PACOTE</th>
                            <th className="pb-2">TIPO</th>
                            <th className="pb-2">TAMANHO HISTÓRICO</th>
                            <th className="pb-2">STATUS</th>
                            <th className="pb-2 text-right">AÇÃO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-850 text-gray-300">
                          <tr>
                            <td className="py-3">pkg_zip_all_{selectedAnalysis.id.slice(0, 5)}</td>
                            <td>Compilado de Vídeos (MP4)</td>
                            <td>~42.4 MB</td>
                            <td><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] uppercase font-bold">Disponível</span></td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => handleDownloadBatch(selectedAnalysis.clips.map(c => c.id), selectedAnalysis.id)}
                                className="text-xs text-brand-neon hover:underline font-bold"
                              >
                                Baixar
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3">pkg_kit_growth_{selectedAnalysis.id.slice(0, 5)}</td>
                            <td>Kit de Marketing Completo</td>
                            <td>~45.1 MB</td>
                            <td><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] uppercase font-bold">Disponível</span></td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => handleDownloadKit(selectedAnalysis.id)}
                                className="text-xs text-brand-neon hover:underline font-bold"
                              >
                                Baixar
                              </button>
                            </td>
                          </tr>
                          {selectedAnalysis.clips.map((clip, index) => (
                            <tr key={clip.id}>
                              <td className="py-3 text-gray-400">clip_corte_{index + 1}_{clip.id.slice(0, 5)}</td>
                              <td>Corte de Vídeo Individual - {clip.category.toUpperCase()}</td>
                              <td>~4.5 MB</td>
                              <td><span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-[10px] uppercase font-bold">Processado</span></td>
                              <td className="py-3 text-right">
                                <button 
                                  onClick={() => handleIndividualDownload(clip.id)}
                                  className="text-xs text-cyan-400 hover:underline font-bold"
                                >
                                  Baixar MP4
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/40 p-12 text-center rounded-2xl border border-gray-850">
                  <p className="text-sm text-gray-400 font-mono">Sem mídias cadastradas na sessão ativa. Recorte um jogo para habilitar downloads em lote.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "configuracoes" && (
            <div className="space-y-6 animate-fade-in" id="configuracoes-tab-view">
              <div className="border-b border-gray-800 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-widest text-white">
                  Ajustes da Conta & Parâmetros de Render
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Configure o formato de saída padrão dos seus cortes de futebol e integre suas próprias credenciais se necessário.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual rendering parameters */}
                <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-brand-neon font-bold">Opções de Vídeo e Aspecto</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400">Proporção do Feed (Aspect Ratio)</label>
                    <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1.5 rounded border border-gray-800">
                      {(["9:16", "16:9", "1:1"] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`py-1.5 text-xs font-mono font-bold rounded transition-all ${
                            aspectRatio === ratio 
                              ? "bg-brand-neon text-black font-semibold" 
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {ratio} {ratio === "9:16" ? "(Vertical)" : ratio === "16:9" ? "(Largo)" : "(Quadrado)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400">Estilo de Legendas Dinâmicas</label>
                    <select
                      value={captionsStyle}
                      onChange={(e) => setCaptionsStyle(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 text-xs font-mono py-2.5 px-3 rounded text-gray-350 focus:outline-none"
                    >
                      <option value="yellow-outline">CapCut Bubble (Amarela Borda Preta)</option>
                      <option value="tiktok-bold">TikTok Style (Negativa Rápida)</option>
                      <option value="green-glow">Glow Neon Green (Fut Shorts AI Exclusiva)</option>
                      <option value="minimal-white">Minimal White (Sem Fundo, Limpo)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400">Marca D’água nas Exportações</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 text-xs font-mono py-2.5 px-3 rounded text-white focus:outline-none"
                      placeholder="Marca d'água"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800/40 pt-3">
                    <span className="text-xs font-mono text-gray-400">Enquadramento Inteligente (Smart Zoom no Atleta)</span>
                    <input
                      type="checkbox"
                      checked={enableSmartZoom}
                      onChange={(e) => setEnableSmartZoom(e.target.checked)}
                      className="w-4 h-4 accent-brand-neon rounded bg-gray-950"
                    />
                  </div>
                </div>

                {/* AI & API keys integrations */}
                <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-teal-400 font-bold font-mono">Motores de IA Customizados (Opcional)</h4>
                  <p className="text-xs text-gray-400">
                    Por padrão, as análises utilizam o cluster cloud integrado do Fut Shorts AI de altíssima velocidade. Se precisar de limites infinitos, integre suas credenciais próprias.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400">Gemini/OpenAI API Key Privada</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 text-xs font-mono py-2.5 px-3 rounded text-white focus:outline-none focus:border-brand-neon/50 text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-gray-400">
                      <span>Sensibilidade da IA de Futebol</span>
                      <span className="text-brand-neon font-bold">{soccerEngineSensitivity}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={soccerEngineSensitivity}
                      onChange={(e) => setSoccerEngineSensitivity(parseInt(e.target.value))}
                      className="w-full accent-brand-neon h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-gray-500 block">Valores maiores rastreiam pequenos lances de reações do banco ou torcidas.</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => alert("As configurações globais do SaaS foram salvas com sucesso!")}
                      className="px-5 py-2.5 bg-brand-neon text-black text-xs font-bold rounded-lg hover:opacity-90 transition-all font-mono"
                    >
                      Salvar Ajustes do SaaS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ajuda" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 animate-fade-in" id="how-it-works-view">
              <div>
                <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
                  <HelpCircle className="w-5.5 h-5.5 text-brand-neon" />
                  Como o Motor Tático do Fut Shorts AI Funciona?
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Abordagem inovadora desenhada especificamente para reter torcedores e viralizar lances de futebol.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center font-bold text-xs text-brand-neon font-mono">1</div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">Análise de Narração & Áudio</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Extraímos picos de decibéis da transmissão do jogo de futebol. Quando o narrador grita "GOL!" ou a torcida ruge de indignação, o Whisper AI marca esses timestamps de forma instantânea.
                  </p>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center font-bold text-xs text-cyan-400 font-mono">2</div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">Slicing com IA em Lote</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    O clipper de vídeo separa as mídias em formatos exatos de 30s, 45s, 60s ou 90s, calculando o suspense ideal e o clímax da jogada de futebol (o gol ou o drible) para prender a atenção.
                  </p>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-rose-400/10 border border-rose-400/20 flex items-center justify-center font-bold text-xs text-rose-400 font-mono">3</div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">Redes Virais Copywriting</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    O Gemini processa a jogada e cria títulos com altíssima taxa de cliques (clickbait do futebol futebolístico), hashtags que auxiliam na categorização, e descrições otimizadas para o algoritmo do TikTok, Shorts e Reels.
                  </p>
                </div>
              </div>

              <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-neon font-bold">🎯 DETECTORES ESPORTIVOS MAPEADOS DA IA</span>
                <p className="text-xs text-gray-405 font-sans">
                  Nossa rede neural de classificação de canais de cortes foi modelada em dezenas de milhares de horas de transmissões de futebol profissional (Globo, Première, CazéTV e TNT Sports), compreendendo os seguintes eventos automaticamente:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10.5px] font-mono text-gray-400">
                  <span>🟢 Gols e Comemorações</span>
                  <span>🟢 Assistências Plásticas</span>
                  <span>🟢 Entrevistas Emocionantes</span>
                  <span>🟢 Rumores & Contratações</span>
                  <span>🟢 Bastidores e Vestiário</span>
                  <span>🟢 Provocações Saudáveis</span>
                  <span>🟠 Quase Gols de Placa</span>
                  <span>🟠 Lesões e Atendimento</span>
                  <span>🟠 Polêmicas Arbitragem</span>
                  <span>🟠 Coletivas de Imprensa</span>
                  <span>🟠 Declarações Fortes</span>
                  <span>🟠 Reações de Técnicos</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-950 p-5 rounded-xl border border-gray-800 text-xs text-gray-400 leading-relaxed space-y-2">
                <h5 className="font-bold text-white uppercase font-mono text-[10px] text-brand-neon">Diferencial competitivo do Fut Shorts AI:</h5>
                <p className="font-sans">
                  Diferente de editores tradicionais genéricos (CapCut, Premiere), o <strong className="text-white">Fut Shorts AI</strong> é sintonizado especificamente com o glossário de futebol (Brasileirão, Champions League, VAR, cartões, pênalti, cobertura, etc.). Ele compreende a dramaticidade que um amante de futebol busca e seleciona os melhores momentos na velocidade da luz.
                </p>
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setActiveTab("novo_projeto")}
                  className="px-5 py-2.5 bg-brand-neon text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all outline-none font-sans"
                >
                  Ir para a Mesa de Edição <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
