<script setup lang="ts">
defineProps<{
  options: { value: string; label: string }[]
  modelValue: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <div class="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="min-h-[32px] rounded-full px-3 text-xs font-medium transition-colors"
      :class="
        modelValue === option.value
          ? 'bg-primary text-white'
          : 'text-gray-500 hover:text-gray-700'
      "
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
