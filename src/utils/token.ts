// 封装本地存储数据与读取数据方法
// 存token
export const SET_TOKEN = (token: string) => {
  localStorage.setItem("TOKEN", token);
};
// 获取token
export const GET_TOKEN = ():string => {
  return (localStorage.getItem("TOKEN")as string);
};
/// 删除token
export const REMOVE_TOKEN = () => {
  localStorage.removeItem("TOKEN");
};
