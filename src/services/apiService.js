const PROJECTS_DATA = 'projectsData'
const TASKS_DATA = 'tasksData'

export const apiService = {
  getProjects() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projects = JSON.parse(localStorage.getItem(PROJECTS_DATA)) || []
        resolve(projects)
      }, 500)
    })
  },

  getProjectById(id) {
    id = Number(id)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const projects = JSON.parse(localStorage.getItem(PROJECTS_DATA)) || []
        const project = projects.find((e) => e.id === id)
        if (project) {
          resolve(project)
        } else {
          reject(new Error('Project Not Found'))
        }
      }, 500)
    })
  },

  createProject(project) {
    return new Promise((resolve) => {
      setTimeout(() => {
        project.id = Date.now()
        const projects = JSON.parse(localStorage.getItem(PROJECTS_DATA)) || []
        projects.unshift(project)
        localStorage.setItem(PROJECTS_DATA, JSON.stringify(projects))
        resolve(project)
      }, 300)
    })
  },

  deleteProject(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let projects = JSON.parse(localStorage.getItem(PROJECTS_DATA)) || []
        projects = projects.filter((project) => project.id !== id)
        localStorage.setItem(PROJECTS_DATA, JSON.stringify(projects))
        resolve(id)
      }, 300)
    })
  },

  getProjectTasks(project_id) {
    project_id = Number(project_id)
    return new Promise((resolve) => {
      setTimeout(() => {
        const all_tasks = JSON.parse(localStorage.getItem(TASKS_DATA)) || []
        const project_tasks = all_tasks.filter((task) => task.project_id === project_id)
        resolve(project_tasks)
      }, 500)
    })
  },

  getTaskById(id) {
    id = Number(id)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const all_tasks = JSON.parse(localStorage.getItem(TASKS_DATA)) || []
        const task = all_tasks.find((e) => e.id === id)
        if (task) {
          resolve(task)
        } else {
          reject(new Error('Task Not Found'))
        }
      }, 300)
    })
  },

  createProjectTask(project_id, task) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem(TASKS_DATA)) || []
        task.id = Date.now()
        task.project_id = project_id
        tasks.unshift(task)
        localStorage.setItem(TASKS_DATA, JSON.stringify(tasks))
        resolve(task)
      }, 300)
    })
  },

  editProjectTask(project_id, updatedTask) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let tasks = JSON.parse(localStorage.getItem(TASKS_DATA)) || []
        const index = tasks.findIndex(
          (task) => task.id === updatedTask.id && task.project_id === project_id,
        )
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...updatedTask }
          localStorage.setItem(TASKS_DATA, JSON.stringify(tasks))
          resolve(tasks[index])
        } else {
          reject(new Error('Unable to edit task'))
        }
      }, 300)
    })
  },

  changeTaskStatus(task_id, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let tasks = JSON.parse(localStorage.getItem(TASKS_DATA)) || []
        const index = tasks.findIndex((task) => task.id === task_id)
        if (index !== -1) {
          tasks[index] = {
            ...tasks[index],
            status: newStatus,
          }
          localStorage.setItem(TASKS_DATA, JSON.stringify(tasks))
          resolve(tasks[index])
        } else {
          reject(new Error('Unable to change task status'))
        }
      }, 300)
    })
  },

  updateTaskOrder(reorderedList) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let tasks = JSON.parse(localStorage.getItem(TASKS_DATA)) || []

        reorderedList.forEach((updated) => {
          const index = tasks.findIndex((task) => task.id === updated.id)
          if (index !== -1) {
            tasks[index].order = updated.order
          }
        })

        localStorage.setItem(TASKS_DATA, JSON.stringify(tasks))
        resolve(reorderedList)
      }, 300)
    })
  },
}
