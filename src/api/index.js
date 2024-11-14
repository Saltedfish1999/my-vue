import request from "../utils/request";

/**
 * 发送验证码
 */
export const getCode = (data) => {
  return request.post("/get/code", data);
};

/**
 * 注册事件
 */
export const userAuth = (data) => {
  return request.post("/user/authentication", data);
};
/**
 * 登录事件
 */
export const userLogin = (data) => {
  return request.post("/login", data);
};
/**
 * 权限管理
 */
export const authAdmin = (params) => {
  return request.get("/auth/admin", { params });
};
/**
 * 菜单权限数据
 */
export const userGetMenu = () => {
  return request.get("/user/getmenu");
};
/**
 * 权限数据修改
 */
export const userSetMenu = (data) => {
  return request.post("/user/setmenu", data);
};
/**
 * 菜单权限列表
 */
export const menuList = (params) => {
  return request.get("/menu/list", { params });
};
/**
 * 菜单权限下拉
 */
export const menuSelectList = () => {
  return request.get("/menu/selectlist");
};
/**
 * 用户数据修改
 */
export const updateUser = (data) => {
  return request.post("/update/user", data);
};
