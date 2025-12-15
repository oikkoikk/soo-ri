export const WrenchIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(12 12) scale(-1.15 1.15) translate(-12 -12) translate(-0.1 0)">
      <path
        fill={color}
        d="M22.7 19.3l-6.1-6.1c.7-1.6.4-3.5-.9-4.8-1.2-1.2-3-1.6-4.5-1.1L14 10l-2 2-2.7-2.7c-.5 1.5-.1 3.3 1.1 4.5 1.3 1.3 3.2 1.6 4.8.9l6.1 6.1c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4z"
      />
    </g>
  </svg>
)
