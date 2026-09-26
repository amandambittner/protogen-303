<script setup lang="ts">
import { computed } from 'vue'
import { categoryMap } from '../../data/categories'
import type { Category } from '../../data/types'

const props = defineProps<{ category: Category }>()
const config = computed(() => categoryMap[props.category])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 text-xs font-semibold"
    :style="{ backgroundColor: `${config.color}1F`, color: config.color }"
  >
    <span
      class="flex h-5 w-5 items-center justify-center rounded-full"
      :style="{ backgroundColor: config.color }"
    >
      <component :is="config.icon" :size="12" class="text-white" />
    </span>
    {{ config.label }}
  </span>
</template>
