'use client'

import { Card } from '@blinkdotnew/ui'
import { HelpCircle, MessageCircle, FileText, PlayCircle } from 'lucide-react'

export default function HelpPage() {
  const items = [
    { icon: <PlayCircle />, title: 'Primeiros Passos', desc: 'Aprenda a subir seu primeiro vídeo e gerar cortes.' },
    { icon: <FileText />, title: 'Documentação', desc: 'Guia completo sobre como nossa IA detecta lances.' },
    { icon: <MessageCircle />, title: 'Suporte VIP', desc: 'Fale com nossa equipe técnica via chat ou email.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <HelpCircle className="text-primary" /> Central de Ajuda
        </h1>
        <p className="text-muted-foreground font-medium">Como podemos ajudar você hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <Card key={i} className="glass-card rounded-2xl p-8 border-white/10 hover:border-primary/50 text-center space-y-4 cursor-pointer transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
              {item.icon}
            </div>
            <h3 className="font-bold text-white">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
