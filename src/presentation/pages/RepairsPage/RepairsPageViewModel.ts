import { useEffect } from 'react'

import { atom, useAtom } from 'jotai'
import { useSearchParams } from 'react-router'

import { RepairModel } from '@/domain/models/models'

// 탭 ID를 열거형으로 정의
export enum TabId {
  REPAIRS = 'repairs',
  VEHICLE = 'vehicle',
}

// 탭 아이템 타입 정의
interface TabItem {
  id: TabId
  label: string
}

const repairsAtom = atom<RepairModel[]>([])
const searchTermAtom = atom<string>('')
const activeTabAtom = atom<TabId>(TabId.REPAIRS)
const modalOpenedAtom = atom<boolean>(false)
const authCodeAtom = atom<string>('')

const tabItems: TabItem[] = [
  { id: TabId.REPAIRS, label: '정비 이력' },
  { id: TabId.VEHICLE, label: '전동보장구 정보' },
]

export function useRepairViewModel() {
  const [repairs, setRepairs] = useAtom(repairsAtom)
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom)
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpenedAtom)
  const [authCode, setAuthCode] = useAtom(authCodeAtom)
  const [searchParams] = useSearchParams()

  const filteredRepairs = repairs
    .filter((repair) => {
      if (!searchTerm) return true
      return repair.type.includes(searchTerm) || repair.shopLabel.includes(searchTerm)
    })
    .sort((a, b) => b.repairedAt.getTime() - a.repairedAt.getTime())

  useEffect(() => {
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

    setRepairs(sampleRepairs)

    if (searchParams.get('id')) {
      setIsModalOpen(true)
    }
  }, [searchParams, setRepairs, setIsModalOpen])

  return {
    repairs,
    filteredRepairs,
    tabItems,
    searchTerm,
    activeTab,
    isModalOpen,
    authCode,

    updateSearchTerm: (term: string) => {
      setSearchTerm(term)
    },

    changeTab: (tabId: TabId) => {
      setActiveTab(tabId)
    },

    updateAuthCode: (code: string) => {
      setAuthCode(code)
    },

    processAuthSubmission: () => {
      if (authCode.length === 4) {
        setIsModalOpen(false)
        setAuthCode('')
        return true
      }
      return false
    },

    goBack: () => {
      window.history.back()
    },

    startNewRepair: () => {
      alert('새 정비 작업을 시작합니다.')
    },
  }
}
