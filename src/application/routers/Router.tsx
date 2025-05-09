import { lazy } from 'react'

import { createBrowserRouter } from 'react-router'

import { ROUTES } from './routes'

const HomePage = lazy(() => import('@/presentation/pages/HomePage/HomePageView'))
const SignInPage = lazy(() => import('@/presentation/pages/SignInPage/SignInPageView'))
const RepairsPage = lazy(() => import('@/presentation/pages/RepairsPage/RepairsPageView'))
const RepairCreatePage = lazy(() => import('@/presentation/pages/RepairCreatePage/RepairCreatePageView'))
const RepairDetailPage = lazy(() => import('@/presentation/pages/RepairDetailPage/RepairDetailPageView'))

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.SIGN_IN,
    element: <SignInPage />,
  },
  {
    path: ROUTES.REPAIRS,
    element: <RepairsPage />,
  },
  {
    path: ROUTES.REPAIR_CREATE,
    element: <RepairCreatePage />,
  },
  {
    path: ROUTES.REPAIR_DETAIL,
    element: <RepairDetailPage />,
  },
])
