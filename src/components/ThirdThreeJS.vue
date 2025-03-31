<!-- <template>
  <div ref="threeJSElementRef" />
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import * as THREE from "three";
import _ from 'lodash'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Position {
  x: number;
  y: number;
  z: number;
}

const body: HTMLElement | null = document.querySelector('body')
const threeJSElementRef = ref<HTMLElement | null>(null);
const scene = new THREE.Scene(); //创建一个三维场景
const mouse2D = new THREE.Vector2(); // 鼠标向量
const raycaster = new THREE.Raycaster(); // 创建射线
let currentIntersected: null | THREE.Object3D = null; // 记录当前获取的物体对象
let mousedown = ref(false); // 鼠标是否按下中
let mousemove:Position = reactive({x: 0, y: 0, z: 0}); // 鼠标是否移动位置
let pushObject: null | THREE.Object3D = null // 按下的目标
let pushFace:Position = reactive({x: 0, y: 0, z: 0}) // 按下的目标面
const geometry_index = { // 针对每个面的索引位置下标
  0: '0-18',  // 背面
  3: '0-18',
  6: '18-36', // 底面
  9: '18-36',
  12: '36-54', // 左面
  15: '36-54',
  18: '54-63', // 右面
  21: '63-72', // 前面
  24: '72-81', // 顶面
  27: '81-90', // 切面
}

const setModel = () => {
  const geometry = new THREE.BufferGeometry();

  //类型化数组创建顶点数据
  const vertices = new Float32Array([
    0, 0, 0, // 背面
    100, 0, 0,
    100, 100, 0,

    0, 0, 0,
    100, 100, 0,
    0, 100, 0,

    0, 0, 100, // 底面
    100, 0, 100,
    100, 0, 0,

    0, 0, 100,
    100, 0, 0,
    0, 0, 0,

    0, 0, 100, // 左面
    0, 0, 0,
    0, 100, 0,

    0, 0, 100,
    0, 100, 0,
    0, 100, 100,

    100, 0, 100, // 右面
    100, 0, 0,
    100, 100, 0,

    0, 0, 100, // 前面
    100, 0, 100,
    0, 100, 100,

    0, 100, 100, // 顶面
    100, 100, 0,
    0, 100, 0,

    0, 100, 100, // 切面
    100, 0, 100,
    100, 100, 0,

    // 0, 100, 100,  // 切面拉伸后前面第一个面
    // 100, 0, 100,
    // 100, 0, 100,

    // 0, 100, 100,
    // 100, 0, 100,
    // 0, 100, 100,

    // 100, 100, 0,  // 顶面第一个面
    // 0, 100, 100,
    // 0, 100, 100,

    // 100, 100, 0,
    // 0, 100, 100,
    // 100, 100, 0,

    // 100, 0, 100, // 右边第一个面
    // 100, 100, 0,
    // 100, 100, 0,

    // 100, 0, 100,
    // 100, 100, 0,
    // 100, 0, 100
  ]);

  // 创建每个面的颜色数组
  const colors = new Float32Array([
      1, 0, 0, // 背面
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      0, 1, 0, // 底部
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 0, 1, // 左面
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      1, 0, 0, // 右部
      0, 0, 1,
      0, 0, 1,

      1, 1, 1, // 前侧
      0, 1, 0,
      0, 0, 1,

      1, 0, 0, // 顶侧
      0, 1, 0,
      0, 0, 1,

      1, 0, 0, // 横切
      0, 1, 0,
      0, 0, 1,

      // 1, 0.5, 1,  // 拉伸切面后前面的面
      // 1, 0.5, 1,
      // 1, 0.5, 1,

      // 1, 0.5, 1,
      // 1, 0.5, 1,
      // 1, 0.5, 1,

      // 0.5, 1, 1,  // 拉伸切面后上面的面
      // 0.5, 1, 1,
      // 0.5, 1, 1,

      // 0.5, 1, 1,
      // 0.5, 1, 1,
      // 0.5, 1, 1,

      // 1, 1, 0.5,  // 拉伸切面后右面的面
      // 1, 1, 0.5,
      // 1, 1, 0.5,

      // 1, 1, 0.5,
      // 1, 1, 0.5,
      // 1, 1, 0.5,
  ]);

  // 每个面的顶点坐标索引
  const indices = new Uint16Array([
    0, 1, 2, // 背面
    3, 4, 5,

    6, 7, 8, // 底面
    9, 10, 11,

    12, 13, 14, // 左面
    15, 16, 17,

    18, 19, 20, // 右面

    21, 22, 23, // 前面

    24, 25, 26, // 顶面

    27, 28, 29, // 切面

    // 30, 31, 32, // 拉伸切面后前面的面
    // 33, 34, 35,

    // 36, 37, 38,
    // 39, 40, 41,

    // 42, 43, 44,
    // 45, 46, 47,
  ])

  // 每个面的法向量
  let normals = new Float32Array([
    0, 0, -1, // 背面
    0, 0, -1,
    0, -1, 0, // 底面
    0, -1, 0,
    -1, 0, 0, // 左面
    -1, 0, 0,
    1, 0, 0, // 右面
    0, 0, 1, // 前面
    0, 1, 0, // 顶面
    1, 1, 1, // 切面
    // 0, 0, 0, // 拉伸切面后前面的面
    // 0, 0, 0,
    // 0, 0, 0, // 拉伸切面后上面的面
    // 0, 0, 0,
    // 0, 0, 0, // 拉伸切面后右面的面
    // 0, 0, 0,
  ]);
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));// 将面的索引属性添加到 BufferGeometry
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0, 0)
  return cube
}

const model = setModel()
scene.add(model);

const renderLight = () => {
  // 光源
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const light = new THREE.DirectionalLight(0xffffff); //平行光源，color:灯光颜色，intensity:光照强度
  scene.add(ambient);
  light.position.set(100, 300, 0);
  scene.add(light);
};
renderLight();

const renderCamera = (position:Array<number>, lookAt:Array<number>):THREE.Camera => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 2000); //创建一个透视相机，窗口宽度，窗口高度
  const [x, y, z] = position
  camera.position.set(x, y, z); //设置相机位置
  const [xx, yy, zz] = lookAt
  camera.lookAt(xx, yy, zz);//设置相机方向
  return camera;
};
const camera = renderCamera([350, 350, 350], [0, 0, 0]); // 相机对象

//创建辅助坐标轴
// const axesHelper = new THREE.AxesHelper(1000);//参数200标示坐标系大小，可以根据场景大小去设置
// scene.add(axesHelper);

//创建一个WebGL渲染器
const renderRenderControls = () => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染区尺寸
  return renderer;
};
const renderer = renderRenderControls(); // 渲染器对象

// 渲染鼠标控件函数
const renderControls = () => {
  const controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
  controls.enableDamping = false; //设置惯性
  controls.addEventListener("change", () => {
    renderer.render(scene, camera); //监听鼠标，键盘事件
  });
  return controls;
};
const controls = renderControls(); // 鼠标控件对象

const setMousePosition = (event: MouseEvent) => {
  mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// 鼠标按下
renderer.domElement.addEventListener("mousedown", (event: MouseEvent) => {
  event.preventDefault()
  setMousePosition(event)
  raycaster.setFromCamera(mouse2D, camera); // 通过相机和鼠标位置更新射线
  const intersects = raycaster.intersectObjects(scene.children); // 通过射线检测当前焦点是否有物体
  if (intersects.length > 0) {
    const { object } = intersects[0]
    const {a, b, c} = intersects[0].face
    let normal = { x: 0, y: 0, z: 0}
    normal.x = object.geometry.getAttribute('normal').array[a]
    normal.y = object.geometry.getAttribute('normal').array[b]
    normal.z = object.geometry.getAttribute('normal').array[c]
    mousedown.value = true
    controls.enabled = false;
    pushObject = intersects[0]
    pushFace = normal
  }
});

// 鼠标移动
renderer.domElement.addEventListener("pointermove", (event: MouseEvent) => {
  event.preventDefault()
  setMousePosition(event)
  raycaster.setFromCamera(mouse2D, camera); // 通过相机和鼠标位置更新射线
  const intersects = raycaster.intersectObjects(scene.children); // 通过射线检测当前焦点是否有物体
  let color: Array<number> = []
  if (currentIntersected && !mousedown.value) {
    currentIntersected.object.geometry.setAttribute('color', currentIntersected._originColor)
    currentIntersected.object.geometry.needsUpdate = true;
    currentIntersected = null;
    color = []
  }
  if (intersects.length > 0 && !mousedown.value) { // 鼠标移动中但是没有按下鼠标
    currentIntersected = intersects[0];
    color = _.cloneDeep(currentIntersected.object.geometry.getAttribute('color').array)
    currentIntersected._originColor = currentIntersected.object.geometry.getAttribute('color')
    const indexKeys = Object.keys(geometry_index).map(Number)
    for(let i = 0; i < indexKeys.length; i++) {
      if(currentIntersected.face.a === indexKeys[i]) {
        const range = geometry_index[indexKeys[i]].split('-').map(Number)
        const start = range[0]
        const end = range[1]
        for(let j = start; j < end ; j++) {
          color[j] = 9
        }
      }
    }

    currentIntersected.object.geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
    currentIntersected.object.geometry.needsUpdate = true;
  }
  if(mousedown.value) {
    const {x, y, z } = new THREE.Vector3(mouse2D.x, mouse2D.y, 0).unproject(camera)
    mousemove.x = x
    mousemove.y = y
    mousemove.z = z

    if(intersects.length > 0) {
      // pushObject = intersects[0]
      if (body !== null) body.style.cursor = 'move'
    }
  }
});

// 鼠标抬起
renderer.domElement.addEventListener("mouseup", (event: MouseEvent) => {
  event.preventDefault()
  controls.enabled = true
  if (body !== null) body.style.cursor = 'default'
  mousedown.value = false
});

watch( // 监听鼠标按下后拖动的位置进行修改
  [() => mousemove.x, () => mousemove.y, () => mousemove.z],
  ([newValueX, newValueY, newValueZ], [oldValueX, oldValueY, oldValueZ])=> {
    if(mousedown.value) {
      drawObject([newValueX, newValueY, newValueZ, oldValueX, oldValueY, oldValueZ])
    }
  }
)

const drawObject = (arr: number[]): void => {
  const [newValueX, newValueY, newValueZ, oldValueX, oldValueY, oldValueZ] = arr
  const target = pushObject // 获取目标
  const face = pushObject.face
  const needChangePosition: Record<number, number> = {} // 记录需要改变坐标对象
  for(let key in geometry_index) {
    if(face.a === Number(key)) {
      const range = geometry_index[key].split('-').map(Number)
      const start = range[0]
      const end = range[1]
      for(let j = start; j < end ; j++) {
        needChangePosition[j] = target.object.geometry.getAttribute('position').array[j]
      }
    }
  }

  let clonePosition = _.cloneDeep(target.object.geometry.getAttribute('position').array)
  const keys = Object.keys(needChangePosition)
  const length = keys.length

  // 将needChangePosition数组分成三个三个一组的数组
  // const splitArray_needChangePosition = []
  // for(let i = 0; i < length; i += 3) {
  //   splitArray_needChangePosition.push(Object.values(needChangePosition).slice(i, i + 3))
  // }

  const splitArray_needChangePosition = Array.from(
    { length: length / 3 },
    (_, i) => Object.values(needChangePosition).slice(i * 3, i * 3 + 3)
  );

  // 将clonePosition数组分成三个三个一组的数组
  const splitArray_clonePosition = Array.from(
    { length: clonePosition.length / 3 },
    (_, i) => Object.values(clonePosition).slice(i * 3, i * 3 + 3)
  );

  // 将splitArray_needChangePosition数组与splitArray_clonePosition数组进行对比，找出相同的坐标数组
  const sameArray: Record<number, number> = {} // 点击面那些点肯定是要的，找到其他面相同的点加进去 这是个对象
  for(let i = 0; i < splitArray_needChangePosition.length; i++) {
    for(let j = 0; j < splitArray_clonePosition.length; j++) {
      const flag = splitArray_needChangePosition[i].every((value, index) => value === splitArray_clonePosition[j][index])
      if(flag) { // 如果相等
        sameArray[j * 3] = splitArray_clonePosition[j][0]
        sameArray[j * 3 + 1] = splitArray_clonePosition[j][1]
        sameArray[j * 3 + 2] = splitArray_clonePosition[j][2]
      }
    }
  }

  const sameArray_keys:any = Object.keys(sameArray).map(Number)
  const sameArray_Length = sameArray_keys.length
  const {x, y, z} = pushFace
  // 代码有优化空间
  // 1.只考虑拖拽方向与被拖拽面的方向点积是否大于0
  // 2.不考虑点击面法向量
  if(x != 0 && y == 0 && z == 0) {
    const XDirection = pushFace.x > 0 ? 1 : -1 // 正负方向
    const addDirection = newValueX > oldValueX ? XDirection * 1 : XDirection * -1 // 正负方向
    for(let i = 0; i < sameArray_Length; i += 3) {
      if(clonePosition[3] - clonePosition[0] +  3 * addDirection < 10) return // 判断底边最小长度
      clonePosition[sameArray_keys[i]] +=  3 * addDirection * pushFace.x
    }
  }
  if(y != 0 && x == 0 && z == 0) {
    const YDirection = pushFace.y > 0 ? 1 : -1
    const addDirection = newValueY > oldValueY ? YDirection * 1 : YDirection * -1
    for(let i = 1; i < sameArray_Length; i += 3) {
      if(clonePosition[7] - clonePosition[4] +  3 * addDirection < 10) return // 防止小于10
      clonePosition[sameArray_keys[i]] +=  3 * addDirection * pushFace.y
    }
  }
  if(z != 0 && y == 0 && x == 0) {
    const ZDirection = pushFace.z > 0 ? 1 : -1
    const addDirection = newValueZ > oldValueZ ? ZDirection * 1 : ZDirection * -1
    for(let i = 2; i < sameArray_Length; i += 3) {
      if(clonePosition[29] - clonePosition[35] +  3 * addDirection < 10) return // 防止小于10
      clonePosition[sameArray_keys[i]] +=  3 * addDirection * pushFace.z
    }
  }
  if(z !== 0 && y !== 0 && x !== 0) {
    const point1 = new THREE.Vector3(oldValueX, oldValueY, oldValueZ);
    const point2 = new THREE.Vector3(newValueX, newValueY, newValueZ);
    const objectNormal = new THREE.Vector3(x,y,z)
    const vector = point2.clone().sub(point1);// 计算从 point1 到 point2 的向量
    const normalVector = vector.clone().normalize();
    const dotProduct = objectNormal.dot(normalVector) // 两个法向量的点积
    const addDirection = dotProduct > 0 ? 1 : -1
    for(let i = 0; i < sameArray_Length; i++) {
      // 暂时没做限制
      clonePosition[sameArray_keys[i]] +=  3 * addDirection
    }
  }
  pushObject.object.geometry.setAttribute('position', new THREE.BufferAttribute(clonePosition, 3));
  pushObject.object.geometry.needsUpdate = true; // 更新
  pushObject.object.geometry.computeBoundingSphere() // 计算当前几何体的的边界矩形，该操作会更新,不然重新获取不到了
}

const renderAnimate = () => {
  threeJSElementRef?.value?.appendChild(renderer.domElement); // 添加画布
  requestAnimationFrame(renderAnimate);
  renderer.render(scene, camera);
};

onMounted(() => {
  renderAnimate();
});
</script> -->

<template>
  <div />
</template>
