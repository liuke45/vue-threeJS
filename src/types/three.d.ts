declare module 'three' {
  export * from '@types/three'
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, Object3D } from 'three'

  export class OrbitControls {
    constructor(camera: Camera, domElement?: HTMLElement)
    update(): void
    dispose(): void

    // 添加其他你需要的属性和方法
    enabled: boolean
    target: Object3D
  }
}

// 如果需要其他模块，可以继续添加
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Scene } from 'three'

  export class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void,
    ): void
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void,
    ): void
  }

  export interface GLTF {
    scene: Scene
    scenes: Scene[]
    animations: any[]
    cameras: any[]
    asset: any
  }
}
