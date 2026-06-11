'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingOverlay } from '@blinkdotnew/ui'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // For managed auth, blink.auth.login() handles redirecting.
      // But we can also show a login button or something.
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return <LoadingOverlay visible />
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Faça login para acessar o FutShorts AI e começar a viralizar seus vídeos de futebol.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Voltar para Home
        </button>
      </div>
    )
  }

  return <>{children}</>
}
