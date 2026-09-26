import { createRouter, createWebHashHistory } from 'vue-router'
import { usePlanStore } from '../stores/plan'

import OnboardingView from '../views/OnboardingView.vue'
import TodayView from '../views/TodayView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import TasksView from '../views/TasksView.vue'
import ProgressView from '../views/ProgressView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  { path: '/', redirect: '/today' },
  { path: '/onboarding', component: OnboardingView, meta: { hideNav: true } },
  { path: '/today', component: TodayView },
  { path: '/schedule', component: ScheduleView },
  { path: '/tasks', component: TasksView },
  { path: '/progress', component: ProgressView },
  { path: '/settings', component: SettingsView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const planStore = usePlanStore()
  const onboardingComplete = planStore.plan?.onboardingComplete ?? false

  if (!onboardingComplete && to.path !== '/onboarding') {
    return '/onboarding'
  }
  if (onboardingComplete && to.path === '/onboarding') {
    return '/today'
  }

  return true
})
