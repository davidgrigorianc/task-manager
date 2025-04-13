import { apiService } from '@/services/apiService.js'

const state = () => ({
  projects: [],
  loading: false,
  loadingProjectIds: [],
  projectByIdCache: {},
})

const mutations = {
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_PROJECT_LOADING(state, { id, value }) {
    if (value) {
      state.loadingProjectIds.push(id)
    } else {
      state.loadingProjectIds = state.loadingProjectIds.filter((pid) => pid !== id)
    }
  },
  SET_PROJECT(state, project) {
    state.projectByIdCache[project.id] = project
  },
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  ADD_PROJECT(state, project) {
    state.projects.unshift(project)
  },
  DELETE_PROJECT(state, id) {
    state.projects = state.projects.filter((e) => e.id !== id)
  },
}

const actions = {
  async getProjects({ commit }) {
    commit('SET_LOADING', true)
    try {
      const projects = await apiService.getProjects()
      commit('SET_PROJECTS', projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getProjectById({ commit, state }, id) {
    if (state.projectByIdCache[id]) {
      return state.projectByIdCache[id]
    }

    commit('SET_PROJECT_LOADING', { id, value: true })

    try {
      const project = await apiService.getProjectById(id)
      commit('SET_PROJECT', project)
      return project
    } catch (error) {
      throw error
    } finally {
      commit('SET_PROJECT_LOADING', { id, value: false })
    }
  },

  async createProject({ commit }, project) {
    commit('SET_LOADING', true)
    try {
      const newProject = await apiService.createProject(project)
      commit('ADD_PROJECT', newProject)
    } catch (error) {
      console.error('Error adding project:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteProject({ commit }, id) {
    commit('SET_PROJECT_LOADING', { id, value: true })
    try {
      await apiService.deleteProject(id)
      commit('DELETE_PROJECT', id)
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      commit('SET_PROJECT_LOADING', { id, value: false })
    }
  },
}

const getters = {
  allProjects: (state) => state.projects,
  isLoading: (state) => state.loading,
  isProjectLoading: (state) => (id) => state.loadingProjectIds.includes(id),
  projectById: (state) => (id) => {
    return state.projectByIdCache[id]
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
