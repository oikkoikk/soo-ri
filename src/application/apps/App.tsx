import { ThemeProvider } from '@emotion/react'
import { BrowserRouter } from 'react-router'

import { Router } from '@/application/routers/routers'
import { GlobalStyle } from '@/theme/styles/styles'
import { SOORITheme } from '@/theme/theme'

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={SOORITheme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  )
}
