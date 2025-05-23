import type { Role } from './type'
import supabase from '@/services/supabase'

/**
 * 获取角色列表
 * @returns {Promise<Role[]>} 返回包含所有角色信息的数组
 */
export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase.from('roles').select('*')
  if (error)
    throw error
  return data || []
}

// 获取角色的菜单权限
export async function getRoleMenus(roleId: number) {
  const { data, error } = await supabase
    .from('role_menus')
    .select('menu_id')
    .eq('role_id', roleId)

  if (error)
    console.error('获取角色菜单失败:', error.message)
  return data || []
}

// 更新角色的菜单权限
export async function updateRoleMenus(roleId: number, menuIds: number[]) {
  // 先删除原有的权限
  await supabase.from('role_menus').delete().eq('role_id', roleId)

  // 插入新的权限
  const { error } = await supabase.from('role_menus').insert(
    menuIds.map(menuId => ({ role_id: roleId, menu_id: menuId })),
  )

  if (error)
    console.error('更新权限失败:', error.message)
}
// 新增角色
export async function addRole(roleName: string, roleDescription: string) {
  const { data, error } = await supabase.from('roles').insert([{ name: roleName, description: roleDescription }]).select('id')

  if (error) {
    console.error('添加角色失败:', error.message)
    return null
  }

  return data[0]
}

// 更新角色
export async function updateRole(roleId: number, roleName: string, roleDescription: string) {
  const { error } = await supabase.from('roles').update({ name: roleName, description: roleDescription }).eq('id', roleId)

  if (error) {
    console.error('更新角色失败:', error.message)
    return false
  }

  return true
}

// 删除角色
// 硬删除角色及其菜单权限
export async function deleteRoleById(roleId: number) {
  // 1. 删除 role_menus 中关联的权限
  const { error: menuLinkError } = await supabase
    .from('role_menus')
    .delete()
    .eq('role_id', roleId)

  if (menuLinkError) {
    throw new Error(`删除角色菜单关联失败: ${menuLinkError.message}`)
  }

  // 2. 删除 roles 表中的角色
  const { error: roleError } = await supabase
    .from('roles')
    .delete()
    .eq('id', roleId)

  if (roleError) {
    throw new Error(`删除角色失败: ${roleError.message}`)
  }

  return true
}
