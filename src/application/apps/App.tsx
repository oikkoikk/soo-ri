import { ThemeProvider } from '@emotion/react'
import { RouterProvider } from 'react-router'

import { SOORITheme, GlobalStyle } from '@/theme/theme'

import { FirebaseProvider } from '../configurations/firebase/FirebaseContext'
import { router } from '../routers/routers'

export function App() {
  return (
    <ThemeProvider theme={SOORITheme}>
      <GlobalStyle />
      <FirebaseProvider>
        <RouterProvider router={router} />
      </FirebaseProvider>
    </ThemeProvider>
  )
}
