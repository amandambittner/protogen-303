<script setup lang="ts">
import { computed } from 'vue'
import { TriangleAlert, CircleCheck } from 'lucide-vue-next'

const hoursPerWeek = defineModel<number>('hoursPerWeek', { required: true })

const props = defineProps<{ taskCount: number; totalHours: number; weeksUntilDue: number }>()

const recommendedHoursPerWeek = computed(() => {
  const weeks = Math.max(props.weeksUntilDue, 1)
  return Math.min(15, Math.max(1, Math.ceil(props.totalHours / weeks)))
})

const weeksNeededAtCurrentPace = computed(() => Math.ceil(props.totalHours / Math.max(hoursPerWeek.value, 0.5)))

const isBehindPace = computed(() => weeksNeededAtCurrentPace.value > props.weeksUntilDue)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-primary">How much time each week?</h1>
    <p class="mt-2 text-sm text-gray-500">
      We'll spread your {{ taskCount }} tasks ({{ totalHours }}h total) out so you never feel overwhelmed in a single
      week.
    </p>

    <div class="mt-8">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Hours per week</span>
        <span class="text-lg font-bold text-primary">{{ hoursPerWeek }}h</span>
      </div>
      <input
        v-model.number="hoursPerWeek"
        type="range"
        min="1"
        max="15"
        step="1"
        class="mt-2 w-full accent-primary"
      />
    </div>

    <div class="mt-3 flex items-center justify-between gap-3 rounded-xl bg-sage-50 px-3 py-2 text-xs text-gray-500">
      <span>Recommended: <strong class="text-gray-700">{{ recommendedHoursPerWeek }}h/week</strong> to finish by your due date</span>
      <button
        v-if="hoursPerWeek !== recommendedHoursPerWeek"
        type="button"
        class="shrink-0 font-semibold text-primary"
        @click="hoursPerWeek = recommendedHoursPerWeek"
      >
        Use this
      </button>
    </div>

    <div
      v-if="isBehindPace"
      class="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700"
    >
      <TriangleAlert :size="14" class="mt-0.5 shrink-0" />
      <span>
        At {{ hoursPerWeek }}h/week, it'll take about {{ weeksNeededAtCurrentPace }} weeks to get through everything
        — roughly {{ weeksNeededAtCurrentPace - weeksUntilDue }} week{{ weeksNeededAtCurrentPace - weeksUntilDue === 1 ? '' : 's' }}
        past your due date.
      </span>
    </div>

    <div
      v-else
      class="mt-3 flex items-start gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs text-gray-600"
    >
      <CircleCheck :size="14" class="mt-0.5 shrink-0 text-primary" />
      <span>At {{ hoursPerWeek }}h/week, your plan will spread out gradually so you always know what's next.</span>
    </div>
  </div>
</template>
