<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { CalendarCheck, CalendarDays, ListChecks, PieChart, Settings } from 'lucide-vue-next'

const route = useRoute()

const items = [
  { path: '/today', label: 'Today', icon: CalendarCheck },
  { path: '/schedule', label: 'Schedule', icon: CalendarDays },
  { path: '/tasks', label: 'Tasks', icon: ListChecks },
  { path: '/progress', label: 'Progress', icon: PieChart },
  { path: '/settings', label: 'Settings', icon: Settings },
]
</script>

<template>
  <nav
    class="z-20 flex shrink-0 justify-around border-t border-sage-100 bg-white/95 backdrop-blur"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <RouterLink
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      class="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium"
      :class="route.path === item.path ? 'text-primary' : 'text-gray-400'"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
        :class="route.path === item.path ? 'bg-sage-100' : ''"
      >
        <component :is="item.icon" :size="22" :stroke-width="route.path === item.path ? 2.4 : 2" />
      </span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
