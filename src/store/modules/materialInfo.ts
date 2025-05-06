import { defineStore } from 'pinia'
import type { MaterialInfoInterface } from './types'
import { MaterialInfo } from '@/views/Three/constants/materialMap'

export const useMaterialInfoStore = defineStore({
  id: 'materialInfo',
  state: (): MaterialInfoInterface => {
    return {
      show: false,
      info: {} as MaterialInfo,
    }
  },
  getters: {
    show: (state) => {
      return state.show
    },
    info: (state) => {
      return state.info
    },
  },
  actions: {
    setShow(show: boolean) {
      this.show = show
    },
    setInfo(info: MaterialInfo, show = true) {
      this.info = info
      this.show = show
    },
  },
})
