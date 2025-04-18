import supabase from "@/services/supabase";
import type { MenuItem } from "./type";

// 获取所有菜单列表
export const fetchMenusApi = async () => {
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error("加载菜单失败");
  return data;
};

// 新增菜单
export const addMenuApi = async (menu: Omit<MenuItem, "id">) => {
  const { error } = await supabase.from("menus").insert([menu]);
  if (error) throw new Error("添加失败");
};

// 更新菜单
export const updateMenuApi = async (menu: MenuItem) => {
  const { error } = await supabase.from("menus").update(menu).match({ id: menu.id });
  if (error) throw new Error("编辑失败");
};

// 删除菜单
export const deleteMenuApi = async (id: number) => {
  // 先删除 role_menus 中所有关联该菜单的记录
  const { error: roleMenuError } = await supabase
    .from("role_menus")
    .delete()
    .eq("menu_id", id);

  if (roleMenuError) throw new Error("删除菜单关联权限失败");

  // 然后删除菜单本身
  const { error: menuError } = await supabase
    .from("menus")
    .delete()
    .match({ id });

  if (menuError) throw new Error("删除菜单失败");
};


// 更新菜单状态
export const updateMenuStatusApi = async (id: number, hidden: boolean) => {
  const { error } = await supabase.from("menus").update({ hidden }).match({ id });
  if (error) throw new Error("更新菜单隐藏状态失败");
};

// 更新菜单排序
export const updateMenuSortOrderApi = async (id: number, sort_order: number) => {
  const { error } = await supabase.from("menus").update({ sort_order }).match({ id });
  if (error) throw new Error("更新排序失败");
};
