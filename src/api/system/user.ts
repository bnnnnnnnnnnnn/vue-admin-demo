// src/api/userManagements.ts
import supabase from '@/services/supabase';
import type {  User,Role } from "./type";


// 获取所有用户
export const getUsers = async (page = 1, perPage = 10): Promise<User[]> => {
 const { data, error } = await supabase.auth.admin.listUsers({
   page,
   perPage,
 });

 if (error) {
   console.error("获取用户列表失败", error);
   throw error;
 }

 return data.users.map((user) => ({
   id: user.id,
   email: user.email || "",
   role: user.user_metadata?.role || "未分配",
 }));
};

/**
* 创建用户
*/
export const createUser = async ({ email, password, role }:Partial<User>) => {
 const { data, error } = await supabase.auth.admin.createUser({
   email,
   password,
   user_metadata: { role },
   email_confirm: true, // 是否自动确认邮箱
 });
 if (error) throw error;
 return data.user;
};

/**
* 更新用户角色
*/
export const updateUserRole = async (id: string, role: any[]) => {
 const { error } = await supabase.auth.admin.updateUserById(id, {
   user_metadata: { role },
 });
 if (error) throw error;
};

/**
* 删除用户
*/
export const deleteUser = async (id: string) => {
 const { error } = await supabase.auth.admin.deleteUser(id);
 if (error) throw error;
};


/**
* 修改密码 更新
* 
*/
export const updateAccounts = async (account: User)=>{
 const { data, error } = await supabase.auth.updateUser({
   email: account.email, // 使用用户名作为email
   password: account.password,
 })
 if (error) throw error;
 return data || [];
}

/**
* 获取角色列表
* @returns {Promise<Role[]>}
*/
export const getRoles = async (): Promise<Role[]> => {
 const { data, error } = await supabase.from("roles").select("*");
 if (error) throw error;
 return data || [];
};