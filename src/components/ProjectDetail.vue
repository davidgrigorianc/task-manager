<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center mb-4">
        <span class="headline">{{ project?.name }}</span>
        <v-btn text @click="goToProjects" class="back-btn">Back</v-btn>
      </v-col>

      <v-col cols="12">
        <v-card class="project-card" :loading="isProjectLoading">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="subtitle-1">Tasks</span>
            <v-btn
              color="primary"
              @click="createTask"
              class="create-task-btn"
              rounded
              elevation="2"
              :loading="isProjectLoading"
              :disabled="isProjectLoading"
            >
              <v-icon left>mdi-plus</v-icon> Create Task
            </v-btn>
          </v-card-title>
        </v-card>
        <v-divider class="mb-2"></v-divider>
        <v-row class="equal-height-row">
          <v-col
            cols="12"
            md="4"
            v-for="(tasks, status) in tasksByStatus"
            :key="status"
            class="equal-height-col"
          >
            <v-card elevation="1" class="equal-height-card" :loading="tasksLoading">
              <v-card-title class="text-h6">
                {{ statusTitles[status] }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="task-column-content">
                <div v-if="tasks.length === 0" class="text-grey text-center py-4">
                  No tasks here
                </div>
                <VueDraggable
                  :empty-insert-threshold="50"
                  :model-value="tasksByStatus[status]"
                  animation="150"
                  ghostClass="ghost"
                  :class="['task-container', status]"
                  @end="onDragEnd"
                  :group="{ name: 'tasks', pull: 'clone', put: true }"
                >
                  <v-card
                    v-for="task in tasks"
                    :key="task.id"
                    class="mb-3"
                    variant="outlined"
                    rounded="lg"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-start mb-2">
                        <div
                          class="text-subtitle-1 font-weight-medium text-truncate"
                          style="max-width: 85%"
                        >
                          {{ task.title }}
                        </div>
                        <v-btn
                          icon
                          size="x-small"
                          color="primary"
                          @click="editTask(task)"
                          class="flex-shrink-0"
                          :data-testid="`edit-task-${task.id}`"
                        >
                          <v-icon size="small">mdi-pencil</v-icon>
                        </v-btn>
                      </div>

                      <div class="text-caption text-uppercase font-weight-bold mb-1">
                        {{ task.priority }} priority
                      </div>

                      <div class="text-caption text-grey mb-1">
                        {{ formatDate(task.date) }}
                      </div>

                      <div class="task-description text-body-2 mb-2">{{ task.description }}</div>

                      <div class="d-flex align-center">
                        <span class="text-caption mr-2">Assigned to:</span>
                        <div class="d-flex align-center">
                          <v-avatar
                            v-for="assignee in task.assignees"
                            :key="assignee"
                            size="24"
                            class="me-1"
                            color="green"
                          >
                            <span class="white--text">{{ getInitials(assignee) }}</span>
                          </v-avatar>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </VueDraggable>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <TaskFormDialog
      v-model:dialog="dialog"
      :task="taskToEdit"
      @task-saved="handleTaskSaved"
      :project_id="projectId"
    />
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import { useAlert } from '@/composables/useAlert'
import TaskFormDialog from '@/components/TaskFormDialog.vue'

const { showMessage } = useAlert()

const statusTitles = {
  to_do: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const store = useStore()
const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)

const project = computed(() => store.getters['projects/projectById'](projectId))
const projectTasks = computed(() => store.getters['tasks/tasksByProject'](projectId))
const tasksLoading = computed(() => store.getters['tasks/isLoading']())
const isProjectLoading = computed(() => store.getters['projects/isProjectLoading'](projectId))

const dialog = ref(false)
const taskToEdit = ref(null)

const tasksByStatus = computed(() => {
  const taskStatuses = {
    to_do: [],
    in_progress: [],
    completed: [],
  }
  if (!projectTasks.value?.length) {
    return taskStatuses
  }
  projectTasks.value.forEach((task) => {
    taskStatuses[task.status]?.push(task)
  })
  Object.keys(taskStatuses).forEach((status) => {
    taskStatuses[status].sort((a, b) => a.order - b.order)
  })
  return taskStatuses
})

const handleTaskSaved = () => {
  dialog.value = false
}

const createTask = () => {
  dialog.value = true
  taskToEdit.value = null
}

const editTask = (task) => {
  taskToEdit.value = task
  dialog.value = true
}

const goToProjects = () => {
  router.push({ name: 'project-list' })
}

const formatDate = (date) => {
  if (!date) {
    return ''
  }
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const users = computed(() => store.getters['users/users'])

const getInitials = (id) => {
  const user = users.value.find((e) => e.id === id)
  return user?.name?.charAt(0) + user?.lastname?.charAt(0) ?? ''
}

const onDragEnd = async (event) => {
  const toContainer = event.to
  const classList = Array.from(toContainer.classList)
  const task = event.data
  const newStatus = classList.find((cls) => ['to_do', 'in_progress', 'completed'].includes(cls))

  const newIndex = event.newIndex

  if (task.status !== newStatus) {
    try {
      await store.dispatch('tasks/changeStatus', {
        id: task.id,
        newStatus,
        newOrder: newIndex,
      })
      const message = `Task "${task.title}" has been moved to "${statusTitles[newStatus]}"`
      showMessage(message, 'success')
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }
  let updatedList = [...tasksByStatus.value[newStatus].filter((t) => t.id !== task.id)]

  updatedList.splice(newIndex, 0, { ...task, status: newStatus })

  const reorderedTasks = updatedList.map((t, i) => ({
    id: t.id,
    order: i,
  }))

  try {
    await store.dispatch('tasks/updateTaskOrder', reorderedTasks)
  } catch (error) {
    showMessage(error.message, 'error')
  }
}
onMounted(async () => {
  try {
    const project = await store.dispatch('projects/getProjectById', projectId)
    if (!project) {
      await router.push({ name: 'project-list' })
      return
    }
    await store.dispatch('tasks/getTasks', projectId)
  } catch (error) {
    showMessage(error.message, 'error')
    await router.push({ name: 'project-list' })
  }
})
</script>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: 600;
}

.create-task-btn {
  padding-left: 16px;
  padding-right: 16px;
}

.subtitle-1 {
  font-weight: 600;
}

.back-btn {
  color: #1976d2;
}

.task-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: grab;
}
.task-description {
  max-height: 3.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.equal-height-row {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
}

.equal-height-col {
  display: flex;
  flex-direction: column;
}

.equal-height-row {
  display: flex;
  flex-wrap: wrap;
}

.equal-height-col {
  display: flex;
  flex-direction: column;
}

.equal-height-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.task-column-content,
.task-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100px;
}
</style>
