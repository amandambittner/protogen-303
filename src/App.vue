<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import BottomNav from './components/shared/BottomNav.vue'
import AddTaskModal from './components/tasks/AddTaskModal.vue'
import { usePlanStore } from './stores/plan'
import { useTasksStore } from './stores/tasks'
import { useOnboardingStore } from './stores/onboarding'
import { effortToEstimatedHours, customTaskWeek } from './lib/schedule'
import type { Category, Effort, Timing } from './data/types'

const route = useRoute()
const planStore = usePlanStore()
const tasksStore = useTasksStore()
const onboarding = useOnboardingStore()

const modalOpen = ref(false)

// Once a plan exists it drives the palette; while still onboarding, live-preview the in-progress pick.
const theme = computed(() => {
  const sex = planStore.plan ? planStore.plan.babySex : onboarding.babySex
  return sex === 'boy' || sex === 'girl' ? sex : null
})

watch(
  theme,
  (value) => {
    if (value) document.documentElement.dataset.theme = value
    else delete document.documentElement.dataset.theme
  },
  { immediate: true }
)

async function handleAddTask(payload: { title: string; category: Category; effort: Effort; timing: Timing }) {
  await tasksStore.addTask({
    libraryTaskId: null,
    title: payload.title,
    description: '',
    category: payload.category,
    priority: 'medium',
    estimatedHours: effortToEstimatedHours(payload.effort),
    scheduledWeek: customTaskWeek(payload.timing, planStore.weeksUntilDue),
    status: 'pending',
    isCustom: true,
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-8">
    <!-- The transform creates a containing block so fixed-position children (modal, sticky bars) stay within this shell. -->
    <div
      class="relative flex h-screen w-full max-w-[480px] flex-col overflow-hidden bg-sage-50 [transform:translateZ(0)] sm:h-[860px] sm:rounded-[2.5rem] sm:border sm:border-gray-300 sm:shadow-2xl"
    >
      <div class="flex-1 overflow-y-auto overscroll-contain">
        <RouterView />
      </div>
      <BottomNav v-if="!route.meta.hideNav" />
      <button
        v-if="!route.meta.hideNav"
        type="button"
        class="absolute bottom-20 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg"
        @click="modalOpen = true"
      >
        <Plus :size="24" />
      </button>
      <AddTaskModal :open="modalOpen" @close="modalOpen = false" @submit="handleAddTask" />
    </div>
  </div>
</template>
