import React from "react";
import { 
  Flame, 
  PlusCircle, 
  History, 
  DownloadCloud, 
  Settings2, 
  HelpCircle, 
  CreditCard,
  UserCheck
} from "lucide-react";
import { UserSubscription } from "../types";

interface SidebarProps {
  activeTab: "novo_projeto" | "historico" | "downloads" | "configuracoes" | "ajuda";
  setActiveTab: (tab: "novo_projeto" | "historico" | "downloads" | "configuracoes" | "ajuda") => void;
  subscription: UserSubscription | null;
  onRefreshStats: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, subscription, onRefreshStats }: SidebarProps) {
  const userPlan = subscription?.plan || "Free";
  const userEmail = subscription?.email || "tony6044101aa@gmail.com";

  return (
    <div className="w-80 bg-brand-dark border-r border-gray-805 flex flex-col h-full text-gray-100 font-sans shrink-0" id="app-sidebar">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-brand-green to-brand-neon p-2 rounded-xl text-black">
            <Flame className="w-6 h-6 fill-black animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1">
              FUT SHORTS <span className="text-brand-neon text-xs px-1.5 py-0.5 rounded bg-brand-neon/10 font-mono">AI</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">SOCCER VIDEO ENGINE</p>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <h3 className="text-xs font-mono tracking-widest text-gray-500 px-3 uppercase mb-2">Painel principal</h3>
        
        {/* Tab 1: Novo Projeto */}
        <button
          onClick={() => setActiveTab("novo_projeto")}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-all duration-150 font-medium ${
            activeTab === "novo_projeto"
              ? "bg-brand-neon text-black font-semibold glow-neon"
              : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
          }`}
          id="btn-nav-novo-projeto"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Novo Projeto</span>
        </button>

        {/* Tab 2: Histórico */}
        <button
          onClick={() => setActiveTab("historico")}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-all duration-150 font-medium ${
            activeTab === "historico"
              ? "bg-brand-neon text-black font-semibold glow-neon"
              : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
          }`}
          id="btn-nav-historico"
        >
          <History className="w-4 h-4 shrink-0" />
          <span>Histórico de Jogos</span>
        </button>

        {/* Tab 3: Downloads */}
        <button
          onClick={() => setActiveTab("downloads")}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-all duration-150 font-medium ${
            activeTab === "downloads"
              ? "bg-brand-neon text-black font-semibold glow-neon"
              : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
          }`}
          id="btn-nav-downloads"
        >
          <DownloadCloud className="w-4 h-4 shrink-0" />
          <span className="flex items-center justify-between w-full">
            <span>Downloads</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">ZIP</span>
          </span>
        </button>

        {/* Tab 4: Configurações */}
        <button
          onClick={() => setActiveTab("configuracoes")}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-all duration-150 font-medium ${
            activeTab === "configuracoes"
              ? "bg-brand-neon text-black font-semibold glow-neon"
              : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
          }`}
          id="btn-nav-configuracoes"
        >
          <Settings2 className="w-4 h-4 shrink-0" />
          <span>Configurações</span>
        </button>

        {/* Tab 5: Ajuda */}
        <button
          onClick={() => setActiveTab("ajuda")}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-all duration-150 font-medium ${
            activeTab === "ajuda"
              ? "bg-brand-neon text-black font-semibold glow-neon"
              : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
          }`}
          id="btn-nav-ajuda"
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Ajuda & Suporte</span>
        </button>
      </div>

      {/* Subscription Card */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/40">
        <div className="bg-gray-850/60 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-400 uppercase">Seu Plano SaaS</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-neon/20 text-brand-neon border border-brand-neon/30`}>
              {userPlan.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-4 h-4 text-brand-neon shrink-0" />
            <div className="truncate">
              <span className="text-xs font-medium text-white block truncate">{userEmail}</span>
              <span className="text-[10px] text-gray-400 block font-mono">Renova: {subscription?.renewalDate || "2026-07-08"}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-800/40 pt-2.5">
            <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Pix ou Cartão</span>
            <span>Ativo</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-[10px] text-gray-600 font-mono border-t border-gray-800">
        FUT SHORTS AI v1.5.0 • 2026
      </div>
    </div>
  );
}
