import { ThemeProvider } from '@emotion/react'
import { RouterProvider } from 'react-router'

import { ProgressIndicator } from '@/presentation/components/components'
import { SOORITheme, GlobalStyle } from '@/theme/theme'

import { FirebaseProvider } from '../configurations/configurations'
import { LoadingProvider, useLoading } from '../configurations/contexts/contexts'
import { router } from '../routers/routers'

export function App() {
  return (
    <ThemeProvider theme={SOORITheme}>
      <GlobalStyle />
      <FirebaseProvider>
        <LoadingProvider>
          <AppContent />
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
