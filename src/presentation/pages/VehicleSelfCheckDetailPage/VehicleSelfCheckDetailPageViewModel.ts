import { useNavigate, useParams, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routers'
import { SelfCheckModel } from '@/domain/models/models'
import { useSelfCheck } from '@/presentation/hooks/hooks'

interface CategoryIssue {
  field: keyof SelfCheckModel
  description: string
  hasIssue: boolean
}

interface CategoryItem {
  name: string
  issueCount: number
  issues: CategoryIssue[]
}

export function useVehicleSelfCheckDetailViewModel() {
  const navigate = useNavigate()
  const { id: selfCheckId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const { selfCheck } = useSelfCheck({ vehicleId, selfCheckId })

  const goBack = () => {
    void navigate(buildRoute('VEHICLE_SELF_CHECK', {}, { vehicleId: vehicleId }))
  }

  const getCategoryItems = (): CategoryItem[] => {
    return [
      {
        name: '구동장치',
        issueCount: selfCheck.driveIssueCount,
        issues: [
          {
            field: 'motorNoise',
            description: '구동 모터에서 비정상 소음이 발생해요',
            hasIssue: selfCheck.motorNoise,
          },
          {
            field: 'abnormalSpeed',
            description: '전진/후진 시 비정상적인 속도 변화가 있어요',
            hasIssue: selfCheck.abnormalSpeed,
          },
        ],
      },
      {
        name: '전자제어',
        issueCount: selfCheck.controlIssueCount,
        issues: [
          {
            field: 'batteryBlinking',
            description: '배터리 표시등이 깜빡거려요',
            hasIssue: selfCheck.batteryBlinking,
          },
          {
            field: 'chargingNotStart',
            description: '충전이 시작되지 않아요',
            hasIssue: selfCheck.chargingNotStart,
          },
        ],
      },
      {
        name: '제동장치',
        issueCount: selfCheck.brakeIssueCount,
        issues: [
          {
            field: 'breakDelay',
            description: '제동 시 지연이 발생해요',
            hasIssue: selfCheck.breakDelay,
          },
          {
            field: 'breakPadIssue',
            description: '브레이크 패드에 문제가 있어요',
            hasIssue: selfCheck.breakPadIssue,
          },
        ],
      },
      {
        name: '타이어&튜브',
        issueCount: selfCheck.tireIssueCount,
        issues: [
          {
            field: 'tubePunctureFrequent',
            description: '튜브 펑크가 자주 발생해요',
            hasIssue: selfCheck.tubePunctureFrequent,
          },
          {
            field: 'tireWearFrequent',
            description: '타이어 마모가 빠르게 진행돼요',
            hasIssue: selfCheck.tireWearFrequent,
          },
        ],
      },
      {
        name: '배터리',
        issueCount: selfCheck.batteryIssueCount,
        issues: [
          {
            field: 'batteryDischargeFast',
            description: '배터리 방전이 빠르게 진행돼요',
            hasIssue: selfCheck.batteryDischargeFast,
          },
          {
            field: 'incompleteCharging',
            description: '충전이 완전히 되지 않아요',
            hasIssue: selfCheck.incompleteCharging,
          },
        ],
      },
      {
        name: '시트',
        issueCount: selfCheck.seatIssueCount,
        issues: [
          {
            field: 'seatUnstable',
            description: '시트가 불안정해요',
            hasIssue: selfCheck.seatUnstable,
          },
          {
            field: 'seatCoverIssue',
            description: '시트 커버에 문제가 있어요',
            hasIssue: selfCheck.seatCoverIssue,
          },
        ],
      },
      {
        name: '발걸이',
        issueCount: selfCheck.footrestIssueCount,
        issues: [
          {
            field: 'footRestLoose',
            description: '발판이 흔들려요',
            hasIssue: selfCheck.footRestLoose,
          },
          {
            field: 'antislipWorn',
            description: '미끄럼 방지 패드가 닳았어요',
            hasIssue: selfCheck.antislipWorn,
          },
        ],
      },
      {
        name: '프레임',
        issueCount: selfCheck.frameIssueCount,
        issues: [
          {
            field: 'frameNoise',
            description: '프레임에서 소음이 발생해요',
            hasIssue: selfCheck.frameNoise,
          },
          {
            field: 'frameCrack',
            description: '프레임에 균열이 있어요',
            hasIssue: selfCheck.frameCrack,
          },
        ],
      },
    ]
  }

  const categoryItems = getCategoryItems()

  return {
    selfCheck,
    goBack,
    vehicleId,
    categoryItems,
  }
}
