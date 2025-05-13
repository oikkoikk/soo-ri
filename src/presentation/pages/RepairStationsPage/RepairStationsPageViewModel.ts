import { makeAutoObservable } from 'mobx'
import { useNavigate } from 'react-router'

export enum SortType {
  DEFAULT = 'default',
  DISTANCE = 'distance',
}

interface RepairStation {
  id: string
  name: string
  district: string
  distance?: number
}

class RepairStationsStore {
  stations: RepairStation[] = []
  sortType: SortType = SortType.DEFAULT

  constructor() {
    makeAutoObservable(this)
    this.loadSampleData()
  }

  get sortedStations() {
    return [...this.stations].sort((a, b) => {
      if (this.sortType === SortType.DISTANCE && a.distance && b.distance) {
        return a.distance - b.distance
      }
      // 기본순은 이름으로 정렬
      return a.name.localeCompare(b.name)
    })
  }

  changeSort = (sortType: SortType) => {
    this.sortType = sortType
  }

  loadSampleData = () => {
    // 샘플 데이터
    const sampleStations: RepairStation[] = [
      {
        id: '1',
        name: '성동장애인복지관',
        district: '성동구',
        distance: 2.3,
      },
      {
        id: '2',
        name: '광진장애인복지관',
        district: '광진구',
        distance: 5.1,
      },
      {
        id: '3',
        name: '쏘리 서비스센터',
        district: '강남구',
        distance: 8.7,
      },
      {
        id: '4',
        name: '서울장애인종합복지관',
        district: '강동구',
        distance: 10.2,
      },
      {
        id: '5',
        name: '노원구청 전동보장구 정비센터',
        district: '노원구',
        distance: 15.6,
      },
    ]

    this.stations = sampleStations
  }
}

const store = new RepairStationsStore()

export function useRepairStationsViewModel() {
  const navigate = useNavigate()

  const goBack = () => {
    void navigate(-1)
  }

  return {
    ...store,
    sortedStations: store.sortedStations,
    goBack,
  }
}
