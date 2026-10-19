import { UserRound } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"

export function AccountPage() {
  return (
    <>
      <PageHeader title="Account" description="Your profile and settings." />
      <EmptyState
        icon={UserRound}
        title="Nothing here yet"
        description="Your profile, theme setting, and account actions will show up on this screen."
      />
    </>
  )
}
