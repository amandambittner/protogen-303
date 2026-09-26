<script setup lang="ts">
defineProps<{
  step: number
  total: number
}>()
</script>

<template>
  <div class="flex justify-center gap-2">
    <span
      v-for="n in total"
      :key="n"
      class="h-1.5 w-6 rounded-full transition-colors"
      :class="n <= step ? 'bg-primary' : 'bg-gray-200'"
    />
  </div>
</template>
