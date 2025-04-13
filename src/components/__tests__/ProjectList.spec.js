import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectList from '@/components/ProjectList.vue'
import { createStore } from 'vuex'
import router from '@/router/index.js'

vi.spyOn(router, 'push').mockImplementation(() => {})

const mockProjects = [
  { id: 1, name: 'Test Project 1' },
  { id: 2, name: 'Test Project 2' },
]

const baseProjectModule = ({ loading = false } = {}, overrides = {}) => ({
  namespaced: true,
  state: () => ({
    projects: mockProjects,
    loading,
    ...(overrides.state || {}),
  }),
  getters: {
    allProjects: (state) => state.projects,
    isLoading: (state) => state.loading,
    isProjectLoading: () => () => false,
    ...(overrides.getters || {}),
  },
  actions: {
    getProjects: vi.fn(),
    createProject: vi.fn(),
    ...(overrides.actions || {}),
  },
})

const createVuexStore = ({ loading = false, overrides = {} } = {}) =>
  createStore({
    modules: {
      projects: baseProjectModule({ loading }, overrides),
    },
  })

describe('ProjectList.vue', () => {
  it('renders list of projects', () => {
    const store = createVuexStore()
    const wrapper = mount(ProjectList, {
      global: { plugins: [store] },
    })

    expect(wrapper.text()).toContain('Test Project 1')
    expect(wrapper.text()).toContain('Test Project 2')
  })

  it('opens dialog when "Create Project" is clicked and shows dialog content', async () => {
    const store = createVuexStore()
    const wrapper = mount(ProjectList, {
      global: { plugins: [store] },
    })

    const button = wrapper.get('button')
    await button.trigger('click')

    expect(wrapper.vm.dialog).toBe(true)

    const dialog = document.body.querySelector('.v-dialog')
    expect(dialog?.textContent).toContain('Create New Project')
  })

  it('shows loading indicator when loading is true', () => {
    const store = createVuexStore({ loading: true })
    const wrapper = mount(ProjectList, {
      global: { plugins: [store] },
    })

    expect(wrapper.findComponent({ name: 'v-progress-circular' }).exists()).toBe(true)
    expect(wrapper.html()).toContain('v-progress-circular')
  })

  it('calls viewProject when "View" button is clicked', async () => {
    const store = createVuexStore()
    const wrapper = mount(ProjectList, {
      global: { plugins: [store] },
    })

    const viewButton = wrapper.findAll('button').find((btn) => btn.text() === 'View')
    expect(viewButton).toBeTruthy()

    await viewButton.trigger('click')

    expect(router.push).toHaveBeenCalledWith({
      name: 'project-detail',
      params: { id: 1 },
    })
  })

  it('removes project from list when "Delete" button is clicked', async () => {
    const deleteProjectMock = vi.fn()

    const store = createVuexStore({
      overrides: {
        actions: {
          deleteProject: deleteProjectMock,
        },
      },
    })

    const wrapper = mount(ProjectList, {
      global: { plugins: [store] },
    })

    const deleteButton = wrapper.findAll('button').find((btn) => btn.text() === 'Delete')
    expect(deleteButton).toBeTruthy()

    await deleteButton.trigger('click')

    expect(deleteProjectMock).toHaveBeenCalled()
    expect(deleteProjectMock.mock.calls[0][1]).toBe(1)
  })
})
