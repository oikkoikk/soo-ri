export const RouteIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="19" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M9 19H15C17.2091 19 19 17.2091 19 15V9C19 6.79086 17.2091 5 15 5H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="5" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
