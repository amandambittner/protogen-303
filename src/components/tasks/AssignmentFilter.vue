<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const modelValue = defineModel<'all' | 'mine' | 'shared'>({ required: true })

const options = [
  { value: 'all', label: 'Anyone' },
  { value: 'mine', label: 'Mine' },
  { value: 'shared', label: 'Shared' },
] as const
</script>

<template>
  <div class="relative flex-1">
    <select
      v-model="modelValue"
      class="min-h-[40px] w-full appearance-none rounded-xl border border-sage-200 bg-white pl-3 pr-8 text-sm font-medium text-gray-700 focus:border-primary focus:outline-none"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <ChevronDown :size="14" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>
</template>
