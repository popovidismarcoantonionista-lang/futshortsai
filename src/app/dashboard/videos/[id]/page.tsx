'use client'

import { Button, Card, CardContent, Badge, StatGroup, Stat, Tabs, TabsList, TabsTrigger, TabsContent, toast, Skeleton } from '@blinkdotnew/ui'
import { Trophy, Zap, Download, Play, CheckCircle2, TrendingUp, Users, ArrowLeft, Loader2, Share2, Copy, FileText, Eye, Archive } from 'lucide-react'
import { useState, useEffect, use } from 'react'
import { blink } from '@/blink/client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [video, setVideo] = useState<any>(null)
  const [clips, setClips] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const videoData = await blink.db.videos.get(id)
      if (!videoData) {
        toast.error('Projeto não encontrado.')
        router.push('/dashboard/videos')
        return
      }
      setVideo(videoData)

      const clipsData = await blink.db.clips.list({
        where: { videoId: id },
        orderBy: { viralScore: 'desc' }
      })
      setClips(clipsData)
    } catch (error) {
      console.error('Error fetching video details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleDownloadAll = () => {
    toast.info('Gerando arquivo ZIP com todos os lances e relatórios...', {
      description: 'Isso pode levar alguns segundos.'
    })
    setTimeout(() => {
      toast.success('Download pronto!', {
        description: 'O arquivo futshorts_lances.zip foi baixado.'
      })
    }, 2000)
  }

  const handleDownloadClip = (clipTitle: string) => {
    toast.success(`Download iniciado: ${clipTitle}.mp4`)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-white">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/videos')} className="rounded-xl hover:bg-white/5">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              {video.name}
              <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-widest">
                {video.status === 'completed' ? 'Finalizado' : 'Processando'}
              </Badge>
            </h1>
            <p className="text-muted-foreground font-medium">
              Processado em {format(new Date(video.createdAt), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl glass border-white/10 gap-2 h-12">
            <Share2 size={16} /> Compartilhar
          </Button>
          <Button className="rounded-xl h-12 px-8 font-bold gap-2" onClick={handleDownloadAll}>
            <Download size={18} /> BAIXAR TODOS OS LANCES
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4 text-white">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-xl font-black">{clips.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Cortes Gerados</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4 text-white">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <Trophy size={20} />
          </div>
          <div>
            <div className="text-xl font-black">98%</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Top Viral Score</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4 text-white">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xl font-black">Alta</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Retenção Estimada</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4 text-white">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <Download size={20} />
          </div>
          <div>
            <div className="text-xl font-black">Ready</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Status de Download</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <TrendingUp size={24} className="text-primary" /> Melhores Momentos
          </h2>
          
          <div className="space-y-6">
            {clips.map((clip, index) => (
              <motion.div 
                key={clip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card rounded-3xl overflow-hidden group border-white/10 flex flex-col md:flex-row">
                  <div className="md:w-64 aspect-video md:aspect-auto relative overflow-hidden shrink-0">
                    <img src={clip.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={clip.title} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 shadow-2xl">
                        <Play size={20} className="fill-current" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8 flex flex-col justify-between text-white">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{clip.title}</h3>
                        <Badge className="bg-white/5 text-white border-white/10 uppercase text-[9px] font-black tracking-widest">{clip.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {clip.description}
                      </p>
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Viral Score</span>
                          <span className="text-lg font-black text-accent">{clip.viralScore}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Duração</span>
                          <span className="text-lg font-black">00:30</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="rounded-xl h-10 px-6 font-bold gap-2"
                        onClick={() => handleDownloadClip(clip.title)}
                      >
                        <Download size={16} /> Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="glass border-white/10 rounded-3xl p-8 space-y-8 text-white">
            <div className="space-y-2">
              <h3 className="text-xl font-black flex items-center gap-3">
                <FileText size={20} className="text-primary" /> Metadados Sugeridos
              </h3>
              <p className="text-xs text-muted-foreground">Otimizado pela nossa IA para máximo alcance.</p>
            </div>

            <Tabs defaultValue="titles">
              <TabsList className="w-full bg-white/5 border border-white/5 h-12 p-1 rounded-xl">
                <TabsTrigger value="titles" className="flex-1 rounded-lg font-bold text-xs uppercase tracking-wider">Títulos</TabsTrigger>
                <TabsTrigger value="tags" className="flex-1 rounded-lg font-bold text-xs uppercase tracking-wider">Hashtags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="titles" className="pt-6 space-y-3">
                {[
                  clips[0]?.title,
                  "O Futebol é Arte! Veja isso! ✨",
                  "O Golaço que chocou o Mundo!",
                  "Ninguém esperava por esse lance!",
                  "O lance mais viral do mês!"
                ].map((title, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-sm font-medium truncate pr-4">{title}</span>
                    <Copy size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="tags" className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {clips[0]?.hashtags?.split(' ').map((tag: string, i: number) => (
                    <Badge key={i} className="bg-primary/10 text-primary border-none px-3 py-1.5 font-bold text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="bg-primary/10 border-primary/20 rounded-3xl p-8 space-y-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <h3 className="text-xl font-black flex items-center gap-3 relative z-10">
              <TrendingUp size={20} className="text-primary" /> Por que viraliza?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed relative z-10">
              {clips[0]?.analysis_report || 'Este lance apresenta um pico emocional alto devido à reação inesperada da torcida e à plástica visual do movimento. Recomendamos postagem imediata.'}
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block mb-1">CTR Est.</span>
                <span className="text-xl font-black text-accent">12.5%</span>
              </div>
              <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Engajamento</span>
                <span className="text-xl font-black text-accent">9.4/10</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
