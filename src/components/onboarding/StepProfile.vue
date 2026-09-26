<script setup lang="ts">
import { computed } from 'vue'
import type { BabySex } from '../../data/types'

const isFirstBaby = defineModel<boolean | null>('isFirstBaby', { required: true })
const isWorking = defineModel<boolean | null>('isWorking', { required: true })
const babyName = defineModel<string>('babyName', { required: true })
const babySex = defineModel<BabySex | null>('babySex', { required: true })

const questions: {
  label: string
  model: 'isFirstBaby' | 'isWorking'
}[] = [
  { label: 'Is this your first baby?', model: 'isFirstBaby' },
  { label: 'Will you be working during pregnancy?', model: 'isWorking' },
]

const modelRefs = { isFirstBaby, isWorking }

const sexOptions: { value: BabySex; label: string }[] = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
  { value: 'surprise', label: 'Surprise' },
]

const theme = computed(() => {
  switch (babySex.value) {
    case 'boy':
      return { border: 'border-babyBoy', bg: 'bg-babyBoy/10', text: 'text-babyBoy' }
    case 'girl':
      return { border: 'border-babyGirl', bg: 'bg-babyGirl/10', text: 'text-babyGirl' }
    case 'surprise':
      return { border: 'border-babySurprise', bg: 'bg-babySurprise/10', text: 'text-babySurprise' }
    default:
      return { border: 'border-sage-200', bg: 'bg-sage-50', text: 'text-primary' }
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-primary">A bit about you</h1>
    <p class="mt-2 text-sm text-gray-500">This helps us tailor which tasks make sense for your plan.</p>

    <div class="mt-6 rounded-2xl border p-4 transition-colors" :class="[theme.border, theme.bg]">
      <label class="block text-sm font-medium text-gray-700" for="baby-name">
        Baby's name <span class="font-normal text-gray-400">(optional)</span>
      </label>
      <input
        id="baby-name"
        v-model="babyName"
        type="text"
        placeholder="e.g. Emma"
        maxlength="40"
        class="mt-1 w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
      />

      <p class="mb-2 mt-4 text-sm font-medium text-gray-700">Boy, girl, or a surprise?</p>
      <div class="flex gap-2">
        <button
          v-for="opt in sexOptions"
          :key="opt.value"
          type="button"
          class="min-h-[40px] flex-1 rounded-xl border text-sm font-semibold transition-colors"
          :class="
            babySex === opt.value
              ? [theme.border, theme.bg, theme.text]
              : 'border-gray-200 bg-white text-gray-500'
          "
          @click="babySex = babySex === opt.value ? null : opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="mt-6 space-y-5">
      <div v-for="q in questions" :key="q.model" class="flex items-center justify-between gap-4">
        <span class="text-sm font-medium text-gray-700">{{ q.label }}</span>
        <div class="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5">
          <button
            type="button"
            class="min-h-[36px] rounded-full px-4 text-sm font-medium transition-colors"
            :class="modelRefs[q.model].value === true ? 'bg-primary text-white' : 'text-gray-500'"
            @click="modelRefs[q.model].value = true"
          >
            Yes
          </button>
          <button
            type="button"
            class="min-h-[36px] rounded-full px-4 text-sm font-medium transition-colors"
            :class="modelRefs[q.model].value === false ? 'bg-primary text-white' : 'text-gray-500'"
            @click="modelRefs[q.model].value = false"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
