<template>
  <v-form ref="form">
    <v-text-field
      label="Title"
      v-model="taskForm.title"
      variant="plain"
      class="text-h5 font-weight-bold mb-4"
      placeholder="Enter task title"
      :rules="[(v) => !!v || 'Title is required']"
      hide-details="auto"
    />

    <v-textarea
      label="Description"
      v-model="taskForm.description"
      variant="plain"
      placeholder="Add a more detailed description..."
      auto-grow
      class="mb-6"
      :rules="[(v) => !!v || 'Description is required']"
      hide-details="auto"
    />

    <v-row dense>
      <v-col cols="12" sm="4">
        <v-select
          v-model="taskForm.status"
          :items="statusItems"
          label="Task Status"
          item-title="label"
          item-value="value"
          :rules="[(v) => !!v || 'Task status is required']"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-date-input
          v-model="taskForm.date"
          label="Due Date"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          :min="minDate"
          :rules="[(v) => !!v || 'Due Date is required']"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-select
          v-model="taskForm.priority"
          :items="priorityLevels"
          label="Priority"
          item-title="label"
          item-value="value"
          :rules="[(v) => !!v || 'Priority is required']"
        />
      </v-col>

      <v-col cols="12">
        <v-autocomplete
          multiple
          chips
          closable-chips
          clearable
          v-model="taskForm.assignees"
          :items="users"
          label="Assignees"
          :item-title="(user) => `${user.name} ${user.lastname}`"
          item-value="id"
          :rules="[(v) => (v && v.length > 0) || 'At least one assignee is required']"
        />
      </v-col>
    </v-row>

    <div class="d-flex justify-end mt-6">
      <v-btn variant="text" class="me-2" @click="emit('cancel')">Cancel</v-btn>
      <v-btn color="primary" @click="submit">Save</v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAlert } from '@/composables/useAlert'

const { showMessage } = useAlert()

const props = defineProps({
  task: Object,
  project_id: Number,
})

const emit = defineEmits(['saved', 'cancel'])

const form = ref()
const store = useStore()

const users = computed(() => store.getters['users/users'])

const taskForm = reactive({
  title: '',
  description: '',
  assignees: [],
  status: 'to_do',
  date: '',
  priority: 'medium',
})

const minDate = new Date().toISOString().split('T')[0]

const statusItems = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const priorityLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

watch(
  () => props.task,
  (task) => {
    if (task) Object.assign(taskForm, task)
  },
  { immediate: true },
)

const submit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  const payload = {
    project_id: props.project_id,
    task: { ...taskForm },
  }

  const action = props.task?.id ? 'editTask' : 'createTask'

  try {
    await store.dispatch(`tasks/${action}`, payload)
    emit('saved')
    const message = `Task ${taskForm.title} ${action === 'editTask' ? 'updated' : 'created'} successfully`
    showMessage(message, 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}
</script>
