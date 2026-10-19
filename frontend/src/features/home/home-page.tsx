import { House } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"

export function HomePage() {
  return (
    <>
      <PageHeader title="Home" description="Today's habits and progress." />
      <EmptyState
        icon={House}
        title="Nothing here yet"
        description="Today's habits, your streak, and overall progress will show up on this screen."
      />
    </>
  )
}
