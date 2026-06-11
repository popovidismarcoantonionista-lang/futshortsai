'use client'

import ToolLayout from './dashboard/layout.tsx'
import NewVideoPage from './dashboard/videos/new/page'

export default function Home() {
  return (
    <ToolLayout>
      <NewVideoPage />
    </ToolLayout>
  )
}
