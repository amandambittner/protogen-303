<script setup lang="ts">
withDefaults(
  defineProps<{
    pct: number
    color?: string
  }>(),
  { color: '#44A87C' }
)
</script>

<template>
  <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
    <div
      class="h-full rounded-full transition-all"
      :style="{ width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: color }"
    />
  </div>
</template>
