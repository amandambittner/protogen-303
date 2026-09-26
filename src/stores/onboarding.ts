import { defineStore } from 'pinia'
import tasksLibrary from '../data/tasks.json'
import { scheduleTasks } from '../lib/schedule'
import { useTasksStore } from './tasks'
import { usePlanStore } from './plan'
import type { BabySex, LibraryTask, TaskState, Profile } from '../data/types'

const library = tasksLibrary.tasks as LibraryTask[]

// Educational tasks most useful for first-time parents.
const FIRST_BABY_TASK_IDS = new Set(['med_05', 'med_06', 'med_07', 'med_09'])

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    step: 1,
    taskSelections: {} as Record<string, TaskState>,
    babyName: '',
    babySex: null as BabySex | null,
  }),
  getters: {
    selectedTasks(state): LibraryTask[] {
      return library.filter((task) => state.taskSelections[task.id] === 'add')
    },
    selectionCount(): number {
      return this.selectedTasks.length
    },
  },
  actions: {
    setStep(n: number) {
      this.step = n
    },
    setTaskState(id: string, state: TaskState) {
      this.taskSelections[id] = state
    },
    applyProfileDefaults(profile: Pick<Profile, 'isFirstBaby'>) {
      for (const task of library) {
        if (this.taskSelections[task.id]) continue
        let state: TaskState = 'add'
        if (profile.isFirstBaby === false && FIRST_BABY_TASK_IDS.has(task.id)) {
          state = 'skip'
        }
        this.taskSelections[task.id] = state
      }
    },
    async finishOnboarding(hoursPerWeek: number) {
      const planStore = usePlanStore()
      const tasksStore = useTasksStore()
      if (!planStore.plan) throw new Error('No active plan')

      const scheduled = scheduleTasks(
        this.selectedTasks,
        hoursPerWeek,
        planStore.plan.dueDate,
        planStore.plan.babyShowerDate
      )
      await tasksStore.addTasksBatch(scheduled)
      await planStore.updatePlan({ hoursPerWeek, onboardingComplete: true })
    },
  },
})
