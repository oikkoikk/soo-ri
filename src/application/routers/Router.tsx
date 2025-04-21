import { Route, Routes as RouterRoutes } from 'react-router'

import { HomePage } from '@/presentation/pages/pages'

export function Router() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
    </RouterRoutes>
  )
}
