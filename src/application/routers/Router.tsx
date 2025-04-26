import { Route, Routes as RouterRoutes } from 'react-router'

import { ROUTES, ROUTE_PAGES } from './routes'

export function Router() {
  const HomePage = ROUTE_PAGES[ROUTES.HOME]
  const RepairsPage = ROUTE_PAGES[ROUTES.REPAIRS]
  const RepairCreatePage = ROUTE_PAGES[ROUTES.REPAIR_CREATE]
  const RepairDetailPage = ROUTE_PAGES[ROUTES.REPAIR_DETAIL]

  return (
    <RouterRoutes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.REPAIRS} element={<RepairsPage />} />
      <Route path={ROUTES.REPAIR_CREATE} element={<RepairCreatePage />} />
      <Route path={ROUTES.REPAIR_DETAIL} element={<RepairDetailPage />} />
    </RouterRoutes>
  )
}
