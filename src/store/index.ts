import { createPinia } from 'pinia'
import { useCountStore } from './modules/count'
import { useMaterialInfoStore } from './modules/materialInfo'

const store = createPinia()

export default store
export { useCountStore, useMaterialInfoStore }
