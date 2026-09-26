<script setup lang="ts">
import { LayoutGrid } from 'lucide-vue-next'
import { categories } from '../../data/categories'
import type { Category } from '../../data/types'

const modelValue = defineModel<Category | 'all'>({ required: true })
const props = defineProps<{ counts?: Partial<Record<Category, number>>; total?: number }>()
</script>

<template>
  <div class="flex gap-2.5 overflow-x-auto pb-1">
    <button
      type="button"
      class="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors"
      :class="
        modelValue === 'all'
          ? 'border-primary bg-primary text-white shadow-sm'
          : 'border-sage-200 bg-white text-gray-600'
      "
      @click="modelValue = 'all'"
    >
      <LayoutGrid :size="16" />
      All
      <span
        class="rounded-full px-1.5 text-xs font-semibold"
        :class="modelValue === 'all' ? 'bg-white/20' : 'bg-gray-100 text-gray-500'"
      >
        {{ props.total ?? 0 }}
      </span>
    </button>
    <button
      v-for="c in categories"
      :key="c.key"
      type="button"
      class="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors"
      :class="modelValue === c.key ? 'text-white shadow-sm' : 'border-sage-200 bg-white text-gray-600'"
      :style="modelValue === c.key ? { backgroundColor: c.color, borderColor: c.color } : {}"
      @click="modelValue = c.key"
    >
      <component :is="c.icon" :size="16" :style="modelValue === c.key ? {} : { color: c.color }" />
      {{ c.label }}
      <span
        class="rounded-full px-1.5 text-xs font-semibold"
        :class="modelValue === c.key ? 'bg-white/20' : 'bg-gray-100 text-gray-500'"
      >
        {{ props.counts?.[c.key] ?? 0 }}
      </span>
    </button>
  </div>
</template>
