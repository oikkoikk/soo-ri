import { useContext } from 'react'

import { LoadingContext } from './LoadingContext'

export const useLoading = () => {
  const context = useContext(LoadingContext)

  if (context === null) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}
