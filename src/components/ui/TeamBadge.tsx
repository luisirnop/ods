import Image from 'next/image'
import { getTeamBrand } from '@/lib/team-logos'

interface Props {
  team: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const SIZES = {
  xs: { container: 'w-6 h-6 text-[9px]',  img: 24 },
  sm: { container: 'w-8 h-8 text-[10px]', img: 32 },
  md: { container: 'w-10 h-10 text-xs',    img: 40 },
  lg: { container: 'w-14 h-14 text-sm',    img: 56 },
}

export default function TeamBadge({ team, size = 'sm' }: Props) {
  const brand = getTeamBrand(team)
  const { container, img } = SIZES[size]

  if (brand.logo) {
    return (
      <div
        className={`${container} rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-white/8`}
        title={team}
      >
        <Image
          src={brand.logo}
          alt={team}
          width={img}
          height={img}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ backgroundColor: brand.bg, color: brand.text }}
      title={team}
    >
      {brand.short}
    </div>
  )
}
