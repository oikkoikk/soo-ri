import { JSX, useEffect, useMemo } from 'react'

import { Navigate, useLocation } from 'react-router'

import { useLoading, useUserRole } from '@/presentation/hooks/hooks'

import { buildRoute } from './routes'

interface LocationState {
  from?: {
    pathname: string
    search?: string
  }
}

interface ProtectedRouteProps {
  children: JSX.Element
  requireAuth: boolean
}

export const ProtectedRoute = ({ children, requireAuth }: ProtectedRouteProps) => {
  const { userRole, isLoading } = useUserRole()
  const { showLoading, hideLoading } = useLoading()
  const location = useLocation()

  const isLocationState = (state: unknown): state is LocationState => {
    return state !== null && typeof state === 'object' && 'from' in state
  }

  const locationState = isLocationState(location.state) ? location.state : undefined

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      params[key] = value
    })

    return params
  }, [location.search])

  useEffect(() => {
    if (isLoading) showLoading()
    else hideLoading()
  }, [isLoading, showLoading, hideLoading])

  if (isLoading) {
    return null
  }

  if (requireAuth && !userRole) {
    return (
      <Navigate
        to={buildRoute('SIGN_IN')}
        replace
        state={{ from: { pathname: location.pathname, search: location.search } }}
      />
    )
  }

  if (!requireAuth && userRole) {
    const internalNavigation = locationState?.from !== undefined

    if (internalNavigation && locationState.from?.pathname) {
      return <Navigate to={`${locationState.from.pathname}${locationState.from.search ?? ''}`} replace />
    } else {
      return <Navigate to={buildRoute('REPAIRS', {}, queryParams)} replace />
    }
  }

  return children
}
