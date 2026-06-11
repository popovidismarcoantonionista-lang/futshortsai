'use client'

import { Button, DataTable, Card, EmptyState } from '@blinkdotnew/ui'
import { Plus, Video, Search, Filter, ExternalLink, Trash2, Zap, Trophy, History } from 'lucide-react'
import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function VideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const data = await blink.db.videos.list({
        orderBy: { createdAt: 'desc' }
      })
      setVideos(data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const deleteVideo = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este vídeo e todos os seus cortes?')) {
      try {
        await blink.db.videos.delete(id)
        fetchVideos()
      } catch (error) {
        console.error('Error deleting video:', error)
      }
    }
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Projeto',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner text-primary">
            <Video size={20} />
          </div>
          <div className="flex flex-col truncate max-w-[300px]">
            <span className="font-bold text-white truncate text-base">{row.original.name || 'Projeto Futebol'}</span>
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-black opacity-40">{row.original.id}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'IA Status',
      cell: ({ row }: any) => {
        const status = row.original.status
        const labels: any = {
          completed: 'Concluído',
          processing: 'Analisando',
          pending: 'Na Fila',
          failed: 'Falhou'
        }
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'completed' ? 'bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
              status === 'failed' ? 'bg-destructive' : 'bg-accent animate-pulse'
            }`} />
            <span className="text-sm font-medium text-white/80">{labels[status] || status}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      cell: ({ row }: any) => (
        <span className="text-sm text-muted-foreground font-medium">
          {format(new Date(row.original.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: any) => (
        <div className="flex items-center justify-end gap-3 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push(`/dashboard/videos/${row.original.id}`)}
            className="hover:bg-primary/10 hover:text-primary rounded-xl text-muted-foreground"
          >
            <ExternalLink size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => deleteVideo(row.original.id)}
            className="hover:bg-destructive/10 hover:text-destructive rounded-xl text-muted-foreground"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
              <History size={16} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Histórico de Projetos</h1>
          </div>
          <p className="text-muted-foreground">Gerencie seus vídeos e cortes gerados pela inteligência artificial.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/videos/new')} className="gap-2 rounded-xl h-12 px-6 font-bold">
          <Plus size={20} /> Novo Projeto
        </Button>
      </div>

      <Card className="glass border-white/10 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              placeholder="Buscar projetos..." 
              className="w-full bg-transparent border-none focus:ring-0 text-sm pl-10 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs gap-2 rounded-lg border border-white/5 text-muted-foreground">
              <Filter size={14} /> Filtros
            </Button>
          </div>
        </div>
        
        <div className="min-h-[400px]">
          {videos.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={videos} 
              loading={isLoading}
            />
          ) : (
            !isLoading && (
              <div className="py-32">
                <EmptyState 
                  icon={<Video size={48} className="opacity-20 text-muted-foreground" />}
                  title="Nenhum projeto encontrado"
                  description="Inicie seu primeiro projeto de clipping agora mesmo."
                  action={{
                    label: 'Começar Agora',
                    onClick: () => router.push('/dashboard/videos/new')
                  }}
                  className="bg-transparent"
                />
              </div>
            )
          )}
        </div>
      </Card>

      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Video size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{videos.length}</div>
              <div className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Vídeos Processados</div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{videos.length * 3}</div>
              <div className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Cortes Gerados</div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">
              <Trophy size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">94%</div>
              <div className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">Viral Score Médio</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
