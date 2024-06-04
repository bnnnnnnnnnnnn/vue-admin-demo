// 封装获取时间函数
// 根据登录时间返回早上|上午|下午|晚上
export const getTime = () => {
  let massage = "";
  const hours = new Date().getHours();
  if (hours < 9) {
    massage = "早上";
  } else if (hours < 14) {
    massage = "中午";
  } else if (hours < 18) {
    massage = "下午";
  } else {
    massage = "晚上";
  }
  return massage
};
