import { defineStore } from 'pinia'
import { usePlanStore } from './plan'
import { useAuthStore } from './auth'
import { categories } from '../data/categories'
import { computeTargetWeek, toWeekKey } from '../lib/schedule'
import type { Task, Comment, Status, Category, DependencyEvent, Subtask } from '../data/types'

const STORAGE_KEY = 'nest_tasks'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const tasks = raw ? JSON.parse(raw) : []
    // Backfill fields added after some tasks were already persisted.
    return tasks.map((t: Task) => ({ ...t, subtasks: t.subtasks ?? [] }))
  } catch {
    return []
  }
}

function persist(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: loadTasks() as Task[],
    loading: false,
  }),
  getters: {
    tasksByWeek(state): Record<string, Task[]> {
      return state.tasks.reduce<Record<string, Task[]>>((acc, task) => {
        const key = task.scheduledWeek
        if (!acc[key]) acc[key] = []
        acc[key].push(task)
        return acc
      }, {})
    },
    overdueTasks(state): Task[] {
      const planStore = usePlanStore()
      return state.tasks
        .filter((t) => t.status !== 'done' && t.scheduledWeek < planStore.currentWeekKey)
        .sort((a, b) => a.scheduledWeek.localeCompare(b.scheduledWeek))
    },
    completionPct(state): number {
      if (state.tasks.length === 0) return 0
      const done = state.tasks.filter((t) => t.status === 'done').length
      return Math.round((done / state.tasks.length) * 100)
    },
    categoryStats(state): Record<Category, { done: number; total: number }> {
      const stats = categories.reduce(
        (acc, c) => ({ ...acc, [c.key]: { done: 0, total: 0 } }),
        {} as Record<Category, { done: number; total: number }>
      )
      for (const task of state.tasks) {
        stats[task.category].total += 1
        if (task.status === 'done') stats[task.category].done += 1
      }
      return stats
    },
  },
  actions: {
    addTask(task: Partial<Task>) {
      const planStore = usePlanStore()
      if (!planStore.plan) throw new Error('No active plan')

      if (task.libraryTaskId && this.tasks.some((t) => t.libraryTaskId === task.libraryTaskId)) {
        return
      }

      const now = new Date().toISOString()
      const newTask: Task = {
        id: crypto.randomUUID(),
        planId: planStore.plan.id,
        libraryTaskId: task.libraryTaskId ?? null,
        title: task.title ?? '',
        description: task.description ?? '',
        category: task.category!,
        priority: task.priority ?? 'medium',
        estimatedHours: task.estimatedHours ?? 1,
        suggestedWeeksBeforeDue: task.suggestedWeeksBeforeDue ?? 0,
        scheduledWeek: task.scheduledWeek ?? planStore.currentWeekKey,
        status: task.status ?? 'pending',
        isCustom: task.isCustom ?? false,
        dependsOn: task.dependsOn ?? null,
        subtasks: task.subtasks ?? [],
        comments: [],
        createdAt: now,
        updatedAt: now,
      }
      this.tasks.push(newTask)
      persist(this.tasks)
      return newTask
    },

    addTasksBatch(tasks: Partial<Task>[]) {
      for (const task of tasks) this.addTask(task)
    },

    updateStatus(taskId: string, status: Status) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (!task) return
      task.status = status
      task.updatedAt = new Date().toISOString()
      persist(this.tasks)
    },

    updateTaskDetails(taskId: string, updates: Partial<Pick<Task, 'title' | 'description'>>) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (!task || !updates.title?.trim()) return
      task.title = updates.title.trim()
      task.description = updates.description?.trim() ?? task.description
      task.updatedAt = new Date().toISOString()
      persist(this.tasks)
    },

    rescheduleTask(taskId: string, scheduledWeek: string) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (!task) return
      task.scheduledWeek = scheduledWeek
      task.updatedAt = new Date().toISOString()
      persist(this.tasks)
    },

    /** Recomputes scheduled weeks for tasks waiting on an event (e.g. once a baby shower date is known). */
    rescheduleForDependency(event: DependencyEvent) {
      const planStore = usePlanStore()
      if (!planStore.plan) return
      for (const task of this.tasks) {
        if (task.dependsOn?.event !== event) continue
        const target = computeTargetWeek(task, planStore.plan.dueDate, planStore.plan.babyShowerDate)
        task.scheduledWeek = toWeekKey(target)
        task.updatedAt = new Date().toISOString()
      }
      persist(this.tasks)
    },

    addSubtask(taskId: string, title: string) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (!task || !title.trim()) return

      const subtask: Subtask = { id: crypto.randomUUID(), title: title.trim(), done: false }
      task.subtasks.push(subtask)
      task.updatedAt = new Date().toISOString()
      persist(this.tasks)
    },

    toggleSubtask(taskId: string, subtaskId: string) {
      const task = this.tasks.find((t) => t.id === taskId)
      const subtask = task?.subtasks.find((s) => s.id === subtaskId)
      if (!task || !subtask) return
      subtask.done = !subtask.done
      task.updatedAt = new Date().toISOString()
      persist(this.tasks)
    },

    deleteSubtask(taskId: string, subtaskId: string) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (!task) return
      task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId)
      task.updatedAt = new Date().toISOString()
      persist(this.tasks)
    },

    addComment(taskId: string, authorId: string, text: string) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (!task) return

      const auth = useAuthStore()
      const authorName = authorId === auth.profile?.id ? auth.profile.name : ''

      const comment: Comment = {
        id: crypto.randomUUID(),
        taskId,
        authorId,
        authorName,
        text,
        createdAt: new Date().toISOString(),
      }
      task.comments.push(comment)
      persist(this.tasks)
    },

    deleteTask(taskId: string) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId)
      persist(this.tasks)
    },

    reset() {
      this.tasks = []
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
