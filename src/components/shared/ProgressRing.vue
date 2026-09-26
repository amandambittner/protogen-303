<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    pct: number
    size?: number
    strokeWidth?: number
  }>(),
  { size: 120, strokeWidth: 10 }
)

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - props.pct / 100))
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="none"
      stroke="#E5E7EB"
      :stroke-width="strokeWidth"
    />
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="none"
      stroke="#44A87C"
      stroke-linecap="round"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      :transform="`rotate(-90 ${size / 2} ${size / 2})`"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      class="fill-primary text-2xl font-bold"
    >
      {{ pct }}%
    </text>
  </svg>
</template>
