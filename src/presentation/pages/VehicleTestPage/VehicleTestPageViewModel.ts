import { makeAutoObservable } from 'mobx'
import { useNavigate } from 'react-router'

interface TestItem {
  id: number
  question: string
  answer: boolean | null
}

class VehicleTestStore {
  testItems: TestItem[] = []

  constructor() {
    makeAutoObservable(this)
    this.initializeTestItems()
  }

  get allItemsAnswered() {
    return this.testItems.every((item) => item.answer !== null)
  }

  setAnswer = (id: number, answer: boolean) => {
    const item = this.testItems.find((i) => i.id === id)
    if (item) {
      item.answer = answer
    }
  }

  initializeTestItems = () => {
    this.testItems = [
      {
        id: 1,
        question: '튜브의 펑크가 자주 일어난다.',
        answer: null,
      },
      {
        id: 2,
        question: '타이어의 마모가 심하여 자주 교체한다.',
        answer: null,
      },
      {
        id: 3,
        question: '완충 후에도 배터리의 소모가 빠르다.',
        answer: null,
      },
      {
        id: 4,
        question: '계기판 및 조이스틱 컨트롤러의 배터리 게이지가 깜빡깜빡 거린다.',
        answer: null,
      },
      {
        id: 5,
        question: '충전이 되지 않는다.',
        answer: null,
      },
      {
        id: 6,
        question: '구동 시 소음이 심하다.',
        answer: null,
      },
      {
        id: 7,
        question: '차체에서 소리가 난다.',
        answer: null,
      },
      {
        id: 8,
        question: '속도가 너무 느리거나 너무 빠르다.',
        answer: null,
      },
      {
        id: 9,
        question: '배터리의 교체시기가 빠르다.',
        answer: null,
      },
      {
        id: 10,
        question: '하루종일 충전을 해도 완충이 되지 않는다.',
        answer: null,
      },
      {
        id: 11,
        question: '완충 후에도 속도가 많이 느리다.',
        answer: null,
      },
      {
        id: 12,
        question: '타이어와 튜브를 자체적으로 교체하려 한다.',
        answer: null,
      },
    ]
  }

  saveTestResults = () => {
    // 여기서 실제 저장 로직 구현 (API 호출 등)
    console.log('Test results saved:', this.testItems)
  }
}

const store = new VehicleTestStore()

export function useVehicleTestViewModel() {
  const navigate = useNavigate()

  const goBack = () => {
    void navigate(-1)
  }

  return {
    ...store,
    allItemsAnswered: store.allItemsAnswered,
    testItems: store.testItems,
    setAnswer: store.setAnswer,
    saveTestResults: store.saveTestResults,
    goBack,
  }
}
