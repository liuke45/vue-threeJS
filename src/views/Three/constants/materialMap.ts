import { ThreeManager } from '@/libs/ThreeManager/ThreeManager'
import { Mesh } from 'three'

export interface MaterialInfo {
  key: string
  name: string
  creator: (...args: any) => Mesh
  img: string
  formAttributes: {
    field: string
    label: string
    defaultValue: any
  }[]
}

interface MATERIAL_COMP {
  title: string
  materials: MaterialInfo[]
}

const threeManager = ThreeManager.getInstance()

enum TYPE {
  HOUSE_MATERIAL = 'HOUSE_MATERIAL', // 房建基础
  BASIC = 'BASIC', // 基础构件
}

const basicMaterials = [
  {
    key: 'plane',
    name: '平面',
    creator: threeManager.createPlane,
    img: new URL('@/assets/images/plane.svg', import.meta.url).href,
    formAttributes: [
      { field: 'width', label: '宽度', defaultValue: 1 },
      { field: 'height', label: '高度', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'cube',
    name: '立方体',
    creator: threeManager.createCube,
    img: new URL('@/assets/images/cube.svg', import.meta.url).href,
    formAttributes: [
      { field: 'size', label: '尺寸', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'advanced-cube',
    name: '长方体',
    creator: threeManager.createAdvancedCube,
    img: new URL('@/assets/images/advanced-cube.svg', import.meta.url).href,
    formAttributes: [
      { field: 'width', label: '宽度', defaultValue: 1 },
      { field: 'height', label: '高度', defaultValue: 1 },
      { field: 'depth', label: '深度', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'sphere',
    name: '球体',
    creator: threeManager.createSphere,
    img: new URL('@/assets/images/sphere.svg', import.meta.url).href,
    formAttributes: [
      { field: 'radius', label: '半径', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'cylinder',
    name: '圆柱体',
    creator: threeManager.createCone,
    img: new URL('@/assets/images/cylinder.svg', import.meta.url).href,
    formAttributes: [
      { field: 'radius', label: '半径', defaultValue: 1 },
      { field: 'height', label: '高度', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'cone',
    name: '圆锥体',
    creator: threeManager.createCone,
    img: new URL('@/assets/images/cone.svg', import.meta.url).href,
    formAttributes: [
      { field: 'radius', label: '半径', defaultValue: 1 },
      { field: 'height', label: '高度', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'torus',
    name: '圆环体',
    creator: threeManager.createTorus,
    img: new URL('@/assets/images/torus.svg', import.meta.url).href,
    formAttributes: [
      { field: 'radius', label: '半径', defaultValue: 1 },
      { field: 'tube', label: '管径', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
  {
    key: 'torus-knot',
    name: '圆环面',
    creator: threeManager.createTorusKnot,
    img: new URL('@/assets/images/torus-knot.svg', import.meta.url).href,
    formAttributes: [
      { field: 'radius', label: '半径', defaultValue: 1 },
      { field: 'tube', label: '管径', defaultValue: 1 },
      { field: 'color', label: '颜色', defaultValue: 0xffffff },
    ],
  },
]

export const materialMap: Record<TYPE, MATERIAL_COMP> = {
  [TYPE.HOUSE_MATERIAL]: {
    title: '房建基础',
    materials: [],
  },
  [TYPE.BASIC]: {
    title: '基础构件',
    materials: basicMaterials,
  },
}
