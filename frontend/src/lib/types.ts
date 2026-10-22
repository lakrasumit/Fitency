export type WorkoutCategory =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core"
  | "fullBody"
  | "rest"

export type ExerciseStatus = "completed" | "partial" | "notCompleted"

export type ExerciseDetails = {
  muscle: string
  equipment: string
  targetWeight: string
  difficulty: string
  secondary: string
  instructions: string[]
  breathing: string[]
  mistakes: string[]
  safety: string[]
}

export type WorkoutExercise = ExerciseDetails & {
  id: string
  name: string
  targetSets: number
  targetReps: number
  /** Actual reps for each target set; index 0 is set 1. */
  actualReps: number[]
  /** Manual override; null means the status is derived from recorded reps. */
  statusOverride: ExerciseStatus | null
}

export type ExerciseTemplate = ExerciseDetails & {
  id: string
  name: string
  targetSets: number
  targetReps: number
}

export type WorkoutTemplate = {
  id: string
  name: string
  category: WorkoutCategory
  focus: string
  description: string
  exercises: ExerciseTemplate[]
}

export type WorkoutRecord = {
  date: string
  templateId: string | null
  name: string
  category: WorkoutCategory
  focus: string
  description: string
  exercises: WorkoutExercise[]
  updatedAt: string
}

export type ExerciseInput = {
  name: string
  muscle: string
  equipment: string
  targetSets: number
  targetReps: number
  targetWeight: string
}

export type WorkoutSettings = {
  startDate: string
}

export type User = {
  id: string
  name: string
  email: string
}
