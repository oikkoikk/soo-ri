export const MobilityAidIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="16" r="5" stroke={color} strokeWidth="2" />
    <path d="M8 21h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 4v8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 12c0 2.8 2.2 5 5 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 6h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 10h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)
