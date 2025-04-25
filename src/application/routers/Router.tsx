import { Route, Routes as RouterRoutes } from 'react-router'

import { ROUTES, ROUTE_PAGES } from './routes'

export function Router() {
  return (
    <RouterRoutes>
      {Object.entries(ROUTES).map(([key, path]) => {
        const Page = ROUTE_PAGES[path]
        return <Route key={key} path={path} element={<Page />} />
      })}
    </RouterRoutes>
  )
}
