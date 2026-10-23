import { SegmentedControl } from "@/components/segmented-control"

export type AnalyticsRange = "week" | "month" | "year"

type RangeSwitcherProps = {
  range: AnalyticsRange
  onRangeChange: (range: AnalyticsRange) => void
}

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
]

export function RangeSwitcher({ range, onRangeChange }: RangeSwitcherProps) {
  return (
    <SegmentedControl
      label="Analytics range"
      options={RANGES}
      value={range}
      onChange={onRangeChange}
      size="md"
      fullWidthOnMobile
    />
  )
}
