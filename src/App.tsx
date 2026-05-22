import { useState } from 'react'
import type { Page } from './types'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { useApplyTheme } from './stores/themeStore'

const PAGES: Record<Page, React.ReactElement> = {
  dashboard: <Dashboard />,
  settings:  <Settings />,
}

export default function App() {
  useApplyTheme()
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <Layout current={page} onNavigate={setPage}>
      {PAGES[page]}
    </Layout>
  )
}
