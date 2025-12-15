export const ToolIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.7 6.3C15.0833 5.91667 15.5417 5.725 16.075 5.725C16.6083 5.725 17.0667 5.91667 17.45 6.3C17.8333 6.68333 18.025 7.14167 18.025 7.675C18.025 8.20833 17.8333 8.66667 17.45 9.05L16.15 10.35L13.4 7.6L14.7 6.3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4 7.6L4 17V20H7L16.4 10.6L13.4 7.6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
