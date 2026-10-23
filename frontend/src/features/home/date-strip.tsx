import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WorkoutRecord } from "@/lib/types"
import { isDateKey, parseDateKey } from "@/lib/utils/date"
import { resolveWorkout, workoutStats } from "@/lib/utils/workouts"

const WINDOW_DAYS = 15

function centeredWindowStart(date: Date) {
  return startOfDay(addDays(date, -7))
}

type DateStripProps = {
  selectedDate: Date
  records: readonly WorkoutRecord[]
  onSelect: (date: Date) => void
}

export function DateStrip({ selectedDate, records, onSelect }: DateStripProps) {
  const today = startOfDay(new Date())
  const [windowStart, setWindowStart] = useState(() =>
    centeredWindowStart(selectedDate),
  )
  const [windowAnchor, setWindowAnchor] = useState(selectedDate)
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Re-centre the strip only when the selected date moves outside it (for
  // example via the date input or the Today button). Paging the window itself
  // must not feed back into this adjustment.
  if (!isSameDay(windowAnchor, selectedDate)) {
    setWindowAnchor(selectedDate)

    const currentEnd = addDays(windowStart, WINDOW_DAYS - 1)
    if (selectedDate < windowStart || selectedDate > currentEnd) {
      setWindowStart(centeredWindowStart(selectedDate))
    }
  }

  const windowEnd = addDays(windowStart, WINDOW_DAYS - 1)
  const days = eachDayOfInterval({
    start: windowStart,
    end: windowEnd,
  })

  useEffect(() => {
    const container = scrollRef.current
    const button = selectedRef.current
    if (!container || !button) return

    const left =
      button.offsetLeft - container.clientWidth / 2 + button.clientWidth / 2
    container.scrollTo({ left: Math.max(0, left) })
  }, [selectedDate, windowStart])

  function selectKey(value: string) {
    if (!isDateKey(value)) return
    onSelect(parseDateKey(value))
  }

  return (
    <section
      aria-labelledby="date-strip-title"
      className="surface-card rounded-xl border border-border/60 p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="date-strip-title"
          aria-live="polite"
          className="font-heading text-sm font-semibold"
        >
          {isSameMonth(windowStart, windowEnd)
            ? `${format(windowStart, "d")} – ${format(windowEnd, "d MMM yyyy")}`
            : `${format(windowStart, "d MMM")} – ${format(windowEnd, "d MMM yyyy")}`}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelect(today)}
            disabled={isSameDay(selectedDate, today)}
          >
            Today
          </Button>
          <div>
            <label htmlFor="jump-to-date" className="sr-only">
              Jump to date
            </label>
            <Input
              id="jump-to-date"
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(event) => selectKey(event.target.value)}
              className="h-9 w-36"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous two weeks"
          className="size-8 shrink-0"
          onClick={() =>
            setWindowStart((current) => addDays(current, -WINDOW_DAYS))
          }
        >
          <ChevronLeft aria-hidden />
        </Button>

        <div
          ref={scrollRef}
          className="relative flex flex-1 gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd")
            const stats = workoutStats(resolveWorkout(key, records))
            const selected = isSameDay(day, selectedDate)
            const currentDay = isSameDay(day, today)

            const statusLabel = !stats.hasPlan
              ? "no workout planned"
              : stats.isComplete
                ? "workout completed"
                : stats.actualReps > 0
                  ? `${stats.actualReps} of ${stats.plannedReps} reps recorded`
                  : "workout not started"

            return (
              <button
                key={key}
                ref={selected ? selectedRef : undefined}
                type="button"
                aria-pressed={selected}
                aria-current={currentDay ? "date" : undefined}
                aria-label={`${format(day, "EEEE, d MMMM yyyy")}: ${statusLabel}`}
                onClick={() => onSelect(day)}
                className={cn(
                  "flex min-h-16 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 outline-none transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:hover:-translate-y-0.5",
                  selected
                    ? "primary-gradient border-primary text-primary-foreground"
                    : "border-transparent hover:bg-muted hover:shadow-soft",
                  currentDay && !selected && "border-primary/40",
                )}
              >
                <span className="text-[0.6rem] font-medium tracking-wide uppercase opacity-80">
                  {format(day, "EEE")}
                </span>
                <span className="font-heading text-lg leading-none font-semibold">
                  {format(day, "d")}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-200",
                    selected
                      ? "bg-primary-foreground"
                      : !stats.hasPlan
                        ? "bg-transparent"
                        : stats.isComplete
                          ? "bg-success"
                          : stats.actualReps > 0
                            ? "bg-primary"
                            : "bg-muted-foreground/40",
                  )}
                />
              </button>
            )
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next two weeks"
          className="size-8 shrink-0"
          onClick={() =>
            setWindowStart((current) => addDays(current, WINDOW_DAYS))
          }
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </section>
  )
}
