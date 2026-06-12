'use client'

import { AppShell, AppShellSidebar, AppShellMain, MobileSidebarTrigger, SidebarItem, Button, Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, Toaster } from '@blinkdotnew/ui'
import { PlusCircle, History, Download, Settings, HelpCircle, Trophy, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: <PlusCircle size={20} />, label: 'Novo Projeto', href: '/dashboard/videos/new' },
    { icon: <History size={20} />, label: 'Histórico', href: '/dashboard/videos' },
    { icon: <Download size={20} />, label: 'Downloads', href: '/dashboard/history' },
    { icon: <Settings size={20} />, label: 'Configurações', href: '/dashboard/settings' },
    { icon: <HelpCircle size={20} />, label: 'Ajuda', href: '/dashboard/help' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <AppShell>
      <AppShellSidebar className="shrink-0">
        <div className="flex flex-col h-full w-[260px] glass border-r border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg text-white">Fut Shorts AI</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Pro Tool</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                className="hover:bg-white/5 transition-colors rounded-lg text-white/70"
              />
            ))}
          </div>

          <div className="p-4 border-t border-white/5 space-y-4">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Créditos IA</span>
                <span className="text-xs font-bold text-primary">10 / 10</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto hover:bg-white/5 rounded-xl">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-white font-bold">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-xs truncate">
                    <span className="font-bold truncate w-32 text-left text-white">{user?.displayName || 'Usuário Pro'}</span>
                    <span className="text-muted-foreground truncate w-32 text-left opacity-60">{user?.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-56 glass border-white/10">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer text-white">Perfil</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer text-white">Faturamento</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AppShellSidebar>

      <AppShellMain className="bg-[#09090b]">
        <div className="md:hidden h-16 border-b border-white/5 flex items-center px-4 glass">
          <MobileSidebarTrigger />
          <div className="flex items-center gap-2 ml-4">
            <Trophy className="text-primary w-5 h-5" />
            <span className="font-bold text-sm tracking-tight uppercase text-white">Fut Shorts AI</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </AppShellMain>
      <Toaster position="bottom-right" />
    </AppShell>
  )
}
