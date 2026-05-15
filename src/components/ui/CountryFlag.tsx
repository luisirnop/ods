import Image from 'next/image'

interface Props {
  code: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// [width_px, height_px, flagcdn_width]
const SIZES: Record<string, [number, number, number]> = {
  xs: [28, 20, 40],
  sm: [40, 28, 80],
  md: [56, 40, 80],
  lg: [80, 56, 160],
  xl: [120, 80, 160],
}

export default function CountryFlag({ code, name, size = 'md', className = '' }: Props) {
  if (!code) return null
  const [w, h, imgW] = SIZES[size]
  return (
    <div
      className={`overflow-hidden rounded shadow-sm shrink-0 ${className}`}
      style={{ width: w, height: h }}
    >
      <Image
        src={`https://flagcdn.com/w${imgW}/${code}.png`}
        alt={name ? `Bandeira de ${name}` : code}
        width={w}
        height={h}
        className="object-cover w-full h-full"
        unoptimized
      />
    </div>
  )
}
