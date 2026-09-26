<script setup lang="ts">
import { computed } from 'vue'
import { usePlanStore } from '../stores/plan'
import { useTasksStore } from '../stores/tasks'
import { categories } from '../data/categories'
import ProgressRing from '../components/shared/ProgressRing.vue'
import LinearBar from '../components/shared/LinearBar.vue'

const planStore = usePlanStore()
const tasksStore = useTasksStore()

const doneCount = computed(() => tasksStore.tasks.filter((t) => t.status === 'done').length)
const totalCount = computed(() => tasksStore.tasks.length)

const categoryBreakdown = computed(() =>
  categories.map((c) => ({
    ...c,
    ...tasksStore.categoryStats[c.key],
  }))
)
</script>

<template>
  <div class="mx-auto max-w-[480px] px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-primary">Progress</h1>

    <div class="mt-6 flex flex-col items-center rounded-2xl border border-sage-100 bg-gradient-to-b from-sage-50 to-white p-6 shadow-sm">
      <ProgressRing :pct="tasksStore.completionPct" />
      <p class="mt-3 text-sm text-gray-500">{{ doneCount }} of {{ totalCount }} tasks complete</p>
      <p class="text-xs text-gray-400">{{ planStore.weeksUntilDue }}w {{ planStore.extraDays }}d until due date</p>
      <p v-if="tasksStore.completionPct === 100" class="mt-2 text-sm font-semibold text-success">
        🎉 Everything's done — you're ready!
      </p>
    </div>

    <h2 class="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">By category</h2>
    <div class="space-y-3">
      <div
        v-for="c in categoryBreakdown"
        :key="c.key"
        class="rounded-2xl border border-sage-100 bg-white p-4 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full"
              :style="{ backgroundColor: `${c.color}1F` }"
            >
              <component :is="c.icon" :size="18" :style="{ color: c.color }" />
            </span>
            {{ c.label }}
          </span>
          <span class="text-sm font-medium text-gray-400">{{ c.done }}/{{ c.total }}</span>
        </div>
        <div class="mt-3">
          <LinearBar :pct="c.total ? (c.done / c.total) * 100 : 0" :color="c.color" />
        </div>
        <p v-if="c.total > 0 && c.done === c.total" class="mt-2 text-xs font-semibold" :style="{ color: c.color }">
          ✓ Category complete
        </p>
      </div>
    </div>
  </div>
</template>
