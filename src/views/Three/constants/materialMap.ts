import { ThreeManager } from '@/libs/ThreeManager/ThreeManager'

const threeManager = ThreeManager.getInstance()

export const materialMap = {
  basic: {
    title: '基础构件',
    materials: [
      {
        name: '平面',
        creator: threeManager.createPlane,
        img: new URL('@/assets/images/plane.svg', import.meta.url).href,
      },
      {
        name: '立方体',
        creator: threeManager.createCube,
        img: new URL('@/assets/images/cube.svg', import.meta.url).href,
      },
      {
        name: '长方体',
        creator: threeManager.createAdvancedCube,
        img: new URL('@/assets/images/advanced-cube.svg', import.meta.url).href,
      },
      {
        name: '球体',
        creator: threeManager.createSphere,
        img: new URL('@/assets/images/sphere.svg', import.meta.url).href,
      },
      {
        name: '圆柱体',
        creator: threeManager.createCone,
        img: new URL('@/assets/images/cylinder.svg', import.meta.url).href,
      },
      {
        name: '圆锥体',
        creator: threeManager.createCone,
        img: new URL('@/assets/images/cone.svg', import.meta.url).href,
      },
      {
        name: '圆环体',
        creator: threeManager.createTorus,
        img: new URL('@/assets/images/torus.svg', import.meta.url).href,
      },
      {
        name: '圆环面',
        creator: threeManager.createTorusKnot,
        img: new URL('@/assets/images/torus-knot.svg', import.meta.url).href,
      },
    ],
  },
}
