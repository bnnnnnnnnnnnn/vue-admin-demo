import  supabase  from '@/services/supabase';
import type { loginFormEmail,loginFormPhone } from './type';

//登录 邮箱
export const reqLoginEmail = async (data: loginFormEmail): Promise<any> => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    token: authData.session?.access_token || '',
    user: authData.user
  };
};

//登录 手机号
export const reqLoginPhone = async (data: loginFormPhone): Promise<any> => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    phone: data.phone,
    password: data.password
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    token: authData.session?.access_token || '',
    user: authData.user
  };
};

//获取当前登录用户信息
export const reqUserInfo = async (): Promise<any> => {
    // const { data, error } = await supabase.auth.getUser();
  
    // if (error) {
    //   throw new Error(error.message);
    // }
  
    // return {
    //   id: data.user?.id || '',
    //   email: data.user?.email || '',
    //   role: 'user' // 这里可以根据需要定义角色
    // };
  };

//角色权限
// export const reqUserRole = async () => {
//     const { data, error } = await supabase
//       .from('users')
//       .select('role')
//       .eq('id', (await supabase.auth.getUser()).data.user?.id)
//       .single();
  
//     if (error) {
//       throw new Error(error.message);
//     }
  
//     return data.role;
//   };
  