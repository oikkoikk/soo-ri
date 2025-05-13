import { JSX, useEffect, useState, useRef, useMemo } from 'react'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { Navigate, useLocation } from 'react-router'

import { useLoading } from '@/presentation/hooks/hooks'

import { buildRoute } from './routes'

function useAuthState() {
  const auth = getAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [auth])

  return { user, loading, error }
}

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
  const { user, loading, error } = useAuthState()
  const { showLoading, hideLoading } = useLoading()
  const location = useLocation()
  const previousPageRef = useRef<JSX.Element | null>(null)

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
    if (loading) {
      showLoading()
    } else {
      hideLoading()
    }
  }, [loading, showLoading, hideLoading])

  if (error) {
    console.error('Auth state error:', error)
  }

  if (loading) {
    previousPageRef.current ??= children
    return previousPageRef.current
  }
  console.log(
    (async () => {
      return await user?.getIdToken()
    })()
  )

  if (requireAuth && !user) {
    return (
      <Navigate
        to={buildRoute('SIGN_IN')}
        replace
        state={{ from: { pathname: location.pathname, search: location.search } }}
      />
    )
  }

  if (!requireAuth && user) {
    const internalNavigation = locationState?.from !== undefined

    if (internalNavigation && locationState.from?.pathname) {
      return <Navigate to={`${locationState.from.pathname}${locationState.from.search ?? ''}`} replace />
    } else {
      return <Navigate to={buildRoute('REPAIRS', {}, queryParams)} replace />
    }
  }

  return children
}
