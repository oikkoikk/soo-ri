import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'

import { SOORITheme } from '@/theme/soori_theme'

interface TabProps {
  activeTab: string
  setActiveTab: (tabId: string) => void
  tabs: { id: string; label: string }[]
}

export function Tabs({ activeTab, setActiveTab, tabs }: TabProps) {
  const theme = useTheme()

  return (
    <TabContainer theme={theme}>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => {
            setActiveTab(tab.id)
          }}
          theme={theme}
        >
          {tab.label}
        </Tab>
      ))}
    </TabContainer>
  )
}

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  height: 38px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
`

const Tab = styled.div<{ active: boolean; theme: SOORITheme }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => css`
    ...${theme.typography.labelMedium};
  `}
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.onSurfaceVariant)};
  border-bottom: 0.8px solid ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.outline)};
  cursor: pointer;
  transition: all 0.2s ease;
`
