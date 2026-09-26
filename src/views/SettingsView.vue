<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlanStore } from '../stores/plan'
import { useTasksStore } from '../stores/tasks'
import { useOnboardingStore } from '../stores/onboarding'

const router = useRouter()
const auth = useAuthStore()
const planStore = usePlanStore()
const tasksStore = useTasksStore()
const onboarding = useOnboardingStore()

function resetPlan() {
  if (!confirm('This clears your name, plan, and all tasks on this device. Continue?')) return
  auth.reset()
  planStore.reset()
  tasksStore.reset()
  onboarding.$reset()
  router.push('/onboarding')
}
</script>

<template>
  <div class="mx-auto max-w-[480px] px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-primary">Settings</h1>

    <div class="mt-6 rounded-xl border border-sage-100 bg-white p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Account</p>
      <p class="mt-1 text-sm font-medium text-gray-700">{{ auth.profile?.name }}</p>
      <p class="text-xs text-gray-400">Saved on this device only</p>
    </div>

    <button
      type="button"
      class="mt-8 min-h-[44px] w-full rounded-xl border border-gray-200 text-sm font-semibold text-danger"
      @click="resetPlan"
    >
      Reset my plan
    </button>
  </div>
</template>
