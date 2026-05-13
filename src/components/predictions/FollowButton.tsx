'use client'

import { useState, useTransition } from 'react'
import { toggleFollow } from '@/actions/palpites'

interface Props {
  targetUserId: string
  initialFollowing: boolean
}

export default function FollowButton({ targetUserId, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const newFollowing = !following
    setFollowing(newFollowing)
    startTransition(async () => {
      const result = await toggleFollow(targetUserId)
      if ('error' in result) setFollowing(!newFollowing)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors disabled:opacity-60 ${
        following
          ? 'border-muted text-muted-foreground hover:border-red-500/50 hover:text-red-500'
          : 'border-green-500 text-green-600 hover:bg-green-500/10'
      }`}
    >
      {following ? 'Seguindo' : '+ Seguir'}
    </button>
  )
}
