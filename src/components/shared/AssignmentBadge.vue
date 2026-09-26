<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps<{ assignment: string }>()
const auth = useAuthStore()

const label = computed(() => {
  if (props.assignment === auth.profile?.id) return 'Mine'
  return 'Shared'
})
</script>

<template>
  <span class="rounded-full bg-purple/15 px-2 py-0.5 text-xs font-medium text-purple">
    {{ label }}
  </span>
</template>
