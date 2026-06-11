'use client'

import { Button, Card, CardContent, Input, toast } from '@blinkdotnew/ui'
import { Upload, Link as LinkIcon, ArrowRight, Loader2, Video, Zap, CheckCircle2, Trophy, Eye, Download, Archive, Share2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { blink } from '@/blink/client'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

type Step = {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed'
}

export default function NewVideoPage() {
  const { user, isAuthenticated } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [clips, setClips] = useState<any[]>([])

  const [steps, setSteps] = useState<Step[]>([
    { id: 'transcribe', label: 'Transcrevendo vídeo', status: 'pending' },
    { id: 'analyze', label: 'Analisando conteúdo', status: 'pending' },
    { id: 'detect', label: 'Detectando melhores momentos', status: 'pending' },
    { id: 'score', label: 'Calculando Viral Score', status: 'pending' },
    { id: 'generate', label: 'Gerando cortes', status: 'pending' },
    { id: 'finalize', label: 'Finalizando', status: 'pending' },
  ])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const startProcessing = async () => {
    if (!file && !videoUrl) {
      toast.error('Selecione um arquivo ou insira uma URL.')
      return
    }

    if (!isAuthenticated) {
      blink.auth.login()
      return
    }

    setIsProcessing(true)
    setProgress(0)
    
    try {
      let finalUrl = videoUrl
      let fileName = file?.name || 'Projeto Futebol'

      if (file) {
        const { publicUrl } = await blink.storage.upload(
          file,
          `videos/${user?.id}/${Date.now()}_${file.name}`
        )
        finalUrl = publicUrl
      }

      const video = await blink.db.videos.create({
        userId: user?.id || '',
        url: finalUrl,
        name: fileName,
        status: 'processing'
      })

      // Simulate steps
      for (let i = 0; i < steps.length; i++) {
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'processing' } : 
          idx < i ? { ...s, status: 'completed' } : s
        ))
        
        for (let p = 0; p <= 16; p++) {
          setProgress(prev => Math.min(prev + 1, (i + 1) * 16.6))
          await new Promise(r => setTimeout(r, 100))
        }
      }

      const sampleClips = [
        {
          id: `clip_1_${Date.now()}`,
          videoId: video.id,
          startTime: 191,
          endTime: 222,
          title: 'Gol de Placa! ⚽🔥',
          description: 'A curva que essa bola fez é inexplicável. O goleiro nem se mexeu.',
          hashtags: '#futebol #gol #incrivel #viral',
          viralScore: 98,
          retentionScore: 95,
          engagementScore: 92,
          ctrScore: 89,
          category: 'Gol',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=400',
          analysis_report: 'Pico emocional detectado. Reação da torcida 10/10.'
        },
        {
          id: `clip_2_${Date.now()}`,
          videoId: video.id,
          startTime: 258,
          endTime: 285,
          title: 'Defesa Impossível! 🧤🥅',
          description: 'O goleiro buscou no ângulo. Uma das melhores defesas da temporada.',
          hashtags: '#goleiro #defesa #milagre #futebol',
          viralScore: 92,
          retentionScore: 88,
          engagementScore: 85,
          ctrScore: 90,
          category: 'Defesa',
          thumbnailUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=400',
          analysis_report: 'Momento de alta tensão. Ideal para vídeos de "Melhores Goleiros".'
        },
        {
          id: `clip_3_${Date.now()}`,
          videoId: video.id,
          startTime: 450,
          endTime: 510,
          title: 'Drible Mágico! 🕺🎩',
          description: 'Ele deixou dois no chão antes de cruzar. Habilidade pura!',
          hashtags: '#drible #skill #magica #futebolbrasileiro',
          viralScore: 82,
          retentionScore: 85,
          engagementScore: 78,
          ctrScore: 80,
          category: 'Habilidade',
          thumbnailUrl: 'https://images.unsplash.com/photo-1679391029864-d46f366a456b?auto=format&fit=crop&q=80&w=400',
          analysis_report: 'Visual estético forte. Ideal para Reels e TikTok.'
        },
        {
          id: `clip_4_${Date.now()}`,
          videoId: video.id,
          startTime: 120,
          endTime: 180,
          title: 'Polêmica no VAR! 🚨🚨',
          description: 'O estádio parou. Ninguém entendeu essa marcação do juiz.',
          hashtags: '#polemica #var #arbitragem #debate',
          viralScore: 88,
          retentionScore: 90,
          engagementScore: 96,
          ctrScore: 92,
          category: 'Polêmica',
          thumbnailUrl: 'https://images.unsplash.com/photo-1434648957308-5e6a859697e8?auto=format&fit=crop&q=80&w=400',
          analysis_report: 'Alto potencial de compartilhamento e comentários.'
        },
        {
          id: `clip_5_${Date.now()}`,
          videoId: video.id,
          startTime: 310,
          endTime: 338,
          title: 'Comemoração Épica! 🕺🏽🥳',
          description: 'A alegria contagiante após o gol da vitória. Passos de dança que vão viralizar.',
          hashtags: '#comemoracao #futebol #alegria #dance',
          viralScore: 95,
          retentionScore: 92,
          engagementScore: 98,
          ctrScore: 85,
          category: 'Comemoração',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=400',
          analysis_report: 'Conteúdo "feel good" com alto índice de salvamentos.'
        },
        {
          id: `clip_6_${Date.now()}`,
          videoId: video.id,
          startTime: 540,
          endTime: 575,
          title: 'Assistência de Gênio! 🎯👟',
          description: 'Um passe que rasgou a defesa adversária. Visão de jogo fora do comum.',
          hashtags: '#assistencia #passe #genio #futebol',
          viralScore: 85,
          retentionScore: 82,
          engagementScore: 80,
          ctrScore: 88,
          category: 'Assistência',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=400',
          analysis_report: 'Momento de alta inteligência esportiva.'
        }
      ]

      await blink.db.clips.createMany(sampleClips)
      await blink.db.videos.update(video.id, { status: 'completed' })
      
      setClips(sampleClips)
      setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })))
      setProgress(100)
      toast.success('Sucesso! Clips gerados com inteligência artificial.')
    } catch (error) {
      console.error('Error processing:', error)
      toast.error('Erro ao processar vídeo.')
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setIsProcessing(false)
    setClips([])
    setProgress(0)
    setFile(null)
    setVideoUrl('')
    setSteps(steps.map(s => ({ ...s, status: 'pending' })))
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        {!isProcessing && clips.length === 0 ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-black tracking-tighter text-white">
                Fut Shorts AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium">
                Transforme vídeos de futebol em cortes virais com IA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div 
                className="glass-card rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center cursor-pointer border-white/5 hover:border-primary/50 relative overflow-hidden group shadow-2xl"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
                  <Upload className="text-primary w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Enviar Vídeo</h3>
                <p className="text-sm text-muted-foreground font-bold tracking-widest uppercase opacity-40">
                  {file ? file.name : 'MP4, MOV, MKV, AVI, WEBM'}
                </p>
                <input 
                  id="file-upload"
                  type="file" 
                  accept="video/*" 
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="glass-card rounded-[2.5rem] p-16 flex flex-col items-center justify-center space-y-12 border-white/5 shadow-2xl">
                <div className="w-full space-y-6">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                      <LinkIcon size={20} className="text-primary" />
                    </div>
                    <span className="text-2xl font-black text-white">Cole a URL</span>
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Link do YouTube ou Drive..." 
                      className="h-20 px-8 glass rounded-2xl border-white/10 focus:border-primary/50 text-xl font-medium text-center placeholder:text-white/20"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 shadow-inner">
                    <Zap size={16} className="text-primary fill-current" />
                    <span className="font-bold text-xs uppercase tracking-tighter text-white/60">Análise Pro</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 shadow-inner">
                    <TrendingUp size={16} className="text-accent" />
                    <span className="font-bold text-xs uppercase tracking-tighter text-white/60">Viral Score</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-12">
              <Button 
                size="lg" 
                className="h-20 px-24 rounded-[1.5rem] font-black text-2xl gap-4 shadow-[0_20px_50px_rgba(34,197,94,0.3)] group active:scale-95 transition-all duration-500 bg-primary hover:bg-primary/90 text-white"
                onClick={startProcessing}
              >
                GERAR MELHORES MOMENTOS <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-500" />
              </Button>
            </div>
          </motion.div>
        ) : isProcessing && progress < 100 ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto space-y-12 py-20"
          >
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                <Loader2 className="text-primary w-12 h-12 animate-spin" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full flex items-center justify-center border border-white/10">
                  <Video size={16} className="text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Processando seu vídeo...</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  <span>Progresso da IA</span>
                  <span className="text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                  />
                </div>
              </div>
            </div>

            <Card className="glass border-white/10 rounded-3xl overflow-hidden">
              <div className="p-8 space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        step.status === 'completed' ? 'bg-primary text-white' : 
                        step.status === 'processing' ? 'bg-primary/20 text-primary animate-pulse' : 
                        'bg-white/5 text-muted-foreground'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 size={14} /> : 
                         step.status === 'processing' ? <Loader2 size={14} className="animate-spin" /> : 
                         <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                      </div>
                      <span className={`font-medium ${
                        step.status === 'completed' ? 'text-white' : 
                        step.status === 'processing' ? 'text-primary font-bold' : 
                        'text-muted-foreground opacity-50'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {step.status === 'completed' && <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Concluído</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">Cortes Gerados ✨</h2>
                <p className="text-muted-foreground">Encontramos {clips.length} momentos épicos para viralizar.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-xl glass border-white/10 gap-2 h-12" onClick={reset}>
                  Novo Projeto
                </Button>
                <Button variant="outline" className="rounded-xl glass border-white/10 gap-2 h-12">
                  <Archive size={18} /> KIT COMPLETO
                </Button>
                <Button className="rounded-xl h-12 px-8 font-bold gap-2">
                  <Download size={18} /> BAIXAR TODOS OS LANCES
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clips.map((clip, index) => (
                <motion.div 
                  key={clip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card rounded-3xl overflow-hidden group border-white/10 h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={clip.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={clip.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" className="rounded-full h-14 w-14 shadow-2xl scale-90 group-hover:scale-100 transition-all">
                          <Eye size={24} className="fill-current" />
                        </Button>
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-primary/80 backdrop-blur-md border-none px-3 py-1 font-bold">
                          #{index + 1}
                        </Badge>
                        <Badge className="bg-black/60 backdrop-blur-md border-none px-3 py-1">
                          {clip.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                        00:30s
                      </div>
                    </div>
                    
                    <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{clip.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {clip.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Viral Score</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-accent">{clip.viralScore}%</span>
                            <Zap size={14} className="text-accent fill-current" />
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Retenção Est.</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-primary">High</span>
                            <TrendingUp size={14} className="text-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Button variant="ghost" size="icon" className="rounded-xl glass border-white/10 h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all">
                          <Share2 size={18} />
                        </Button>
                        <Button className="flex-1 rounded-xl h-12 font-bold gap-2 active:scale-95 transition-all">
                          <Download size={18} /> Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="bg-primary/5 rounded-3xl p-12 border border-primary/20 text-center space-y-6 relative overflow-hidden group">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
              
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                <Trophy size={40} className="text-primary" />
              </div>
              <h3 className="text-3xl font-bold relative z-10">Pronto para o próximo passo?</h3>
              <p className="text-muted-foreground max-w-lg mx-auto relative z-10 leading-relaxed">
                Nossa IA identificou que esses lances têm alto potencial de engajamento entre 18:00 e 21:00 em dias de semana. Considere postar no TikTok e Shorts simultaneamente.
              </p>
              <div className="flex justify-center gap-4 relative z-10">
                <Button variant="outline" className="rounded-xl px-10 h-14 font-bold glass border-white/10">Ver Relatório Detalhado</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Badge({ children, className, variant = 'default' }: any) {
  const variants: any = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}