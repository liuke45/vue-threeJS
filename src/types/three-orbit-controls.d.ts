import * as THREE from 'three'

declare module 'three/examples/jsm/controls/OrbitControls' {
  interface OrbitControls {
    target: THREE.Vector3
  }
}
