import { lazy } from 'react'

import { createBrowserRouter } from 'react-router'

import { ProtectedRoute } from './ProtectedRoutes'
import { ROUTES } from './routes'

const HomePage = lazy(() => import('@/presentation/pages/HomePage/HomePageView'))
const SignInPage = lazy(() => import('@/presentation/pages/SignInPage/SignInPageView'))
const RepairsPage = lazy(() => import('@/presentation/pages/RepairsPage/RepairsPageView'))
const RepairCreatePage = lazy(() => import('@/presentation/pages/RepairCreatePage/RepairCreatePageView'))
const RepairDetailPage = lazy(() => import('@/presentation/pages/RepairDetailPage/RepairDetailPageView'))
const RepairStationsPage = lazy(() => import('@/presentation/pages/RepairStationsPage/RepairStationsPageView'))
const VehicleTestPage = lazy(() => import('@/presentation/pages/VehicleTestPage/VehicleTestPageView'))

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute requireAuth={false}>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SIGN_IN,
    element: <SignInPage />,
  },
  {
    path: ROUTES.REPAIRS,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REPAIR_CREATE,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REPAIR_DETAIL,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REPAIR_STATIONS,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairStationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.VEHICLE_TEST,
    element: (
      <ProtectedRoute requireAuth={true}>
        <VehicleTestPage />
      </ProtectedRoute>
    ),
  },
])
