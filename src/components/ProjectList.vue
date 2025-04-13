<template>
  <v-container fluid>
    <v-row justify="start" class="mb-4">
      <v-btn color="primary" @click="openCreateProjectDialog"> Create Project </v-btn>
    </v-row>

    <v-row v-if="isLoading" justify="center" class="my-6">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="6" v-for="project in projects" :key="project.id">
        <v-card>
          <v-card-title class="text-h6">{{ project.name }}</v-card-title>
          <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn
              color="error"
              variant="outlined"
              @click="deleteProject(project.id)"
              :loading="isProjectLoading(project.id)"
            >
              Delete
            </v-btn>
            <v-btn color="primary" variant="tonal" @click="viewProject(project.id)"> View </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">Create New Project</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newProjectName"
              label="Project Name"
              :rules="[(v) => !!v || 'Name is required']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="addNewProject"
            type="submit"
            color="primary"
            :loading="isAdding"
            variant="elevated"
          >
            Add Project
          </v-btn>
          <v-btn color="grey" @click="dialog = false" variant="tonal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import router from '@/router/index.js'

const store = useStore()

const projects = computed(() => store.getters['projects/allProjects'])
const isLoading = computed(() => store.getters['projects/isLoading'])
const isProjectLoading = (id) => store.getters['projects/isProjectLoading'](id)

const newProjectName = ref('')
const newProjectDescription = ref('')
const isAdding = ref(false)
const dialog = ref(false)

const form = ref()

const addNewProject = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return
  const newProject = {
    name: newProjectName.value,
  }

  isAdding.value = true

  store
    .dispatch('projects/createProject', newProject)
    .then(() => {
      form.value.reset()
      newProjectName.value = ''
      newProjectDescription.value = ''
      dialog.value = false
    })
    .finally(() => {
      isAdding.value = false
    })
}

const deleteProject = (id) => {
  store.dispatch('projects/deleteProject', id)
}

const viewProject = (id) => {
  router.push({ name: 'project-detail', params: { id } })
}

onMounted(() => {
  store.dispatch('projects/getProjects')
})

const openCreateProjectDialog = () => {
  dialog.value = true
}
</script>
