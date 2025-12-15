export const LightbulbIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 18H15M10 22H14M12 2C8.68629 2 6 4.68629 6 8C6 10.5 7 11.5 8 13C8.5 13.5 9 14.5 9 16H15C15 14.5 15.5 13.5 16 13C17 11.5 18 10.5 18 8C18 4.68629 15.3137 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
