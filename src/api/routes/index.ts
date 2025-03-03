import request  from "@/utils/request";
import type {RouteList} from './type'

enum API {
    USERROULES_URL='/user/routes'
}

// 暴漏请求函数

// 获取动态路由的方法
export const reqUserRoutes=()=>request.get<any,RouteList>(API.USERROULES_URL)