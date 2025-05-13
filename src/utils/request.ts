// 进行axios 二次封装 ：使用请求与响应拦截
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 第一步：利用axios对象的create方法，去创建axios实例（配置：基础路径，超时的时间
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000, // 超时时间
})
// 第二步 ：添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // config配置对象，headers属性请求头
  // console.log(config);
  config.headers.token = '123'
  // 返回配置对象
  return config
})
// 第三步 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功的回调

    // 返回配置对象
    return response.data
  },
  (error) => {
    // 失败的回调：处理http网络错误
    // 定义一个变量：存储网络错误信息
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    }
    else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    }
    else if (message.includes('Request failed with status code')) {
      message = `系统接口${message.substr(message.length - 3)}异常`
    }
    ElMessage({ message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  },
)
// 最后 对外暴漏
export default request
