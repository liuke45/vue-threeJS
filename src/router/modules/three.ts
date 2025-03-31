import { ROUTES_NAMES } from '../constants'
import { RouterView } from 'vue-router'

export default [
  {
    path: '/three',
    name: ROUTES_NAMES.THREE.BASE,
    meta: { title: 'ThreeJS', icon: 'Monitor' },
    component: RouterView,
    redirect: { name: ROUTES_NAMES.THREE.TEST },
    children: [
      {
        path: '/three/test',
        name: ROUTES_NAMES.THREE.TEST,
        component: () => import('@/views/Three/MyTestThree.vue'),
        meta: { title: 'ThreeJS测试' },
      },
    ],
  },
]
