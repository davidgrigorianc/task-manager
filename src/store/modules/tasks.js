import { apiService } from '@/services/apiService.js'

const state = () => ({
  tasks: [],
  loading: false,
  loadingTaskIds: [],
  taskByIdCache: {},
})

const mutations = {
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  SET_TASK(state, task) {
    state.taskByIdCache[task.id] = task
  },
  SET_TASK_LOADING(state, { id, value }) {
    if (value) {
      state.loadingTaskIds.push(id)
    } else {
      state.loadingTaskIds = state.loadingTaskIds.filter((tid) => tid !== id)
    }
  },
  ADD_TASK(state, task) {
    const tasksInSameStatus = state.tasks.filter((t) => t.status === task.status)
    const maxOrder = Math.max(0, ...tasksInSameStatus.map((t) => t.order ?? 0))
    task.order = maxOrder + 1
    state.tasks.push(task)
  },
  UPDATE_TASK(state, updatedTask) {
    const index = state.tasks.findIndex((t) => t.id === updatedTask.id)
    if (index !== -1) {
      state.tasks.splice(index, 1, updatedTask)
    }
  },
  REORDER_TASKS(state, updatedTasks) {
    updatedTasks.forEach((updated) => {
      const index = state.tasks.findIndex((task) => task.id === updated.id)
      if (index !== -1) {
        state.tasks[index].order = updated.order
      }
    })
  },
  DELETE_TASK(state, id) {
    state.tasks = state.tasks.filter((t) => t.id !== id)
  },
}

const actions = {
  async getTasks({ commit }, project_id) {
    try {
      commit('SET_LOADING', true)
      const tasks = await apiService.getProjectTasks(project_id)
      commit('SET_TASKS', tasks)
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async getTaskById({ commit, state }, id) {
    if (state.taskByIdCache[id]) {
      return state.taskByIdCache[id]
    }

    commit('SET_TASK_LOADING', { id, value: true })

    try {
      const task = await apiService.getTaskById(id)
      commit('SET_TASK', task)
      return task
    } catch (error) {
      throw error
    } finally {
      commit('SET_TASK_LOADING', { id, value: false })
    }
  },
  async createTask({ commit }, { project_id, task }) {
    try {
      commit('SET_LOADING', true)
      const newTask = await apiService.createProjectTask(project_id, task)
      commit('ADD_TASK', newTask)
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async editTask({ commit }, { project_id, task }) {
    try {
      commit('SET_LOADING', true)
      const updatedTask = await apiService.editProjectTask(project_id, task)
      commit('UPDATE_TASK', updatedTask)
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async deleteTask({ commit }, id) {
    commit('SET_LOADING', true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    commit('DELETE_TASK', id)
    commit('SET_LOADING', false)
  },
  async changeStatus({ commit }, { id, newStatus }) {
    try {
      commit('SET_LOADING', true)
      const updatedTask = await apiService.changeTaskStatus(id, newStatus)
      commit('UPDATE_TASK', updatedTask)
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateTaskOrder({ commit }, reorderedList) {
    try {
      const updated = await apiService.updateTaskOrder(reorderedList)
      commit('REORDER_TASKS', updated)
    } catch (error) {
      throw error
    }
  },
}

const getters = {
  tasksByProject: (state) => (projectId) => state.tasks.filter((t) => t.project_id === projectId),
  tasksById: (state) => (id) => {
    return state.taskByIdCache[id]
  },
  isTaskLoading: (state) => (id) => state.loadingTaskIds.includes(id),
  isLoading: (state) => () => state.loading,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
