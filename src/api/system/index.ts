import supabase from '@/services/supabase';
import type { menus} from './type'

//菜单管理
/*
 * 获取所有菜单
 * @returns {Promise<any[]>} 菜单列表
 */
export const getMenuList = async () => {
    return supabase
        .from("menus")
        .select("*")
        .order("sort_order", { ascending: true });;
};

// 新增/编辑菜单
export const saveMenu = async (data:menus) => {
    if (data.id) {
        // 编辑菜单
        return supabase
           .from("menus")
           .update(data)
           .where({ id: data.id });
    } else {
        // 新增菜单
        return supabase
           .from("menus")
           .insert(data);
    }
}