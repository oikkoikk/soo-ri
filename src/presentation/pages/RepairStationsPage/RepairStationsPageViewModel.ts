import { useState, useMemo } from 'react'

import { useNavigate } from 'react-router'

import { useRepairStations } from '@/presentation/hooks/hooks'

export enum SortType {
  DEFAULT = 'default',
  DISTANCE = 'distance',
}

export function useRepairStationsViewModel() {
  const navigate = useNavigate()
  const { data: stations } = useRepairStations()
  const [sortType, setSortType] = useState<SortType>(SortType.DEFAULT)

  const sortedStations = useMemo(() => {
    if (!stations) return []
    return [...stations].sort((a, b) => {
      if (sortType === SortType.DISTANCE) {
        return a.distance - b.distance
      }
      return a.name.localeCompare(b.name)
    })
  }, [stations, sortType])

  const changeSort = (type: SortType): void => {
    setSortType(type)
  }

  const goBack = () => {
    void navigate(-1)
  }

  return { sortedStations, sortType, changeSort, goBack }
}
