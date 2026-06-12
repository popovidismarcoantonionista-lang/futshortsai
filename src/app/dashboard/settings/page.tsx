'use client'

import { Card } from '@blinkdotnew/ui'
import { Settings, User, Bell, Lock, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  const sections = [
    { icon: <User />, title: 'Perfil', desc: 'Gerencie suas informações pessoais e avatar.' },
    { icon: <Bell />, title: 'Notificações', desc: 'Configure como você quer receber alertas de processamento.' },
    { icon: <Lock />, title: 'Segurança', desc: 'Proteja sua conta com autenticação de dois fatores.' },
    { icon: <CreditCard />, title: 'Faturamento', desc: 'Gerencie sua assinatura e histórico de pagamentos.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <Settings className="text-primary" /> Configurações
        </h1>
        <p className="text-muted-foreground font-medium">Ajuste as preferências da sua conta FutShorts AI.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((s, i) => (
          <Card key={i} className="glass-card rounded-2xl p-6 border-white/10 hover:bg-white/5 cursor-pointer transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                {s.icon}
              </div>
              <div>
                <h3 className="font-bold text-white">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
