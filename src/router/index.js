import { createRouter, createWebHistory } from 'vue-router'
const TaskFormPage = () => import('@/components/TaskFormPage.vue')

const ProjectList = () => import('@/components/ProjectList.vue')
const ProjectDetail = () => import('@/components/ProjectDetail.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/projects',
    },
    {
      path: '/projects',
      name: 'project-list',
      component: ProjectList,
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetail,
    },
    {
      path: '/projects/:project_id/tasks/:task_id',
      name: 'project-task-edit',
      component: TaskFormPage,
    },
  ],
})

export default router
