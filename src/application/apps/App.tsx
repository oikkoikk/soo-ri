import { ThemeProvider } from '@emotion/react'
import { BrowserRouter } from 'react-router'

import { Router } from '@/application/routers/routers'
import { GlobalStyle } from '@/theme/styles/GlobalStyle'
import { theme } from '@/theme/theme'

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  )
}
