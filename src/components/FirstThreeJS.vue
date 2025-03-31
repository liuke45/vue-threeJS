<!-- <template>
  <div ref="threeJSElementRef" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let threeJSElementRef = ref<HTMLElement | null>(null);
const scene: THREE.Scene = new THREE.Scene(); //创建一个三维场景
const mouse2D: THREE.Vector2 = new THREE.Vector2(); // 鼠标向量
const mouse3D: THREE.Vector3 = new THREE.Vector3();
const raycaster: THREE.Raycaster = new THREE.Raycaster(); // 创建射线
let currentIntersected: null | THREE.Object3D = null; // 记录当前获取的物体对象
let isRunning: Boolean = false; // 记录是否正在进行动画

/**
 * 创建楼梯间
 * @param stepOption 楼梯参数对象 { 深, 宽, 高, 数量, 颜色 }
 * @param beamOption 横梁参数对象 { 宽, 长度, 厚度 }
 * @param platformOption 平台参数对象 { 宽, 长度, 厚度 }
 * @param wellWidth 井宽
 * @return 整个模型
 */
 const setModel = (
  stepOption: { step_deep: number; step_width: number; step_height: number; step_number: number; step_color: number; },
  beamOption: { beam_width: number; beam_length: number; beam_deep: number },
  platformOption: { platform_width: number; platform_length: number; platform_deep: number },
  wellWidth: number
): THREE.Group => {
  const {
    step_deep,
    step_width,
    step_height,
    step_number,
    step_color
  } = stepOption;
  const {
    beam_width,
    beam_length,
    beam_deep
  } = beamOption;
  const {
    platform_width,
    platform_length,
    platform_deep
  } = platformOption;

  const step1 = createStepGeometry(
    step_width,
    step_height,
    step_deep,
    step_number,
    false,
    [0, 0, 0],
    step_color
  );
  const step2 = createStepGeometry(
    step_width,
    step_height,
    step_deep,
    step_number,
    true,
    [step_deep * step_number, 0, wellWidth + step_width],
    step_color
  );

  const stepNumberTimesDepth = step_deep * step_number;
  const wellWidthPlusStepWidth = (step_width * 2) + wellWidth;

  const box1 = createBoxGeometry(
    beam_width,
    beam_deep,
    beam_length,
    [
      stepNumberTimesDepth + beam_width / 2,
      step_height * step_number + beam_deep / 2,
      wellWidthPlusStepWidth / 2
    ],
    0xfefe6b
  );
  const box2 = createBoxGeometry(
    beam_width,
    beam_deep,
    beam_length,
    [
      -beam_width / 2,
      step_height * step_number + beam_deep / 2,
      wellWidthPlusStepWidth / 2
    ],
    0xfefe6b
  );
  const box3 = createBoxGeometry(
    platform_width,
    platform_deep,
    platform_length,
    [
      -platform_width / 2 - beam_width,
      step_height * step_number + beam_deep / 2 + platform_deep / 2,
      wellWidthPlusStepWidth / 2
    ],
    0x6cffff
  );
  const box4 = createBoxGeometry(
    platform_width,
    platform_deep,
    platform_length,
    [
      stepNumberTimesDepth + beam_width + platform_width / 2,
      step_height * step_number + beam_deep / 2 + platform_deep / 2,
      wellWidthPlusStepWidth / 2
    ],
    0x6cffff
  );
  const box5 = createBoxGeometry(
    stepNumberTimesDepth,
    beam_deep,
    10,
    [
      stepNumberTimesDepth / 2,
      step_height * step_number + beam_deep / 2,
      wellWidthPlusStepWidth / 2
    ],
    0x6b6bfe
  );

  const group = new THREE.Group();
  group.add(step1, step2, box1, box2, box3, box4, box5);

  const wrapperBox = new THREE.Box3();
  wrapperBox.setFromObject(group);
  const center = new THREE.Vector3();
  wrapperBox.getCenter(center);
  group.position.set(-center.x, -center.y, -center.z);
  return group;
};

function createStepGeometry(
  width: number,
  height: number,
  deep: number,
  number: number,
  isReverse: boolean,
  position: number[],
  color: number
): THREE.Mesh {
  const shape = new THREE.Shape();
  let temperPosition: number[] = [0, 0];
  shape.moveTo(0, 0);
  for (let i = 0; i < number; i++) {
    shape.lineTo(0 + temperPosition[0], height + 10 + height * i);
    shape.lineTo((isReverse ? -1 : 1) * (deep + deep * i), height + 10 + height * i );
    temperPosition = [ (isReverse ? -1 : 1) * deep + temperPosition[0],  temperPosition[1] + height ];
  }
  shape.lineTo(temperPosition[0], temperPosition[1]);
  shape.lineTo(0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: width });
  const colors = [color, color, color, color, color, color]
  const materials = []
  for (let i = 0; i < colors.length; i++) {
    materials.push(new THREE.MeshLambertMaterial({ color: colors[i] }))
  }
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.position.set(position[0], position[1], position[2]);
  return mesh;
}

/**
 * 创建长方体
 * @param length 长
 * @param width 宽
 * @param height 高
 * @param position 渲染位置
 * @param color 颜色
 * @return 网格模型
 */
function createBoxGeometry(
  length: number,
  width: number,
  height: number,
  position: number[],
  color: number
) {
  const geometry = new THREE.BoxGeometry(length, width, height);
  const colors = [color, color, color, color, color, color]
  const materials = []
  for (let i = 0; i < colors.length; i++) {
    materials.push(new THREE.MeshLambertMaterial({ color: colors[i] }))
  }
  const cube = new THREE.Mesh(geometry, materials);
  cube.position.set(position[0], position[1], position[2]);
  return cube;
}

// 楼梯间模型函数
const modelGroup = setModel(
  {
    step_deep: 20,
    step_width: 80,
    step_height: 20,
    step_number: 10,
    step_color: 0xff0000
  },
  {
    beam_length: 240,
    beam_width: 50,
    beam_deep: 20,
  },
  {
    platform_length: 240,
    platform_width: 50,
    platform_deep: 10,
  },
  100
)

scene.add(modelGroup);

const renderLight = () => {
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

// 鼠标移动
renderer.domElement.addEventListener("pointermove", (event: MouseEvent) => {
  mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse2D, camera); // 通过相机和鼠标位置更新射线
  const intersects = raycaster.intersectObjects(scene.children); // 通过射线检测当前焦点是否有物体
  if (currentIntersected) {
    currentIntersected.object.material[
      currentIntersected.face.materialIndex
    ].color.set(currentIntersected._originColor);
    currentIntersected = null;
  }
  if (intersects.length > 0) {
    // 触碰变颜色
    currentIntersected = intersects[0];
    currentIntersected._originColor =
      currentIntersected.object.material[
        intersects[0].face.materialIndex
      ].color.getHex();
    currentIntersected.object._originColor =
      currentIntersected.object.material[
        intersects[0].face.materialIndex
      ].color.getHex();
    currentIntersected.object.material[
      intersects[0].face.materialIndex
    ].color.set(0xffffff); // 改变颜色
  }
});

// 鼠标按下
renderer.domElement.addEventListener("mousedown", (event: MouseEvent) => {
  event.preventDefault()
  setMousePosition(event)
  raycaster.setFromCamera(mouse2D, camera); // 通过相机和鼠标位置更新射线
  const intersects = raycaster.intersectObjects(scene.children); // 通过射线检测当前焦点是否有物体
  if (intersects.length > 0) {
    intersects[0].object.getWorldPosition(mouse3D);
    const pos2 = mouse3D.clone().addScalar(30);
    isRunning = true;
    createCameraTween(pos2, mouse3D);
  }
});

// 鼠标抬起
renderer.domElement.addEventListener("mouseup", (event: MouseEvent) => {
  isRunning = false;
  event.preventDefault()
  setMousePosition(event)
  raycaster.setFromCamera(mouse2D, camera); // 通过相机和鼠标位置更新射线
  const intersects = raycaster.intersectObjects(scene.children); // 通过射线检测当前焦点是否有物体
  if (intersects.length > 0) {
    intersects[0].object.getWorldPosition(mouse3D);
    createCameraTween(camera.position, mouse3D);
  }
});

const createCameraTween = (endPos: THREE.Vector3, endTarget: THREE.Vector3) => {
  new TWEEN.Tween({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    tx: controls.target.x,
    ty: controls.target.y,
    tz: controls.target.z,
  })
    .to(
      {
        // 动画结束相机位置坐标
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        // 动画结束相机指向的目标观察点
        tx: endTarget.x,
        ty: endTarget.y,
        tz: endTarget.z,
      },
      1000
    )
    .onUpdate(function (obj: any) {
      camera.position.set(obj.x, obj.y, obj.z); // 动态改变相机位置
      controls.update(); //内部会执行.lookAt()
    })
    .start();
};

const renderAnimate = () => {
  threeJSElementRef?.value?.appendChild(renderer.domElement); // 添加画布
  if (!isRunning) {
    TWEEN.removeAll();
    isRunning = false;
  }
  TWEEN.update();
  requestAnimationFrame(renderAnimate);
  renderer.render(scene, camera);
};

onMounted(() => {
  renderAnimate();
});
</script>

<style scoped>

</style> -->
<template>
  <div />
</template>
