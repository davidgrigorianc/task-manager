import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskFormDialog from '@/components/TaskFormDialog.vue'
import { createStore } from 'vuex'
import router from '@/router/index.js'

vi.spyOn(router, 'push').mockImplementation(() => {})

const mockUsers = [
  { id: 1, name: 'Aram', lastname: 'Asatryan' },
  { id: 2, name: 'James', lastname: 'Bond' },
]

const baseTaskModule = ({ loading = false } = {}, overrides = {}) => ({
  namespaced: true,
  state: () => ({
    users: mockUsers,
    loading,
    ...(overrides.state || {}),
  }),
  getters: {
    'users/users': (state) => state.users,
    ...(overrides.getters || {}),
  },
  actions: {
    'tasks/createTask': vi.fn(),
    'tasks/editTask': vi.fn(),
    ...(overrides.actions || {}),
  },
})

const createVuexStore = ({ loading = false, overrides = {} } = {}) =>
  createStore({
    modules: {
      users: baseTaskModule({ loading }, overrides),
    },
  })

describe('TaskFormDialog.vue', () => {
  it('does not render dialog initially when dialog prop is false', async () => {
    const store = createVuexStore()
    const wrapper = mount(TaskFormDialog, {
      global: { plugins: [store, router] },
      props: { dialog: false },
    })

    await wrapper.vm.$nextTick()

    const dialog = document.querySelector('.v-dialog')

    expect(dialog).toBeNull()
  })

  it('opens dialog when dialog prop is set to true', async () => {
    const store = createVuexStore()
    const wrapper = mount(TaskFormDialog, {
      global: { plugins: [store, router] },
      props: { dialog: false },
    })

    await wrapper.setProps({ dialog: true })
    await wrapper.vm.$nextTick()

    const dialog = document.querySelector('.v-dialog')

    expect(dialog).not.toBeNull()
  })

  it('sets taskForm data when dialog is opened and task prop is passed', async () => {
    const store = createVuexStore()
    const task = {
      title: 'Test Task',
      description: 'Test Description',
      assignees: [1],
      status: 'to_do',
      date: '',
      priority: 'medium',
    }
    const wrapper = mount(TaskFormDialog, {
      global: { plugins: [store, router] },
      props: { dialog: false },
    })

    await wrapper.setProps({ dialog: true, task: task })
    await wrapper.vm.$nextTick()

    const taskForm = wrapper.findComponent({ name: 'TaskForm' })

    expect(taskForm.exists()).toBe(true)
    expect(taskForm.props('task').title).toBe(task.title)
    expect(taskForm.props('task').description).toBe(task.description)
    expect(taskForm.props('task').assignees).toEqual(task.assignees)
    expect(taskForm.props('task').status).toBe(task.status)
  })
})
