import { makeAutoObservable } from 'mobx'
import { useNavigate } from 'react-router'

import { useRepairStations } from '@/presentation/hooks/hooks'

export enum SortType {
  DEFAULT = 'default',
  DISTANCE = 'distance',
}

class RepairStationsStore {
  sortType: SortType = SortType.DEFAULT
  constructor() {
    makeAutoObservable(this)
  }
  setSortType = (type: SortType) => {
    this.sortType = type
  }
}

const store = new RepairStationsStore()

export function useRepairStationsViewModel() {
  const navigate = useNavigate()
  const { data: repairStations } = useRepairStations()

  const sortedRepairStations = (() => {
    if (!repairStations) return []
    return [...repairStations].sort((a, b) => {
      if (store.sortType === SortType.DISTANCE) {
        return a.distance - b.distance
      }
      return a.name.localeCompare(b.name)
    })
  })()

  function getRepairStationInfoText(repairStation: { district: string; distance: number }) {
    if (store.sortType === SortType.DISTANCE) {
      return repairStation.distance < 1
        ? String(Math.round(repairStation.distance * 1000)) + 'm'
        : repairStation.distance.toFixed(1) + 'km'
    }
    return repairStation.district
  }

  function handleRepairStationClick(repairStation: { name: string; district: string }) {
    const query = encodeURIComponent(repairStation.name + ' ' + repairStation.district)
    window.open(`https://map.naver.com/p/search/${query}`, '_blank')
  }

  const goBack = () => {
    void navigate(-1)
  }

  return {
    ...store,
    sortType: store.sortType,
    sortedRepairStations,
    goBack,
    getRepairStationInfoText,
    handleRepairStationClick,
  }
}
