import { BrowserRouter } from 'react-router'

import { Router } from '@/application/routers/routers'

export function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}
