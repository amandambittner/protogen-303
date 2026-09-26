<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { usePlanStore } from '../stores/plan'
import { useTasksStore } from '../stores/tasks'
import CountdownWidget from '../components/shared/CountdownWidget.vue'
import OverdueAlert from '../components/tasks/OverdueAlert.vue'
import TaskList from '../components/tasks/TaskList.vue'
import CategoryBadge from '../components/shared/CategoryBadge.vue'
import tasksLibrary from '../data/tasks.json'
import type { LibraryTask } from '../data/types'

const library = tasksLibrary.tasks as LibraryTask[]
const QUICK_WIN_MAX_HOURS = 1
const QUICK_WIN_LIMIT = 5

const planStore = usePlanStore()
const tasksStore = useTasksStore()

const thisWeekTasks = computed(() => tasksStore.tasksByWeek[planStore.currentWeekKey] ?? [])

const quickWinTasks = computed(() => {
  const addedLibraryIds = new Set(tasksStore.tasks.map((t) => t.libraryTaskId).filter(Boolean))
  const excludedLibraryIds = new Set(planStore.plan?.excludedLibraryTaskIds ?? [])
  return library
    .filter(
      (task) =>
        task.estimatedHours <= QUICK_WIN_MAX_HOURS &&
        !addedLibraryIds.has(task.id) &&
        !excludedLibraryIds.has(task.id)
    )
    .slice(0, QUICK_WIN_LIMIT)
})

async function addQuickWin(task: LibraryTask) {
  await tasksStore.addTask({
    libraryTaskId: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
    estimatedHours: task.estimatedHours,
    suggestedWeeksBeforeDue: task.suggestedWeeksBeforeDue,
    scheduledWeek: planStore.currentWeekKey,
    status: 'pending',
    isCustom: false,
  })
}
</script>

<template>
  <div class="mx-auto max-w-[480px] px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-primary">Today</h1>

    <div class="mt-4">
      <CountdownWidget
        :weeks="planStore.weeksUntilDue"
        :days="planStore.extraDays"
        :baby-name="planStore.plan?.babyName"
      />
    </div>

    <div class="mt-6">
      <OverdueAlert :tasks="tasksStore.overdueTasks" />
      <TaskList v-if="tasksStore.overdueTasks.length" :tasks="tasksStore.overdueTasks" overdue />
    </div>

    <div class="mt-6">
      <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">This week</h2>
      <TaskList :tasks="thisWeekTasks" />
    </div>

    <div class="mt-6">
      <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Quick wins</h2>
      <div v-if="quickWinTasks.length" class="space-y-2">
        <div
          v-for="task in quickWinTasks"
          :key="task.id"
          class="flex items-center justify-between gap-3 rounded-2xl border border-sage-100 bg-white px-4 py-3 shadow-sm"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-800">{{ task.title }}</p>
            <div class="mt-1">
              <CategoryBadge :category="task.category" />
            </div>
          </div>
          <button
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
            @click="addQuickWin(task)"
          >
            <Plus :size="18" />
          </button>
        </div>
      </div>
      <p v-else class="rounded-2xl border border-sage-100 bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
        You've added all our quick-win suggestions — nice work.
      </p>
    </div>
  </div>
</template>
