import request from '@/utils/service'
export interface reqOneDayWordRes {
  msg: string
}

export const reqOneDayWord = () => {
  return request<never, reqOneDayWordRes>({
    url: '/api/yiyan/api.php?id=88888888&key=88888888',
    method: 'GET',
    // interceptors: {
    //   requestInterceptors(res) {
    //     return res
    //   },
    //   responseInterceptors(result) {
    //     return result
    //   },
    // },
  })
}
