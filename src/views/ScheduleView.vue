<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { usePlanStore } from '../stores/plan'
import { useTasksStore } from '../stores/tasks'
import WeekNavigator from '../components/schedule/WeekNavigator.vue'
import WeekSummaryRow from '../components/schedule/WeekSummaryRow.vue'
import WeekTaskList from '../components/schedule/WeekTaskList.vue'

const planStore = usePlanStore()
const tasksStore = useTasksStore()

const selectedWeek = ref(planStore.currentWeekKey)

const selectedWeekTasks = computed(() => tasksStore.tasksByWeek[selectedWeek.value] ?? [])

const upcomingWeeks = computed(() => {
  const weeks: string[] = []
  for (let i = 1; i <= 6; i++) {
    weeks.push(dayjs(planStore.currentWeekKey).add(i * 7, 'day').format('YYYY-MM-DD'))
  }
  return weeks
})

function jumpTo(weekKey: string) {
  selectedWeek.value = weekKey
}
</script>

<template>
  <div class="mx-auto max-w-[480px] px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-primary">Schedule</h1>

    <div class="mt-4 rounded-2xl border border-sage-100 bg-white p-4 shadow-sm">
      <WeekNavigator v-model="selectedWeek" />
    </div>

    <div class="mt-4">
      <WeekTaskList :tasks="selectedWeekTasks" />
    </div>

    <h2 class="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">Upcoming weeks</h2>
    <div class="space-y-2">
      <WeekSummaryRow
        v-for="week in upcomingWeeks"
        :key="week"
        :week-key="week"
        :tasks="tasksStore.tasksByWeek[week] ?? []"
        @select="jumpTo"
      />
    </div>
  </div>
</template>
