import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { getWeekStart, toWeekKey } from '../lib/schedule'
import type { BabySex, Plan } from '../data/types'
import { useAuthStore } from './auth'

const STORAGE_KEY = 'nest_plan'
const PREGNANCY_LENGTH_WEEKS = 40

function loadPlan(): Plan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist(plan: Plan | null) {
  if (plan) localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  else localStorage.removeItem(STORAGE_KEY)
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plan: loadPlan() as Plan | null,
  }),
  getters: {
    daysUntilDue(state): number {
      if (!state.plan) return 0
      return dayjs(state.plan.dueDate).startOf('day').diff(dayjs().startOf('day'), 'day')
    },
    weeksUntilDue(): number {
      return Math.max(0, Math.floor(this.daysUntilDue / 7))
    },
    extraDays(): number {
      return Math.max(0, this.daysUntilDue % 7)
    },
    trimester(): 1 | 2 | 3 {
      const weeksPregnant = PREGNANCY_LENGTH_WEEKS - this.weeksUntilDue
      if (weeksPregnant < 14) return 1
      if (weeksPregnant < 28) return 2
      return 3
    },
    currentWeekKey(): string {
      return toWeekKey(getWeekStart(dayjs()))
    },
  },
  actions: {
    createPlan(
      dueDate: string,
      hoursPerWeek: number,
      options: {
        babyShowerDate?: string | null
        babyName?: string | null
        babySex?: BabySex | null
        excludedLibraryTaskIds?: string[]
      } = {}
    ) {
      const auth = useAuthStore()
      this.plan = {
        id: crypto.randomUUID(),
        dueDate,
        babyShowerDate: options.babyShowerDate ?? null,
        babyName: options.babyName ?? null,
        babySex: options.babySex ?? null,
        hoursPerWeek,
        onboardingComplete: false,
        excludedLibraryTaskIds: options.excludedLibraryTaskIds ?? [],
      }
      persist(this.plan)

      if (auth.profile) {
        auth.updateProfile({ planId: this.plan.id })
      }
      return this.plan
    },

    updatePlan(
      updates: Partial<
        Pick<
          Plan,
          | 'dueDate'
          | 'babyShowerDate'
          | 'babyName'
          | 'babySex'
          | 'hoursPerWeek'
          | 'onboardingComplete'
          | 'excludedLibraryTaskIds'
        >
      >
    ) {
      if (!this.plan) return
      this.plan = { ...this.plan, ...updates }
      persist(this.plan)
    },

    reset() {
      this.plan = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
