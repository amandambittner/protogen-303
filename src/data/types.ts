export type Category = 'medical' | 'nursery' | 'financial' | 'gear' | 'support' | 'documents'
export type Priority = 'high' | 'medium' | 'low'
export type Status = 'pending' | 'in_progress' | 'done'
export type TaskState = 'add' | 'done' | 'skip' // onboarding selection state only
export type Effort = 'quick' | 'few_hours' | 'big_project'
export type Timing = 'this_week' | 'this_month' | 'later' | 'near_due'
export type BabySex = 'boy' | 'girl' | 'surprise'

// An event a task can't be started until, e.g. items can't be set up until gifted at a shower.
export type DependencyEvent = 'birth' | 'baby_shower'

export interface TaskDependency {
  event: DependencyEvent
  offsetWeeks: number // weeks after the event date this task should be scheduled
}

// Shape of each entry in tasks.json
export interface LibraryTask {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  suggestedWeeksBeforeDue: number
  estimatedHours: number
  dependsOn?: TaskDependency
}

// Live task record (stored in Supabase)
export interface Task {
  id: string // Supabase uuid
  planId: string
  libraryTaskId: string | null // null for custom tasks
  title: string
  description: string
  category: Category
  priority: Priority
  estimatedHours: number
  suggestedWeeksBeforeDue: number
  scheduledWeek: string // "YYYY-MM-DD" — always a Sunday
  status: Status
  isCustom: boolean
  dependsOn?: TaskDependency | null
  subtasks: Subtask[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  authorName: string
  text: string
  createdAt: string
}

export interface Profile {
  id: string
  name: string
  planId: string | null
  isFirstBaby: boolean | null
  isWorking: boolean | null
}

export interface Plan {
  id: string
  dueDate: string
  babyShowerDate: string | null
  babyName: string | null
  babySex: BabySex | null
  hoursPerWeek: number
  onboardingComplete: boolean
  // Library task ids the user marked "already done" or "skip" during onboarding — never re-suggest these.
  excludedLibraryTaskIds: string[]
}
