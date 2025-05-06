import { useMaterialInfoStore } from '@/store/modules/materialInfo'

export const useMaterialInfoForm = () => {
  const { show, info } = useMaterialInfoStore()

  return {
    show,
    info,
  }
}
