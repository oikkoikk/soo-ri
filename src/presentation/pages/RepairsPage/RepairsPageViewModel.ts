import { useEffect, useRef } from 'react'

import { atom, useAtom } from 'jotai'
import { useSearchParams } from 'react-router'

import { RepairModel } from '@/domain/models/models'

export enum TabId {
  REPAIRS = 'repairs',
  VEHICLE = 'vehicle',
}

interface TabItem {
  id: TabId
  label: string
}

const repairsAtom = atom<RepairModel[]>([])
const searchKeywordAtom = atom<string>('')
const activeTabAtom = atom<TabId>(TabId.REPAIRS)
const modalOpenedAtom = atom<boolean>(false)
const authCodeAtom = atom<string>('')

const tabItems: TabItem[] = [
  { id: TabId.REPAIRS, label: '정비 이력' },
  { id: TabId.VEHICLE, label: '전동보장구 정보' },
]

export function useRepairViewModel() {
  const [repairs, setRepairs] = useAtom(repairsAtom)
  const [searchKeyword, setSearchKeyword] = useAtom(searchKeywordAtom)
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  const [modalOpened, setModalOpened] = useAtom(modalOpenedAtom)
  const [authCode, setAuthCode] = useAtom(authCodeAtom)
  const [searchParams] = useSearchParams()

  const modalOpenedRef = useRef<boolean>(false)

  const filteredRepairs = repairs
    .filter((repair) => {
      if (!searchKeyword) return true
      return repair.type.includes(searchKeyword) || repair.shopLabel.includes(searchKeyword)
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

    if (searchParams.get('id') && !modalOpenedRef.current) {
      setModalOpened(true)
      modalOpenedRef.current = true
    }
  }, [searchParams, setRepairs, setModalOpened])

  useEffect(() => {
    if (!modalOpened) {
      const timer = setTimeout(() => {
        modalOpenedRef.current = false
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [modalOpened])

  return {
    repairs,
    filteredRepairs,
    tabItems,
    searchKeyword,
    activeTab,
    modalOpened,
    authCode,

    updateSearchKeyword: (term: string) => {
      setSearchKeyword(term)
    },

    changeTab: (tabId: TabId) => {
      setActiveTab(tabId)
    },

    updateAuthCode: (code: string) => {
      setAuthCode(code)
    },

    processAuthSubmission: () => {
      if (authCode.length === 4) {
        setModalOpened(false)
        setAuthCode('')
        return true
      }
      return false
    },
  }
}
