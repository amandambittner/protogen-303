<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import LinearBar from '../shared/LinearBar.vue'
import type { Task } from '../../data/types'

const props = defineProps<{ weekKey: string; tasks: Task[] }>()
const emit = defineEmits<{ (e: 'select', weekKey: string): void }>()

const label = computed(() => dayjs(props.weekKey).format('MMM D'))
const doneCount = computed(() => props.tasks.filter((t) => t.status === 'done').length)
const pct = computed(() => (props.tasks.length ? Math.round((doneCount.value / props.tasks.length) * 100) : 0))
</script>

<template>
  <button
    type="button"
    class="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-2xl border border-sage-100 bg-white px-4 py-3 text-left shadow-sm"
    @click="emit('select', weekKey)"
  >
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-gray-700">Week of {{ label }}</p>
      <div class="mt-1.5">
        <LinearBar :pct="pct" />
      </div>
    </div>
    <span class="shrink-0 text-xs text-gray-400">{{ doneCount }}/{{ tasks.length }}</span>
  </button>
</template>
