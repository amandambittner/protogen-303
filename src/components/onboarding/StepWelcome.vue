<script setup lang="ts">
import { Sprout } from 'lucide-vue-next'

const name = defineModel<string>('name', { required: true })
</script>

<template>
  <div>
    <span
      class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sage-500 text-white shadow-sm"
    >
      <Sprout :size="24" />
    </span>
    <h1 class="mt-4 text-2xl font-bold text-primary">Welcome to Nest</h1>
    <p class="mt-2 text-sm text-gray-500">
      Let's build a plan for everything you need to do before baby arrives.
    </p>

    <label class="mt-8 block text-sm font-medium text-gray-700" for="name">What should we call you?</label>
    <input
      id="name"
      v-model="name"
      type="text"
      class="mt-1 w-full min-h-[44px] rounded-xl border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
    />
  </div>
</template>
