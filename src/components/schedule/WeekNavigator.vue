<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePlanStore } from '../../stores/plan'

const weekKey = defineModel<string>({ required: true })
const planStore = usePlanStore()

const label = computed(() => {
  if (weekKey.value === planStore.currentWeekKey) return 'This week'
  const start = dayjs(weekKey.value)
  return `${start.format('MMM D')} – ${start.add(6, 'day').format('MMM D')}`
})

function shift(days: number) {
  weekKey.value = dayjs(weekKey.value).add(days, 'day').format('YYYY-MM-DD')
}
</script>

<template>
  <div class="flex items-center justify-between">
    <button type="button" class="flex min-h-[44px] min-w-[44px] items-center justify-center" @click="shift(-7)">
      <ChevronLeft :size="20" />
    </button>
    <span class="text-sm font-semibold text-primary">{{ label }}</span>
    <button type="button" class="flex min-h-[44px] min-w-[44px] items-center justify-center" @click="shift(7)">
      <ChevronRight :size="20" />
    </button>
  </div>
</template>
