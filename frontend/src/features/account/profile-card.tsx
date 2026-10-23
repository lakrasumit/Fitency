import type { User } from "@/lib/types"
import { initials } from "@/lib/utils/format"

type ProfileCardProps = {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section
      aria-labelledby="profile-title"
      className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5"
    >
      <span
        aria-hidden
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/5 font-heading text-xl font-semibold text-primary"
      >
        {initials(user.name)}
      </span>
      <div className="min-w-0 space-y-1">
        <h2
          id="profile-title"
          className="truncate font-heading text-xl font-semibold"
        >
          {user.name}
        </h2>
        {user.email ? (
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        ) : null}
      </div>
    </section>
  )
}
