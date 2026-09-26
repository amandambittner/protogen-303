<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Clock, ListChecks, Pencil, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { usePlanStore } from '../../stores/plan'
import { useTasksStore } from '../../stores/tasks'
import { getWeekStart, toWeekKey } from '../../lib/schedule'
import CategoryBadge from '../shared/CategoryBadge.vue'
import StatusBadge from '../shared/StatusBadge.vue'
import TogglePill from '../shared/TogglePill.vue'
import type { Task, Status } from '../../data/types'

const props = defineProps<{ task: Task; overdue?: boolean }>()

const auth = useAuthStore()
const planStore = usePlanStore()
const tasksStore = useTasksStore()

const expanded = ref(false)
const note = ref('')
const showerDateInput = ref('')
const newSubtask = ref('')
const editing = ref(false)
const editTitle = ref('')
const editDescription = ref('')

const doneSubtaskCount = computed(() => props.task.subtasks.filter((s) => s.done).length)

const awaitingShowerDate = computed(
  () => props.task.dependsOn?.event === 'baby_shower' && !planStore.plan?.babyShowerDate
)

const nextStatus: Record<Status, Status> = {
  pending: 'in_progress',
  in_progress: 'done',
  done: 'pending',
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'pending', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

function cycleStatus() {
  tasksStore.updateStatus(props.task.id, nextStatus[props.task.status])
}

function setStatus(status: string) {
  tasksStore.updateStatus(props.task.id, status as Status)
}

function startEditing() {
  editTitle.value = props.task.title
  editDescription.value = props.task.description
  editing.value = true
}

function saveEdit() {
  tasksStore.updateTaskDetails(props.task.id, { title: editTitle.value, description: editDescription.value })
  editing.value = false
}

function submitShowerDate() {
  if (!showerDateInput.value) return
  planStore.updatePlan({ babyShowerDate: showerDateInput.value })
  tasksStore.rescheduleForDependency('baby_shower')
  showerDateInput.value = ''
}

function handleReschedule(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (!value) return
  tasksStore.rescheduleTask(props.task.id, toWeekKey(getWeekStart(value)))
}

function addSubtask() {
  if (!newSubtask.value.trim()) return
  tasksStore.addSubtask(props.task.id, newSubtask.value.trim())
  newSubtask.value = ''
}

function toggleSubtask(subtaskId: string) {
  tasksStore.toggleSubtask(props.task.id, subtaskId)
}

function deleteSubtask(subtaskId: string) {
  tasksStore.deleteSubtask(props.task.id, subtaskId)
}

async function submitNote() {
  if (!note.value.trim() || !auth.profile) return
  await tasksStore.addComment(props.task.id, auth.profile.id, note.value.trim())
  note.value = ''
}
</script>

<template>
  <div class="rounded-2xl border border-sage-100 bg-white shadow-sm">
    <button type="button" class="flex w-full min-h-[44px] items-start justify-between gap-3 px-4 py-3 text-left" @click="expanded = !expanded">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span class="truncate text-sm font-medium text-gray-800" :class="{ 'line-through text-gray-400': task.status === 'done' }">
            {{ task.title }}
          </span>
        </div>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
          <CategoryBadge :category="task.category" />
          <span class="inline-flex items-center gap-0.5 text-xs text-gray-400">
            <Clock :size="12" /> {{ task.estimatedHours }}h
          </span>
          <span v-if="task.subtasks.length" class="inline-flex items-center gap-0.5 text-xs text-gray-400">
            <ListChecks :size="12" /> {{ doneSubtaskCount }}/{{ task.subtasks.length }}
          </span>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span @click.stop="cycleStatus">
          <StatusBadge :status="task.status" />
        </span>
        <ChevronDown :size="16" class="text-gray-300 transition-transform" :class="{ 'rotate-180': expanded }" />
      </div>
    </button>

    <div v-if="expanded" class="space-y-4 border-t border-gray-50 px-4 py-4">
      <form v-if="editing" class="space-y-2" @submit.prevent="saveEdit">
        <input
          v-model="editTitle"
          type="text"
          required
          maxlength="80"
          class="w-full min-h-[40px] rounded-lg border border-gray-200 px-3 text-sm font-medium focus:border-primary focus:outline-none"
        />
        <textarea
          v-model="editDescription"
          rows="2"
          placeholder="Description (optional)"
          class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 focus:border-primary focus:outline-none"
        />
        <div class="flex gap-2">
          <button type="submit" class="min-h-[36px] flex-1 rounded-lg bg-primary text-sm font-medium text-white">
            Save
          </button>
          <button
            type="button"
            class="min-h-[36px] flex-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-600"
            @click="editing = false"
          >
            Cancel
          </button>
        </div>
      </form>
      <div v-else class="flex items-start justify-between gap-2">
        <p v-if="task.description" class="text-sm text-gray-500">{{ task.description }}</p>
        <p v-else class="text-sm italic text-gray-300">No description</p>
        <button type="button" class="shrink-0 text-gray-300 hover:text-primary" @click="startEditing">
          <Pencil :size="14" />
        </button>
      </div>

      <div>
        <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Status</p>
        <TogglePill :model-value="task.status" :options="statusOptions" @update:model-value="setStatus" />
      </div>

      <div v-if="awaitingShowerDate" class="rounded-lg bg-purple/10 p-3">
        <p class="text-sm text-gray-600">This depends on gifts from your baby shower — when is it?</p>
        <form class="mt-2 flex gap-2" @submit.prevent="submitShowerDate">
          <input
            v-model="showerDateInput"
            type="date"
            required
            class="min-h-[40px] flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
          />
          <button type="submit" class="min-h-[40px] rounded-lg bg-primary px-3 text-sm font-medium text-white">
            Save
          </button>
        </form>
      </div>
      <p v-else-if="task.dependsOn" class="text-xs text-gray-400">
        Waits for {{ task.dependsOn.event === 'birth' ? "baby's birth" : 'your baby shower' }}
      </p>

      <div>
        <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Scheduled week</p>
        <input
          type="date"
          :value="task.scheduledWeek"
          class="min-h-[40px] w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
          @change="handleReschedule"
        />
      </div>

      <div>
        <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          Subtasks<span v-if="task.subtasks.length"> ({{ doneSubtaskCount }}/{{ task.subtasks.length }})</span>
        </p>
        <p v-if="!task.subtasks.length" class="text-sm text-gray-400">
          Feels too big or undefined? Break it into smaller steps.
        </p>
        <div v-else class="space-y-1.5">
          <div
            v-for="subtask in task.subtasks"
            :key="subtask.id"
            class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2"
          >
            <button
              type="button"
              class="flex-1 text-left text-sm text-gray-700"
              :class="{ 'line-through text-gray-400': subtask.done }"
              @click="toggleSubtask(subtask.id)"
            >
              {{ subtask.title }}
            </button>
            <button type="button" class="shrink-0 text-gray-300 hover:text-danger" @click="deleteSubtask(subtask.id)">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <form class="mt-2 flex gap-2" @submit.prevent="addSubtask">
          <input
            v-model="newSubtask"
            type="text"
            placeholder="Add a subtask…"
            class="min-h-[40px] flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
          />
          <button type="submit" class="min-h-[40px] rounded-lg bg-primary px-3 text-sm font-medium text-white">
            Add
          </button>
        </form>
      </div>

      <div>
        <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Comments</p>
        <div v-if="task.comments.length" class="space-y-2">
          <div v-for="comment in task.comments" :key="comment.id" class="rounded-lg bg-gray-50 px-3 py-2">
            <p class="text-sm text-gray-700">{{ comment.text }}</p>
            <p class="mt-0.5 text-xs text-gray-400">{{ comment.authorName }}</p>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">No comments yet.</p>

        <form class="mt-2 flex gap-2" @submit.prevent="submitNote">
          <input
            v-model="note"
            type="text"
            placeholder="Add a note…"
            class="min-h-[40px] flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
          />
          <button type="submit" class="min-h-[40px] rounded-lg bg-primary px-3 text-sm font-medium text-white">
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
