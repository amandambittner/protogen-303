<script setup lang="ts">
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task } from '../../data/types'

const props = defineProps<{ tasks: Task[]; overdue?: boolean }>()

// Active work floats to the top, completed tasks sink to the bottom.
const statusWeight: Record<Task['status'], number> = { in_progress: 0, pending: 1, done: 2 }
const sortedTasks = computed(() => [...props.tasks].sort((a, b) => statusWeight[a.status] - statusWeight[b.status]))
</script>

<template>
  <div class="space-y-3">
    <TaskCard v-for="task in sortedTasks" :key="task.id" :task="task" :overdue="overdue" />
    <p v-if="!tasks.length" class="py-6 text-center text-sm text-gray-400">No tasks here yet.</p>
  </div>
</template>
