import { cn } from "@/lib/utils"

type DetailListProps = {
  title: string
  items: string[]
  ordered?: boolean
  /** Smaller type and spacing for nested template details. */
  compact?: boolean
}

export function DetailList({
  title,
  items,
  ordered = false,
  compact = false,
}: DetailListProps) {
  if (items.length === 0) return null

  const List = ordered ? "ol" : "ul"
  const Wrapper = compact ? "div" : "section"
  const Heading = compact ? "p" : "h3"

  return (
    <Wrapper>
      <Heading
        className={cn(
          compact ? "text-xs font-medium" : "font-heading text-sm font-semibold",
        )}
      >
        {title}
      </Heading>
      <List
        className={cn(
          "text-muted-foreground",
          compact ? "mt-1 space-y-1 pl-4 text-xs" : "mt-2 space-y-1.5 pl-5 text-sm",
          ordered ? "list-decimal" : "list-disc",
        )}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </Wrapper>
  )
}
