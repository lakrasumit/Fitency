import { ListChecks } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"

export function HabitsPage() {
  return (
    <>
      <PageHeader title="Habits" description="Create and manage your habits." />
      <EmptyState
        icon={ListChecks}
        title="Nothing here yet"
        description="Your habit list and the form to add new habits will show up on this screen."
      />
    </>
  )
}
