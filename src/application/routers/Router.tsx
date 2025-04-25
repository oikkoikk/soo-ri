import { Route, Routes as RouterRoutes } from 'react-router'

import { HomePageView, RepairsPageView } from '@/presentation/pages/pages'

import { ROUTES } from './routes'

export function Router() {
  return (
    <RouterRoutes>
      <Route path={ROUTES.HOME} element={<HomePageView />} />
      <Route path={ROUTES.REPAIRS} element={<RepairsPageView />} />
    </RouterRoutes>
  )
}
