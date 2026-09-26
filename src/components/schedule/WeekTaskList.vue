<script setup lang="ts">
import TaskList from '../tasks/TaskList.vue'
import type { Task } from '../../data/types'

defineProps<{ tasks: Task[] }>()
</script>

<template>
  <TaskList :tasks="tasks" />
</template>
