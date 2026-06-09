import React from "react";
import { 
  Users, 
  CreditCard, 
  Clock, 
  Sparkles, 
  Zap, 
  Gauge 
} from "lucide-react";
import { SaaSMetrics } from "../types";

interface MetricsPanelProps {
  metrics: SaaSMetrics;
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  // Format revenue in BRL
  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(metrics.totalRevenue);

  // Format hours processed from total seconds
  const hoursProcessed = (metrics.processedSeconds / 3600).toFixed(1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="metrics-panel-row">
      {/* Metric Card 1 */}
      <div className="bg-gray-900 border border-gray-800 p-4.5 rounded-xl flex items-center gap-3.5 shadow-sm">
        <div className="bg-brand-neon/10 text-brand-neon p-2.5 rounded-lg border border-brand-neon/20 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Criadores</span>
          <h4 className="text-lg font-display font-semibold text-white tracking-tight mt-0.5" id="metric-users">
            {metrics.totalUsers}
          </h4>
        </div>
      </div>

      {/* Metric Card 2 */}
      <div className="bg-gray-900 border border-gray-800 p-4.5 rounded-xl flex items-center gap-3.5 shadow-sm">
        <div className="bg-cyan-500/10 text-cyan-400 p-2.5 rounded-lg border border-cyan-500/20 shrink-0">
          <Zap className="w-5 h-5 fill-cyan-400/20" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">Assinaturas Ativas</span>
          <h4 className="text-lg font-display font-semibold text-white tracking-tight mt-0.5" id="metric-subs">
            {metrics.activeSubscriptions}
          </h4>
        </div>
      </div>

      {/* Metric Card 3 */}
      <div className="bg-gray-900 border border-gray-800 p-4.5 rounded-xl flex items-center gap-3.5 shadow-sm">
        <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-lg border border-rose-500/20 shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">Faturamento SaaS</span>
          <h4 className="text-lg font-display font-semibold text-white tracking-tight mt-0.5" id="metric-revenue">
            {formattedRevenue}
          </h4>
        </div>
      </div>

      {/* Metric Card 4 */}
      <div className="bg-gray-900 border border-gray-800 p-4.5 rounded-xl flex items-center gap-3.5 shadow-sm">
        <div className="bg-amber-400/10 text-amber-300 p-2.5 rounded-lg border border-amber-400/20 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">Horas Analisadas</span>
          <h4 className="text-lg font-display font-semibold text-white tracking-tight mt-0.5" id="metric-hours">
            {hoursProcessed}h
          </h4>
        </div>
      </div>

      {/* Metric Card 5 */}
      <div className="col-span-2 lg:col-span-1 bg-gray-900 border border-gray-850 p-4.5 rounded-xl flex items-center gap-3.5 shadow-sm">
        <div className="bg-brand-green/10 text-brand-green p-2.5 rounded-lg border border-brand-green/20 shrink-0">
          <Sparkles className="w-5 h-5 fill-brand-green/10" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">Cortes Criados</span>
          <h4 className="text-lg font-display font-semibold text-white tracking-tight mt-0.5" id="metric-clips">
            {metrics.clipsGenerated}
          </h4>
        </div>
      </div>
    </div>
  );
}
