export const BusIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 6V4M16 6V4M7 11H17M7 15H11M5 22H19C20.1046 22 21 21.1046 21 20V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V20C3 21.1046 3.89543 22 5 22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="18" r="1" fill={color} />
    <circle cx="16" cy="18" r="1" fill={color} />
  </svg>
)
