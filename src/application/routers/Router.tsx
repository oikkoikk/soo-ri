import { Route, Routes as RouterRoutes } from 'react-router'

import { HomePageView } from '@/presentation/pages/pages'

export function Router() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePageView />} />
    </RouterRoutes>
  )
}
