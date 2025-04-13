import { createStore, createLogger } from 'vuex'
import projects from './modules/projects'
import tasks from './modules/tasks'
import users from './modules/users'

const store = createStore({
  modules: {
    projects,
    tasks,
    users,
  },
})

export default store
