import { ThemeProvider } from '@emotion/react'
import { RouterProvider } from 'react-router'

import { ProgressIndicator } from '@/presentation/components/components'
import { useLoading } from '@/presentation/hooks/hooks'
import { SOORITheme, GlobalStyle } from '@/theme/theme'

import { QueryProvider } from '../configurations/configurations'
import { FirebaseProvider, LoadingProvider } from '../contexts/contexts'
import { router } from '../routers/routers'

export function App() {
  return (
    <ThemeProvider theme={SOORITheme}>
      <GlobalStyle />
      <FirebaseProvider>
        <LoadingProvider>
          <QueryProvider>
            <AppContent />
          </QueryProvider>
        </LoadingProvider>
      </FirebaseProvider>
    </ThemeProvider>
  )
}

export function AppContent() {
  const { loading } = useLoading()

  return (
    <>
      <RouterProvider router={router} />
      {loading && <ProgressIndicator />}
    </>
  )
}
