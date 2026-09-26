<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import type { Task } from '../../data/types'

defineProps<{ tasks: Task[] }>()
</script>

<template>
  <div v-if="tasks.length" class="mb-4 flex items-center gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-3.5">
    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/15">
      <AlertTriangle :size="18" class="text-danger" />
    </span>
    <span class="text-sm font-semibold text-danger">
      {{ tasks.length }} overdue task{{ tasks.length === 1 ? '' : 's' }}
    </span>
  </div>
</template>
