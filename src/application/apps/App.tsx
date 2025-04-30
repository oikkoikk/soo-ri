import { ThemeProvider } from '@emotion/react'
import { RouterProvider } from 'react-router'

import { SOORITheme, GlobalStyle } from '@/theme/theme'

import { router } from '../routers/Router'

export function App() {
  return (
    <ThemeProvider theme={SOORITheme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
