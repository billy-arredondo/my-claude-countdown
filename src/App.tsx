import { useState } from 'react'
import type { Page } from './types'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <>
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'settings' && <Settings onNavigate={setPage} />}
    </>
  )
}
