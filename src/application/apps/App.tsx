import { ThemeProvider } from '@emotion/react'
import { BrowserRouter } from 'react-router'

import { Router } from '@/application/routers/routers'
import { SOORITheme, GlobalStyle } from '@/theme/theme'

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
