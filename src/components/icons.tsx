import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

function IconBase({ children, size = 18, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.75v2.1" />
      <path d="M12 19.15v2.1" />
      <path d="m4.8 4.8 1.48 1.48" />
      <path d="m17.72 17.72 1.48 1.48" />
      <path d="M2.75 12h2.1" />
      <path d="M19.15 12h2.1" />
      <path d="m4.8 19.2 1.48-1.48" />
      <path d="m17.72 6.28 1.48-1.48" />
    </IconBase>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.2 15.3A8.2 8.2 0 1 1 8.7 3.8a7 7 0 0 0 11.5 11.5Z" />
    </IconBase>
  )
}

export function BookmarkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7.5 4.5h9a1.5 1.5 0 0 1 1.5 1.5v13l-6-3-6 3V6a1.5 1.5 0 0 1 1.5-1.5Z" />
    </IconBase>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21Z" />
      <path d="M5 5.5V21" />
      <path d="M7.5 7H16" />
    </IconBase>
  )
}

export function LayersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </IconBase>
  )
}

export function CodeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </IconBase>
  )
}

export function CompassIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2.2 5.2-5.2 2.2 2.2-5.2 5.2-2.2Z" />
    </IconBase>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.2 2.2L15.8 9" />
    </IconBase>
  )
}

export function ProgressRing({
  progress,
  size = 44,
}: {
  progress: number
  size?: number
}) {
  const radius = size / 2 - 4
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (Math.max(0, Math.min(progress, 100)) / 100) * circumference

  return (
    <svg aria-hidden="true" className="progress-ring" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <circle className="progress-ring-track" cx={size / 2} cy={size / 2} r={radius} />
      <circle
        className="progress-ring-value"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
      />
    </svg>
  )
}
