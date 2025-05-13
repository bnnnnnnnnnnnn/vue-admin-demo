import type { loginFormEmail, loginFormPhone, MenuItem } from './type'
import supabase from '@/services/supabase'

// 登录 邮箱
export async function reqLoginEmail(data: loginFormEmail): Promise<any> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    token: authData.session?.access_token || '',
    user: authData.user,
  }
}

// 登录 手机号
export async function reqLoginPhone(data: loginFormPhone): Promise<any> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    phone: data.phone,
    password: data.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    token: authData.session?.access_token || '',
    user: authData.user,
  }
}

// 获取当前用户及其角色
export async function reqUserInfo(): Promise<any> {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('获取用户失败:', error)
    return null
  }

  const user = data.user
  // console.log("当前用户:", user);

  // 获取角色信息
  const role = user?.user_metadata?.role || '未分配角色'
  // console.log("用户角色:", role);

  return { user, role }
}

/*
 获取用户菜单
*/
export async function reqMenuList(roleIds: number[]): Promise<MenuItem[]> {
  // 先查询 role_menus 表，获取当前角色的所有 menu_id
  if (!Array.isArray(roleIds) || roleIds.length === 0) {
    console.warn('未传入有效的角色 ID 数组')
    return []
  }
  const { data: roleMenus, error: roleMenusError } = await supabase
    .from('role_menus')
    .select('menu_id')
    .in('role_id', roleIds)

  if (roleMenusError) {
    console.error('获取角色菜单失败:', roleMenusError)
    throw new Error('获取角色菜单失败')
  }

  // 提取 menu_id 数组
  const menuIds = roleMenus.map(item => item.menu_id)

  if (menuIds.length === 0) {
    return [] // 没有菜单权限时返回空数组
  }

  // 再查询 menus 表，获取对应的菜单信息
  const { data: menus, error: menusError } = await supabase
    .from('menus')
    .select('*')
    .in('id', menuIds)
    .order('sort_order', { ascending: true })

  if (menusError) {
    console.error('菜单获取失败:', menusError)
    throw new Error('菜单获取失败')
  }

  return menus
}
