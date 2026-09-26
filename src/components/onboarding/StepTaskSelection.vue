<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Plus } from 'lucide-vue-next'
import tasksLibrary from '../../data/tasks.json'
import { categories } from '../../data/categories'
import { useOnboardingStore } from '../../stores/onboarding'
import CategoryBadge from '../shared/CategoryBadge.vue'
import AddTaskModal from '../tasks/AddTaskModal.vue'
import type { LibraryTask, Category, Effort, Timing } from '../../data/types'

const library = tasksLibrary.tasks as LibraryTask[]
const onboarding = useOnboardingStore()

const customTasks = defineModel<{ title: string; category: Category; effort: Effort; timing: Timing }[]>(
  'customTasks',
  { required: true }
)

const expanded = ref<Record<Category, boolean>>(
  categories.reduce((acc, c) => ({ ...acc, [c.key]: true }), {} as Record<Category, boolean>)
)

const modalOpen = ref(false)

const tasksByCategory = computed(() =>
  categories.map((c) => ({
    ...c,
    tasks: library.filter((t) => t.category === c.key),
  }))
)

function toggle(category: Category) {
  expanded.value[category] = !expanded.value[category]
}

function handleAddCustom(payload: { title: string; category: Category; effort: Effort; timing: Timing }) {
  customTasks.value = [...customTasks.value, payload]
}
</script>

<template>
  <div class="pb-20">
    <h1 class="text-2xl font-bold text-primary">Build your task list</h1>
    <p class="mt-2 text-sm text-gray-500">
      We've pre-selected everything. Mark anything you've already done or want to skip.
    </p>

    <div class="mt-6 space-y-4">
      <div v-for="group in tasksByCategory" :key="group.key" class="rounded-2xl border border-sage-100 bg-white shadow-sm">
        <button
          type="button"
          class="flex w-full min-h-[44px] items-center justify-between px-4 py-3"
          @click="toggle(group.key)"
        >
          <span class="flex items-center gap-2">
            <CategoryBadge :category="group.key" />
            <span class="rounded-full bg-gray-100 px-1.5 text-xs font-semibold text-gray-500">
              {{ group.tasks.length }}
            </span>
          </span>
          <ChevronDown
            :size="18"
            class="text-gray-400 transition-transform"
            :class="{ 'rotate-180': !expanded[group.key] }"
          />
        </button>

        <div v-if="expanded[group.key]" class="divide-y divide-gray-50 border-t border-gray-50">
          <div v-for="task in group.tasks" :key="task.id" class="flex items-center justify-between gap-2 px-4 py-3">
            <span class="text-sm text-gray-700">{{ task.title }}</span>
            <div class="inline-flex shrink-0 rounded-full border border-gray-200 bg-gray-50 p-0.5">
              <button
                type="button"
                class="min-h-[32px] rounded-full px-2.5 text-xs font-medium"
                :class="onboarding.taskSelections[task.id] === 'add' ? 'bg-primary text-white' : 'text-gray-500'"
                @click="onboarding.setTaskState(task.id, 'add')"
              >
                Add
              </button>
              <button
                type="button"
                class="min-h-[32px] rounded-full px-2.5 text-xs font-medium"
                :class="onboarding.taskSelections[task.id] === 'done' ? 'bg-success text-white' : 'text-gray-500'"
                @click="onboarding.setTaskState(task.id, 'done')"
              >
                Done
              </button>
              <button
                type="button"
                class="min-h-[32px] rounded-full px-2.5 text-xs font-medium"
                :class="onboarding.taskSelections[task.id] === 'skip' ? 'bg-gray-400 text-white' : 'text-gray-500'"
                @click="onboarding.setTaskState(task.id, 'skip')"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-500"
      @click="modalOpen = true"
    >
      <Plus :size="16" /> Add your own
    </button>

    <div
      class="fixed bottom-0 left-0 right-0 z-10 mx-auto max-w-[480px] border-t border-gray-100 bg-white/95 px-4 py-3 text-center text-sm font-medium text-primary backdrop-blur"
    >
      Adding {{ onboarding.selectionCount + customTasks.length }} tasks to your plan
    </div>

    <AddTaskModal :open="modalOpen" @close="modalOpen = false" @submit="handleAddCustom" />
  </div>
</template>
