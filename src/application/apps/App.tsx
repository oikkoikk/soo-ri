import { ThemeProvider } from '@emotion/react'
import { RouterProvider } from 'react-router'

import { SOORITheme, GlobalStyle } from '@/theme/theme'

import { router } from '../routers/routers'

export function App() {
  return (
    <ThemeProvider theme={SOORITheme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
