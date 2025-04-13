import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProjectDetail from '@/components/ProjectDetail.vue'

vi.mock('@/components/TaskFormDialog.vue', () => ({
  default: {
    name: 'TaskFormDialog',
    template: '<div class="mock-task-form"></div>',
    props: ['dialog', 'task', 'project_id'],
  },
}))

describe('ProjectDetail.vue', () => {
  let store
  let router
  let wrapper

  const projectId = 1
  const project = { id: projectId, name: 'Project Alpha' }
  const tasks = [
    {
      id: 101,
      title: 'Task 1',
      description: 'Do something important',
      date: '2025-04-01',
      priority: 'High',
      status: 'to_do',
      assignees: [1, 2],
    },
  ]
  const users = [
    { id: 1, name: 'Alice', lastname: 'Smith' },
    { id: 2, name: 'Bob', lastname: 'Brown' },
  ]

  const routes = [
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetail,
    },
    {
      path: '/projects',
      name: 'project-list',
      component: { template: '<div>Project List</div>' },
    },
  ]

  beforeEach(async () => {
    store = createStore({
      modules: {
        projects: {
          namespaced: true,
          getters: {
            projectById: () => () => project,
            isProjectLoading: () => () => false,
          },
          actions: {
            getProjectById: vi.fn(),
          },
        },
        tasks: {
          namespaced: true,
          getters: {
            tasksByProject: () => () => tasks,
            isLoading: () => () => false,
          },
        },
        users: {
          namespaced: true,
          getters: {
            users: () => users,
          },
        },
      },
    })

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push(`/projects/${projectId}`)
    await router.isReady()

    wrapper = mount(ProjectDetail, {
      global: {
        plugins: [store, router],
      },
    })

    await flushPromises()
  })

  it('renders project name and tasks', () => {
    expect(wrapper.text()).toContain('Project Alpha')
    expect(wrapper.text()).toContain('Task 1')
    expect(wrapper.text()).toContain('Do something important')
  })

  it('opens the task form dialog on Create Task click', async () => {
    const btn = wrapper.find('.create-task-btn')
    await btn.trigger('click')
    expect(wrapper.vm.dialog).toBe(true)
    expect(wrapper.vm.taskToEdit).toBe(null)
  })

  it('opens the task form with task data on edit', async () => {
    const editBtn = wrapper.find('[data-testid="edit-task-101"]')
    await editBtn.trigger('click')
    expect(wrapper.vm.dialog).toBe(true)
    expect(wrapper.vm.taskToEdit).toEqual(tasks[0])
  })

  it('closes dialog when task is saved', async () => {
    wrapper.vm.dialog = true
    wrapper.vm.handleTaskSaved()
    expect(wrapper.vm.dialog).toBe(false)
  })

  it('navigates back to project list', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    const backBtn = wrapper.find('.back-btn')
    await backBtn.trigger('click')
    expect(pushSpy).toHaveBeenCalledWith({ name: 'project-list' })
  })
})
