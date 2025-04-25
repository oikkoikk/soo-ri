import { Route, Routes as RouterRoutes } from 'react-router'

import { HomePageView, RepairsPageView } from '@/presentation/pages/pages'

export function Router() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePageView />} />
      <Route path="/repairs" element={<RepairsPageView />} />
    </RouterRoutes>
  )
}
