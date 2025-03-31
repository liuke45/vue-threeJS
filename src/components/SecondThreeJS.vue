<!-- <template>
  <div ref="threeJSElementRef" />
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import * as THREE from "three";
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

const setModel =  (width:number, height:number, depth:number) => {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]
  const materials = []
  for (let i = 0; i < colors.length; i++) {
    materials.push(new THREE.MeshLambertMaterial({ color: colors[i] }))
  }
  const cube = new THREE.Mesh(geometry, materials)
  cube.position.set(0, 0, 0)
  return cube
}
const model = setModel(100, 100, 100)

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

const renderCamera = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 2000); //创建一个透视相机，窗口宽度，窗口高度
  //设置相机位置
  camera.position.set(350, 350, 350);
  //设置相机方向
  camera.lookAt(0, 0, 0);
  return camera;
};
const camera = renderCamera(); // 相机对象

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
    console.log(intersects[0])
    const { object, normal } = intersects[0]
    mousedown.value = true
    controls.enabled = false;
    pushObject = object
    pushFace = normal
  }
});

// 鼠标移动
renderer.domElement.addEventListener("pointermove", (event: MouseEvent) => {
  event.preventDefault()
  setMousePosition(event)
  raycaster.setFromCamera(mouse2D, camera); // 通过相机和鼠标位置更新射线
  const intersects = raycaster.intersectObjects(scene.children); // 通过射线检测当前焦点是否有物体
  if (currentIntersected && !mousedown.value) {
    const materialIndex = currentIntersected.face.materialIndex
    currentIntersected.object.material[materialIndex].color.set(currentIntersected._originColor);
    currentIntersected = null;
  }
  if (intersects.length > 0 && !mousedown.value) {
    const materialIndex = intersects[0].face.materialIndex
    currentIntersected = intersects[0];
    currentIntersected._originColor = currentIntersected.object.material[materialIndex].color.getHex();
    currentIntersected.object._originColor = currentIntersected.object.material[materialIndex].color.getHex();
    currentIntersected.object.material[materialIndex].color.set(0xffffff); // 改变颜色
  }
  if(mousedown.value) {
    const {x, y, z } = new THREE.Vector3(mouse2D.x, mouse2D.y, 0).unproject(camera)
    mousemove.x = x
    mousemove.y = y
    mousemove.z = z

    if(intersects.length > 0) {
      const { object } = intersects[0]
      pushObject = object
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
      const target = pushObject // 获取目标
      const { width, height, depth } = target.geometry.parameters // 获取尺寸
      const { x, y, z } = target.position // 获取位置
      if(pushFace.x != 0) {
        let XDirection = pushFace.x > 0 ? 1 : -1 // 正负方向
        let addDirection = newValueX > oldValueX ? XDirection * 1 : XDirection * -1 // 正负方向
        if(target.scale.x+0.05 * addDirection < 0.1) return // 防止小于0.1
        target.scale.x += 0.05 * addDirection // 修改尺寸
        target.position.set(x + XDirection*((width* 0.05)/2 * addDirection), y, z) // 修改位置
      }
      if(pushFace.y != 0 && target.scale.y > 0.1) {
        let YDirection = pushFace.y > 0 ? 1 : -1
        let addDirection = newValueY > oldValueY ? YDirection * 1 : YDirection * -1
        if(target.scale.y + 0.05 * addDirection < 0.1) return
        target.scale.y += 0.05 * addDirection
        target.position.set(x, y + YDirection*((height* 0.05)/2 * addDirection), z)
      }
      if(pushFace.z != 0 && target.scale.z > 0.1) {
        let ZDirection = pushFace.z > 0 ? 1 : -1
        let addDirection = newValueZ > oldValueZ ? ZDirection * 1 : ZDirection * -1
        if(target.scale.z + 0.05 * addDirection < 0.1) return
        target.scale.z += 0.05 * addDirection
        target.position.set(x, y , z + ZDirection*((depth* 0.05)/2 * addDirection))
      }
    }
  }
)

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
