<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const dueDate = defineModel<string>('dueDate', { required: true })
const babyShowerDate = defineModel<string>('babyShowerDate', { required: true })

const countdown = computed(() => {
  if (!dueDate.value) return null
  const days = dayjs(dueDate.value).startOf('day').diff(dayjs().startOf('day'), 'day')
  if (days < 0) return null
  return { weeks: Math.floor(days / 7), days: days % 7 }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-primary">When's baby due?</h1>
    <p class="mt-2 text-sm text-gray-500">We'll use this to build your personalized schedule.</p>

    <label class="mt-8 block text-sm font-medium text-gray-700" for="due-date">Due date</label>
    <input
      id="due-date"
      v-model="dueDate"
      type="date"
      class="mt-1 w-full min-h-[44px] rounded-xl border border-gray-200 px-3 text-base focus:border-primary focus:outline-none"
    />

    <div v-if="countdown" class="mt-6 rounded-2xl border border-sage-100 bg-white p-4 text-center shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-400">That's</p>
      <p class="mt-1 text-2xl font-bold text-primary">
        {{ countdown.weeks }}<span class="text-base font-medium text-gray-500"> weeks</span>
        <span v-if="countdown.days > 0" class="ml-2">
          {{ countdown.days }}<span class="text-base font-medium text-gray-500"> days</span>
        </span>
      </p>
      <p class="text-xs text-gray-400">away</p>
    </div>

    <label class="mt-6 block text-sm font-medium text-gray-700" for="shower-date">
      Baby shower date <span class="font-normal text-gray-400">(optional)</span>
    </label>
    <p class="mt-1 text-xs text-gray-400">
      Some tasks — like setting up gifted gear — depend on this, so we'll schedule them after.
    </p>
    <input
      id="shower-date"
      v-model="babyShowerDate"
      type="date"
      class="mt-1 w-full min-h-[44px] rounded-xl border border-gray-200 px-3 text-base focus:border-primary focus:outline-none"
    />
  </div>
</template>
