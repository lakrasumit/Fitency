import { ChartColumn } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Your progress over time." />
      <EmptyState
        icon={ChartColumn}
        title="Nothing here yet"
        description="Summary cards, a consistency heatmap, and a trend chart will show up on this screen."
      />
    </>
  )
}
