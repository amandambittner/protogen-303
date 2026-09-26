<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import StatusFilter from '../components/tasks/StatusFilter.vue'
import CategoryFilter from '../components/tasks/CategoryFilter.vue'
import TaskList from '../components/tasks/TaskList.vue'
import type { Status, Category } from '../data/types'

const tasksStore = useTasksStore()

const statusFilter = ref<Status | 'all'>('all')
const categoryFilter = ref<Category | 'all'>('all')

const categoryCounts = computed(() => {
  const counts: Partial<Record<Category, number>> = {}
  for (const task of tasksStore.tasks) {
    counts[task.category] = (counts[task.category] ?? 0) + 1
  }
  return counts
})

const filteredTasks = computed(() =>
  tasksStore.tasks.filter((task) => {
    if (statusFilter.value !== 'all' && task.status !== statusFilter.value) return false
    if (categoryFilter.value !== 'all' && task.category !== categoryFilter.value) return false
    return true
  })
)
</script>

<template>
  <div class="mx-auto max-w-[480px] px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-primary">Tasks</h1>

    <div class="mt-4 space-y-2.5">
      <CategoryFilter v-model="categoryFilter" :counts="categoryCounts" :total="tasksStore.tasks.length" />
      <div class="flex gap-2">
        <StatusFilter v-model="statusFilter" />
      </div>
    </div>

    <div class="mt-5">
      <TaskList :tasks="filteredTasks" />
    </div>
  </div>
</template>
