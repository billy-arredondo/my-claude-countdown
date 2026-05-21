import { useState } from 'react'
import type { Page } from './types'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { useApplyTheme } from './stores/themeStore'

export default function App() {
  useApplyTheme()
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <Layout current={page} onNavigate={setPage}>
      {page === 'dashboard' && <Dashboard />}
      {page === 'settings' && <Settings />}
    </Layout>
  )
}
