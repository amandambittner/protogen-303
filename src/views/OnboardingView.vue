<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useAuthStore } from '../stores/auth'
import { usePlanStore } from '../stores/plan'
import { useTasksStore } from '../stores/tasks'
import { useOnboardingStore } from '../stores/onboarding'
import { effortToEstimatedHours, customTaskWeek } from '../lib/schedule'
import StepDots from '../components/onboarding/StepDots.vue'
import StepWelcome from '../components/onboarding/StepWelcome.vue'
import StepDueDate from '../components/onboarding/StepDueDate.vue'
import StepProfile from '../components/onboarding/StepProfile.vue'
import StepTaskSelection from '../components/onboarding/StepTaskSelection.vue'
import StepTimePrefs from '../components/onboarding/StepTimePrefs.vue'
import type { Category, Effort, Timing } from '../data/types'

const router = useRouter()
const auth = useAuthStore()
const planStore = usePlanStore()
const tasksStore = useTasksStore()
const onboarding = useOnboardingStore()

const TOTAL_STEPS = 5

const name = ref(auth.profile?.name ?? '')
const dueDate = ref('')
const babyShowerDate = ref('')
const isFirstBaby = ref<boolean | null>(null)
const isWorking = ref<boolean | null>(null)
const hoursPerWeek = ref(5)
const customTasks = ref<{ title: string; category: Category; effort: Effort; timing: Timing }[]>([])

const error = ref('')
const submitting = ref(false)

const canContinue = computed(() => {
  if (onboarding.step === 1) return name.value.trim().length > 0
  if (onboarding.step === 2) return !!dueDate.value
  return true
})

const weeksUntilDue = computed(() => {
  if (!dueDate.value) return 0
  return Math.max(1, Math.floor(dayjs(dueDate.value).diff(dayjs(), 'day') / 7))
})

const totalEstimatedHours = computed(() => {
  const libraryHours = onboarding.selectedTasks.reduce((sum, t) => sum + t.estimatedHours, 0)
  const customHours = customTasks.value.reduce((sum, t) => sum + effortToEstimatedHours(t.effort), 0)
  return libraryHours + customHours
})

function next() {
  if (onboarding.step === 3) {
    onboarding.applyProfileDefaults({ isFirstBaby: isFirstBaby.value })
  }
  if (onboarding.step < TOTAL_STEPS) onboarding.setStep(onboarding.step + 1)
}

function back() {
  if (onboarding.step > 1) onboarding.setStep(onboarding.step - 1)
}

async function finish() {
  error.value = ''
  submitting.value = true
  try {
    if (!auth.profile) {
      auth.createProfile(name.value.trim())
    }
    auth.updateProfile({
      name: name.value.trim(),
      isFirstBaby: isFirstBaby.value,
      isWorking: isWorking.value,
    })

    const excludedLibraryTaskIds = Object.entries(onboarding.taskSelections)
      .filter(([, state]) => state !== 'add')
      .map(([id]) => id)

    planStore.createPlan(dueDate.value, hoursPerWeek.value, {
      babyShowerDate: babyShowerDate.value || null,
      babyName: onboarding.babyName.trim() || null,
      babySex: onboarding.babySex,
      excludedLibraryTaskIds,
    })
    await onboarding.finishOnboarding(hoursPerWeek.value)

    const weeksUntilDue = Math.max(0, Math.floor(dayjs(dueDate.value).diff(dayjs(), 'day') / 7))
    for (const custom of customTasks.value) {
      tasksStore.addTask({
        libraryTaskId: null,
        title: custom.title,
        description: '',
        category: custom.category,
        priority: 'medium',
        estimatedHours: effortToEstimatedHours(custom.effort),
        scheduledWeek: customTaskWeek(custom.timing, weeksUntilDue),
        status: 'pending',
        isCustom: true,
      })
    }

    router.push('/today')
  } catch (e: any) {
    error.value = e.message ?? 'Something went wrong creating your plan.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto min-h-full max-w-[480px] px-6 py-8">
    <StepDots :step="onboarding.step" :total="TOTAL_STEPS" />

    <div class="mt-8">
      <StepWelcome v-if="onboarding.step === 1" v-model:name="name" />
      <StepDueDate v-else-if="onboarding.step === 2" v-model:due-date="dueDate" v-model:baby-shower-date="babyShowerDate" />
      <StepProfile
        v-else-if="onboarding.step === 3"
        v-model:is-first-baby="isFirstBaby"
        v-model:is-working="isWorking"
        v-model:baby-name="onboarding.babyName"
        v-model:baby-sex="onboarding.babySex"
      />
      <StepTaskSelection v-else-if="onboarding.step === 4" v-model:custom-tasks="customTasks" />
      <StepTimePrefs
        v-else
        v-model:hours-per-week="hoursPerWeek"
        :task-count="onboarding.selectionCount + customTasks.length"
        :total-hours="totalEstimatedHours"
        :weeks-until-due="weeksUntilDue"
      />
    </div>

    <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>

    <div class="mt-8 flex gap-3" :class="{ 'mb-16': onboarding.step === 4 }">
      <button
        v-if="onboarding.step > 1"
        type="button"
        class="min-h-[44px] flex-1 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600"
        @click="back"
      >
        Back
      </button>
      <button
        v-if="onboarding.step < TOTAL_STEPS"
        type="button"
        :disabled="!canContinue"
        class="min-h-[44px] flex-1 rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-50"
        @click="next"
      >
        Continue
      </button>
      <button
        v-else
        type="button"
        :disabled="submitting"
        class="min-h-[44px] flex-1 rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-60"
        @click="finish"
      >
        {{ submitting ? 'Creating your plan…' : 'Create my plan' }}
      </button>
    </div>
  </div>
</template>
