import { ROUTES_NAMES } from '../constants'
import { RouterView } from 'vue-router'

export default [
  {
    path: '/transition',
    name: ROUTES_NAMES.TRANSITION.BASE,
    meta: { title: 'Transition', icon: 'VideoCamera' },
    component: RouterView,
    redirect: { name: ROUTES_NAMES.TRANSITION.TEST },
    children: [
      {
        path: '/transition/test',
        name: ROUTES_NAMES.TRANSITION.TEST,
        component: () => import('@/views/Transition/TransitionTest.vue'),
        meta: { title: 'Transition测试' },
      },
    ],
  },
]
