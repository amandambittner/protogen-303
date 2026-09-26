<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { categories } from '../../data/categories'
import type { Category, Effort, Timing } from '../../data/types'

defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { title: string; category: Category; effort: Effort; timing: Timing }): void
}>()

const title = ref('')
const category = ref<Category>('medical')
const effort = ref<Effort>('quick')
const timing = ref<Timing>('this_month')

const effortOptions: { value: Effort; label: string }[] = [
  { value: 'quick', label: 'Quick' },
  { value: 'few_hours', label: 'A few hours' },
  { value: 'big_project', label: 'Big project' },
]

const timingOptions: { value: Timing; label: string }[] = [
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'later', label: 'Later' },
  { value: 'near_due', label: 'Closer to due date' },
]

function handleSubmit() {
  if (!title.value.trim()) return
  emit('submit', {
    title: title.value.trim(),
    category: category.value,
    effort: effort.value,
    timing: timing.value,
  })
  title.value = ''
  category.value = 'medical'
  effort.value = 'quick'
  timing.value = 'this_month'
  emit('close')
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-30 flex items-end justify-center bg-black/40" @click.self="emit('close')">
    <div class="w-full max-w-[480px] rounded-t-2xl bg-white p-5 pb-8">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-primary">Add a task</h2>
        <button type="button" class="min-h-[44px] min-w-[44px]" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="text-sm font-medium text-gray-700" for="task-title">Title</label>
          <input
            id="task-title"
            v-model="title"
            type="text"
            required
            maxlength="55"
            placeholder="e.g. Pick a hospital pediatrician"
            class="mt-1 w-full min-h-[44px] rounded-xl border border-gray-200 px-3 text-base focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700" for="task-category">Category</label>
          <select
            id="task-category"
            v-model="category"
            class="mt-1 w-full min-h-[44px] rounded-xl border border-gray-200 px-3 text-base focus:border-primary focus:outline-none"
          >
            <option v-for="c in categories" :key="c.key" :value="c.key">{{ c.label }}</option>
          </select>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-700">How much effort?</p>
          <div class="mt-1 flex flex-wrap gap-2">
            <button
              v-for="opt in effortOptions"
              :key="opt.value"
              type="button"
              class="min-h-[36px] rounded-full border px-3 text-sm font-medium"
              :class="effort === opt.value ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600'"
              @click="effort = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-700">When?</p>
          <div class="mt-1 flex flex-wrap gap-2">
            <button
              v-for="opt in timingOptions"
              :key="opt.value"
              type="button"
              class="min-h-[36px] rounded-full border px-3 text-sm font-medium"
              :class="timing === opt.value ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600'"
              @click="timing = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="min-h-[44px] w-full rounded-xl bg-primary text-sm font-semibold text-white"
        >
          Add task
        </button>
      </form>
    </div>
  </div>
</template>
