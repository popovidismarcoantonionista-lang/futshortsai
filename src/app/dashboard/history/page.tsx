'use client'

import { Card, Button } from '@blinkdotnew/ui'
import { Download, FileVideo, FileArchive, ArrowRight, History, Zap, Archive, ExternalLink } from 'lucide-react'

export default function DownloadsPage() {
  const downloads = [
    { id: 1, name: 'Golaço_Flamengo_Final.zip', date: 'Hoje, 14:20', size: '124MB', type: 'Kit Completo' },
    { id: 2, name: 'Dribles_Messi_Miami.mp4', date: 'Ontem, 09:15', size: '45MB', type: 'Corte Único' },
    { id: 3, name: 'Entrevista_Abel_Ferreira.zip', date: '08 de Jun, 18:40', size: '210MB', type: 'Kit Completo' },
    { id: 4, name: 'Polêmica_VAR_Corinthians.mp4', date: '05 de Jun, 21:00', size: '38MB', type: 'Corte Único' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
            <Download size={16} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Downloads</h1>
        </div>
        <p className="text-muted-foreground">Acesse rapidamente seus arquivos gerados e kits de viralização.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <History size={20} className="text-muted-foreground" /> Arquivos Recentes
          </h2>
          <div className="space-y-4">
            {downloads.map((dl) => (
              <Card key={dl.id} className="glass-card rounded-2xl p-5 border-white/10 group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dl.type === 'Kit Completo' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      {dl.type === 'Kit Completo' ? <FileArchive size={24} /> : <FileVideo size={24} />}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-primary transition-colors">{dl.name}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="font-medium">{dl.date}</span>
                        <span className="opacity-20">•</span>
                        <span className="font-black uppercase tracking-widest">{dl.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-xl hover:bg-primary hover:text-white transition-all text-muted-foreground">
                    <Download size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="ghost" className="w-full text-muted-foreground hover:text-white rounded-xl border border-white/5 h-12">
            Ver histórico completo
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary/5 border-primary/20 rounded-3xl overflow-hidden p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6 text-white">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Archive size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black">O que vem no Kit Completo?</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  Nossa IA prepara um pacote pronto para postagem em todas as redes sociais.
                </p>
              </div>
              <div className="space-y-3 text-white/80">
                {[
                  'Vídeos em alta definição (MP4)',
                  'Títulos otimizados para CTR',
                  'Descrições e Legendas prontas',
                  'Hashtags estratégicas',
                  'Relatório de Viralização IA'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <Zap size={14} className="text-primary fill-current" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full h-14 rounded-2xl font-black text-lg gap-3">
                DASHBOARD DE IA <ArrowRight size={20} />
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-3xl p-8 border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Links Úteis</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="ghost" className="justify-between h-14 px-6 rounded-2xl hover:bg-white/5 border border-white/5 group text-white/80">
                <span className="font-bold">Guia de Viralização 2026</span>
                <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button variant="ghost" className="justify-between h-14 px-6 rounded-2xl hover:bg-white/5 border border-white/5 group text-white/80">
                <span className="font-bold">Best Practices: TikTok vs Reels</span>
                <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
