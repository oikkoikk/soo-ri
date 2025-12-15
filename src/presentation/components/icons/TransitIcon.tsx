export const TransitIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 20h10c1.1 0 2-.9 2-2V8c0-2.2-2.7-4-7-4S5 5.8 5 8v10c0 1.1.9 2 2 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 8h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="8.5" cy="17" r="1" fill={color} />
    <circle cx="15.5" cy="17" r="1" fill={color} />
  </svg>
)
