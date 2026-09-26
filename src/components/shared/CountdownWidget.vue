<script setup lang="ts">
import { Sprout } from 'lucide-vue-next'

defineProps<{
  weeks: number
  days: number
  babyName?: string | null
}>()
</script>

<template>
  <div
    class="flex items-center gap-4 rounded-2xl border border-sage-100 bg-gradient-to-br from-primary to-sage-500 p-5 text-white shadow-sm"
  >
    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
      <Sprout :size="24" />
    </span>
    <div>
      <p class="text-xs font-medium uppercase tracking-wide text-white/70">
        {{ babyName ? 'Until we meet' : 'Due date countdown' }}
      </p>
      <p class="mt-0.5 text-2xl font-bold leading-none">
        {{ weeks }}<span class="text-base font-medium text-white/80"> weeks</span>
        <span v-if="days > 0" class="ml-2">{{ days }}<span class="text-base font-medium text-white/80"> days</span></span>
      </p>
      <p v-if="babyName" class="-mb-1 mt-1 font-cute text-3xl leading-none text-white">{{ babyName }}</p>
    </div>
  </div>
</template>
