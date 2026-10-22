import { create } from "zustand"
import type { WorkoutRecord } from "@/lib/types"
import { getServiceErrorMessage } from "@/lib/services/errors"
import {
  getWorkoutData,
  saveWorkoutRecord,
} from "@/lib/services/workouts"
import { sortWorkoutRecords } from "@/lib/utils/workouts"

type WorkoutsState = {
  records: WorkoutRecord[]
  startDate: string | null
  loading: boolean
  /** True once saved workouts have been loaded at least once. */
  initialized: boolean
  error: string | null
  loadWorkouts: () => Promise<void>
  saveWorkout: (record: WorkoutRecord) => Promise<boolean>
  clearError: () => void
  reset: () => void
}

export const useWorkoutsStore = create<WorkoutsState>((set, get) => ({
  records: [],
  startDate: null,
  loading: false,
  initialized: false,
  error: null,

  loadWorkouts: async () => {
    set({ loading: true, error: null })
    try {
      const { records, startDate } = await getWorkoutData()
      set({
        records: sortWorkoutRecords(records),
        startDate,
        loading: false,
        initialized: true,
      })
    } catch (error) {
      set({
        loading: false,
        initialized: true,
        error: getServiceErrorMessage(
          error,
          "Could not load your workout records.",
        ),
      })
    }
  },

  saveWorkout: async (record) => {
    const previous = get().records
    const next = sortWorkoutRecords([
      ...previous.filter((saved) => saved.date !== record.date),
      record,
    ])

    set({ records: next, error: null })

    try {
      await saveWorkoutRecord(record)
      return true
    } catch (error) {
      const latest = get().records
      const latestRecord = latest.find((saved) => saved.date === record.date)
      const stillLatest = latestRecord?.updatedAt === record.updatedAt

      set({
        records: stillLatest ? previous : latest,
        error: getServiceErrorMessage(
          error,
          "Your workout changes could not be saved.",
        ),
      })
      return false
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      records: [],
      startDate: null,
      loading: false,
      initialized: false,
      error: null,
    }),
}))
