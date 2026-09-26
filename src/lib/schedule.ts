import dayjs from 'dayjs'
import type { LibraryTask, Effort, Timing, Task, TaskDependency } from '../data/types'

/** Sunday of the week containing the given date, formatted as YYYY-MM-DD. */
export function getWeekStart(date: dayjs.Dayjs | Date | string): dayjs.Dayjs {
  const d = dayjs(date)
  return d.subtract(d.day(), 'day').startOf('day')
}

export function addDays(date: dayjs.Dayjs, days: number): dayjs.Dayjs {
  return date.add(days, 'day')
}

export function toWeekKey(date: dayjs.Dayjs): string {
  return date.format('YYYY-MM-DD')
}

type ScheduledTask = Pick<
  Task,
  | 'libraryTaskId'
  | 'title'
  | 'description'
  | 'category'
  | 'priority'
  | 'estimatedHours'
  | 'suggestedWeeksBeforeDue'
  | 'scheduledWeek'
  | 'status'
  | 'isCustom'
  | 'dependsOn'
>

const priorityOrder: Record<LibraryTask['priority'], number> = { high: 0, medium: 1, low: 2 }

/**
 * The ideal week to schedule a task in, based on its due-date offset or, if it
 * depends on an event (birth, baby shower), that event's date instead. Never
 * earlier than the current week — a task whose deadline has already passed
 * is simply due as soon as possible.
 */
export function computeTargetWeek(
  task: { suggestedWeeksBeforeDue: number; dependsOn?: TaskDependency | null },
  dueDate: string,
  babyShowerDate?: string | null
): dayjs.Dayjs {
  const due = getWeekStart(dueDate)
  const now = getWeekStart(dayjs())

  let target = due.subtract(task.suggestedWeeksBeforeDue, 'week')
  if (task.dependsOn?.event === 'birth') {
    target = due.add(task.dependsOn.offsetWeeks, 'week')
  } else if (task.dependsOn?.event === 'baby_shower' && babyShowerDate) {
    target = getWeekStart(babyShowerDate).add(task.dependsOn.offsetWeeks, 'week')
  }

  return target.isBefore(now) ? now : target
}

/**
 * Distributes selected library tasks across weeks. Each task gets an ideal
 * target week based on its due-date offset (or event dependency), then tasks
 * are packed in earliest-deadline-first order, spilling into later weeks
 * whenever a week's `hoursPerWeek` budget is exceeded.
 */
export function scheduleTasks(
  tasks: LibraryTask[],
  hoursPerWeek: number,
  dueDate: string,
  babyShowerDate?: string | null
): ScheduledTask[] {
  const withTargets = tasks
    .map((task) => ({ task, target: computeTargetWeek(task, dueDate, babyShowerDate) }))
    .sort((a, b) => {
      if (!a.target.isSame(b.target, 'day')) return a.target.valueOf() - b.target.valueOf()
      return priorityOrder[a.task.priority] - priorityOrder[b.task.priority]
    })

  const weekHours = new Map<string, number>()

  return withTargets.map(({ task, target }) => {
    const hours = task.estimatedHours ?? 1
    let week = target
    let key = toWeekKey(week)
    while ((weekHours.get(key) ?? 0) + hours > hoursPerWeek) {
      week = addDays(week, 7)
      key = toWeekKey(week)
    }
    weekHours.set(key, (weekHours.get(key) ?? 0) + hours)

    return {
      libraryTaskId: task.id,
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      suggestedWeeksBeforeDue: task.suggestedWeeksBeforeDue,
      scheduledWeek: key,
      status: 'pending',
      isCustom: false,
      dependsOn: task.dependsOn ?? null,
    }
  })
}

const effortToHours: Record<Effort, number> = {
  quick: 0.5,
  few_hours: 2,
  big_project: 5,
}

export function effortToEstimatedHours(effort: Effort): number {
  return effortToHours[effort]
}

/** Maps a custom task's chosen timing directly to a scheduled week. */
export function customTaskWeek(timing: Timing, weeksUntilDue: number): string {
  const offsets: Record<Timing, number> = {
    this_week: 0,
    this_month: 2,
    later: 6,
    near_due: Math.max(0, weeksUntilDue - 4),
  }
  return toWeekKey(addDays(getWeekStart(dayjs()), offsets[timing] * 7))
}
