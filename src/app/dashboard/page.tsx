'use client'

import { Page, PageHeader, PageTitle, PageDescription, PageBody, StatGroup, Stat, Button, Card, CardContent, EmptyState } from '@blinkdotnew/ui'
import { Video, Zap, Download, Trophy, Upload, Plus, History, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalClips: 0,
    avgScore: 0,
    creditsUsed: 0
  })

  useEffect(() => {
    // Fetch real stats from DB
    const fetchStats = async () => {
      try {
        const videos = await blink.db.videos.list()
        const clips = await blink.db.clips.list()
        
        const avgScore = clips.length > 0 
          ? Math.round(clips.reduce((acc: number, clip: any) => acc + (clip.viralScore || 0), 0) / clips.length) 
          : 0

        setStats({
          totalVideos: videos.length,
          totalClips: clips.length,
          avgScore,
          creditsUsed: videos.length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <PageTitle>Olá, Campeão! ⚽</PageTitle>
            <PageDescription>Bem-vindo ao centro de comando do FutShorts AI.</PageDescription>
          </div>
          <Button onClick={() => router.push('/dashboard/videos/new')} className="gap-2">
            <Plus size={18} /> Novo Vídeo
          </Button>
        </div>
      </PageHeader>

      <PageBody className="space-y-8">
        <StatGroup>
          <Stat 
            label="Vídeos Enviados" 
            value={stats.totalVideos.toString()} 
            icon={<Video size={20} />} 
          />
          <Stat 
            label="Clipes Gerados" 
            value={stats.totalClips.toString()} 
            icon={<Zap size={20} className="text-primary" />} 
          />
          <Stat 
            label="Viral Score Médio" 
            value={`${stats.avgScore}%`} 
            icon={<Trophy size={20} className="text-accent" />} 
          />
          <Stat 
            label="Créditos Usados" 
            value={stats.creditsUsed.toString()} 
            icon={<Download size={20} />} 
          />
        </StatGroup>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-secondary/30 border-white/5">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Upload className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Pronto para o próximo Viral?</h3>
              <p className="text-muted-foreground mb-8 max-w-sm">
                Envie um vídeo longo de futebol (partida, entrevista, análise) e deixe nossa IA fazer o trabalho pesado.
              </p>
              <Button size="lg" onClick={() => router.push('/dashboard/videos/new')} className="px-8 font-bold gap-2">
                Começar Clipping <ArrowRight size={18} />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-white/5">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <History size={18} /> Recentes
              </h3>
              {stats.totalVideos === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">Nenhum vídeo recente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* We would map over recent videos here */}
                  <p className="text-sm text-muted-foreground">Confira a aba "Meus Vídeos" para ver o histórico completo.</p>
                  <Button variant="ghost" className="w-full text-primary" onClick={() => router.push('/dashboard/videos')}>
                    Ver Todos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <section>
          <h3 className="text-xl font-bold mb-6">Como obter os melhores resultados?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Vídeos em Alta Definição", 
                desc: "Quanto maior a qualidade do vídeo original, melhor o reconhecimento de lances pela IA.",
                icon: "📸"
              },
              { 
                title: "Áudio Original", 
                desc: "A narração e o som da torcida ajudam a IA a identificar momentos de pico emocional.",
                icon: "🔊"
              },
              { 
                title: "Partidas Completas", 
                desc: "Nossa IA performa melhor analisando o contexto total da partida para identificar heróis e vilões.",
                icon: "🏆"
              }
            ].map((tip, i) => (
              <div key={i} className="p-6 bg-secondary/20 rounded-xl border border-white/5">
                <div className="text-3xl mb-4">{tip.icon}</div>
                <h4 className="font-bold mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </PageBody>
    </Page>
  )
}
