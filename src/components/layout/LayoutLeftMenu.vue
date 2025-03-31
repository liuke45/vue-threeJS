<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  index: string
  title: string
  icon?: string
  path: string
  children?: MenuItem[]
}

const router = useRouter()
const route = useRoute()

// 使用ref存储菜单项，只在组件挂载时计算一次
const menuItems = ref<MenuItem[]>([])

// 计算当前激活的菜单项
const activeIndex = computed(() => {
  const currentRoute = route.name as string
  return currentRoute || 'dashboard'
})

// 处理菜单点击事件
const handleMenuSelect = (index: string) => {
  router.push({ name: index })
}

// 动态渲染图标组件 - 使用缓存避免重复创建组件
const iconCache = new Map()
const renderIcon = (icon: any) => {
  if (!icon) return null
  // 如果图标已经是组件，直接返回
  if (typeof icon === 'object') return icon

  // 检查缓存
  if (iconCache.has(icon)) {
    return iconCache.get(icon)
  }

  // 尝试从Element Plus图标库加载
  try {
    const component = defineAsyncComponent(() =>
      import(`@element-plus/icons-vue`).then((mod) => mod[icon as keyof typeof mod]),
    )
    // 存入缓存
    iconCache.set(icon, component)
    return component
  } catch (error) {
    console.error('图标加载失败:', error)
    return null
  }
}

// 在组件挂载时初始化菜单
onMounted(() => {
  // 过滤出需要在菜单中显示的路由
  menuItems.value = router.options.routes
    .filter((route) => route.meta?.showInMenu !== false && route.name)
    .map((route) => {
      return {
        index: route.name as string,
        title: route.meta?.title || route.name,
        icon: route.meta?.icon,
        path: route.path,
        children: route.children
          ?.filter((child) => child.meta?.showInMenu !== false)
          .map((child) => ({
            index: child.name as string,
            title: child.meta?.title || child.name,
            path: route.path === '/' ? `/${child.path}` : `${route.path}/${child.path}`,
          })),
      } as MenuItem
    })
})
</script>

<template>
  <el-scrollbar>
    <el-menu :default-active="activeIndex" router @select="handleMenuSelect">
      <!-- 遍历生成菜单项 -->
      <template v-for="item in menuItems" :key="item.index">
        <!-- 有子菜单的项目 -->
        <el-sub-menu v-if="item.children && item.children.length" :index="item.index">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="renderIcon(item.icon)" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.index"
            :index="child.index"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子菜单的项目 -->
        <el-menu-item v-else :index="item.index">
          <el-icon v-if="item.icon">
            <component :is="renderIcon(item.icon)" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
