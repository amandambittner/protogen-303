<script setup lang="ts">
import { computed } from 'vue'
import type { Status } from '../../data/types'

const props = defineProps<{ status: Status }>()

const config: Record<Status, { label: string; classes: string }> = {
  pending: { label: 'To do', classes: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'In progress', classes: 'bg-info/15 text-info' },
  done: { label: 'Done', classes: 'bg-success/15 text-success' },
}

const current = computed(() => config[props.status])
</script>

<template>
  <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="current.classes">
    {{ current.label }}
  </span>
</template>
