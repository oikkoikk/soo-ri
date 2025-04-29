import { useEffect } from 'react'

import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel } from '@/domain/models/models'

export enum TabId {
  REPAIRS = 'repairs',
  VEHICLE = 'vehicle',
}

interface TabItem {
  id: TabId
  label: string
}

const AUTH_SESSION_KEY = 'repair-shop-auth-session'

const tabItems: TabItem[] = [
  { id: TabId.REPAIRS, label: '정비 이력' },
  { id: TabId.VEHICLE, label: '전동보장구 정보' },
]

class RepairsPageStore {
  repairs: RepairModel[] = []
  searchKeyword = ''
  activeTab: TabId = TabId.REPAIRS
  modalOpened = false
  authCode = ''

  constructor() {
    makeAutoObservable(this)
    this.loadSampleData()
  }

  get filteredRepairs() {
    return this.repairs
      .filter((repair) => {
        if (!this.searchKeyword) return true
        return repair.type.includes(this.searchKeyword) || repair.shopLabel.includes(this.searchKeyword)
      })
      .sort((a, b) => b.repairedAt.getTime() - a.repairedAt.getTime())
  }

  updateSearchKeyword = (term: string) => {
    this.searchKeyword = term
  }

  changeTab = (tabId: TabId) => {
    this.activeTab = tabId
  }

  updateAuthCode = (code: string) => {
    this.authCode = code
  }

  submitAuthCode = () => {
    if (this.authCode.length === 4) {
      // TODO: 실제 인증 로직 구현
      if (this.authCode === '1234') {
        this.saveAuthSession()
        this.modalOpened = false
        this.authCode = ''
        return true
      }
      alert('인증 코드가 올바르지 않습니다.')
    }
    return false
  }

  checkAuthSession = (): boolean => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true'
  }

  saveAuthSession = (): void => {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true')
  }

  loadSampleData = () => {
    // 샘플 데이터
    const sampleRepairs = [
      new RepairModel({
        id: '1',
        repairedAt: new Date('2024-04-12'),
        price: 42000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '2',
        repairedAt: new Date('2023-11-22'),
        price: 83000,
        type: '사고 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '3',
        repairedAt: new Date('2023-04-18'),
        price: 62000,
        type: '사고 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '4',
        repairedAt: new Date('2023-01-12'),
        price: 12000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '5',
        repairedAt: new Date('2022-07-25'),
        price: 15000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '6',
        repairedAt: new Date('2022-05-01'),
        price: 47000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
    ]

    this.repairs = sampleRepairs
  }

  checkAuthAndShowModal = (searchParams: URLSearchParams) => {
    const isAuthenticated = this.checkAuthSession()
    const vehicleId = searchParams.get('vehicleId') ?? ''

    if (vehicleId && !isAuthenticated) {
      this.modalOpened = true
    }
  }
}

const store = new RepairsPageStore()

export function useRepairViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  useEffect(() => {
    store.checkAuthAndShowModal(searchParams)
  }, [searchParams])

  const goBack = () => {
    void navigate(buildRoute('HOME', {}, { vehicleId: vehicleId }))
  }

  const goRepairCreatePage = () => {
    void navigate(buildRoute('REPAIR_CREATE', {}, { vehicleId: vehicleId }))
  }

  return {
    ...store,
    vehicleId,
    filteredRepairs: store.filteredRepairs,
    tabItems,
    goBack,
    goRepairCreatePage,
  }
}
