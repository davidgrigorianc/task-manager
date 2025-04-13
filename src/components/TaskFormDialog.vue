<template>
  <v-dialog v-model="internalDialog" max-width="700px" persistent scrollable>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Task</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <TaskForm :task="task" :project_id="project_id" @saved="handleSave" @cancel="close" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import TaskForm from './TaskForm.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const props = defineProps({
  dialog: Boolean,
  task: Object,
  project_id: Number,
})

const emit = defineEmits(['update:dialog', 'task-saved'])

const internalDialog = ref(false)

watch(
  () => props.dialog,
  (val) => {
    internalDialog.value = val

    if (val && props.task?.id) {
      const newPath = router.resolve({
        name: 'project-task-edit',
        params: {
          project_id: props.project_id,
          task_id: props.task.id,
        },
      }).href

      window.history.replaceState(null, '', newPath)
    }
  },
  { immediate: true },
)

watch(internalDialog, (val) => {
  if (!val) emit('update:dialog', false)
})

const handleSave = () => {
  emit('task-saved')
  emit('update:dialog', false)
}

const close = () => {
  const newPath = router.resolve({
    name: 'project-detail',
    params: {
      id: props.project_id,
    },
  }).href

  window.history.replaceState(null, '', newPath)
  emit('update:dialog', false)
}
</script>
