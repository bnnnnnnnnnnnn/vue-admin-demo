// 封装本地存储数据与读取数据方法
// 存token
export function SET_TOKEN(token: string) {
  localStorage.setItem('TOKEN', token)
}
// 获取token
export function GET_TOKEN(): string {
  return localStorage.getItem('TOKEN') as string
}
/// 删除token
export function REMOVE_TOKEN() {
  localStorage.removeItem('TOKEN')
}
