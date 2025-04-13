<template>
  <v-container>
    <v-card :loading="isTaskLoading">
      <v-card-text class="pa-6">
        <TaskForm :task="task" :project_id="project_id" @saved="goBack" @cancel="goBack" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import TaskForm from './TaskForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useAlert } from '@/composables/useAlert.js'
const { showMessage } = useAlert()

const route = useRoute()
const router = useRouter()
const store = useStore()

const project_id = Number(route.params.project_id)
const task_id = Number(route.params.task_id)

const task = computed(() => store.getters['tasks/tasksById'](task_id))
const isTaskLoading = computed(() => store.getters['tasks/isTaskLoading'](task_id))

const goBack = () => router.push({ name: 'project-detail', params: { id: project_id } })

onMounted(async () => {
  try {
    const task = await store.dispatch('tasks/getTaskById', task_id)
    if (!task) {
      await router.push({ name: 'project-detail', params: { id: project_id } })
    }
  } catch (error) {
    showMessage(error.message, 'error')
    await router.push({ name: 'project-list' })
  }
})
</script>
