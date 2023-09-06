import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  GetUserInfo = '/user/info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  User = '/user',
  Role = '/role',
  RoleMenu = '/role/role_menu',
}

export function getRoleMenu(params): Promise<any> {
  return defHttp.get({ url: Api.RoleMenu, params });
}

export function addRoleMenu(data): Promise<any> {
  return defHttp.post({ url: Api.RoleMenu, data });
}

export function deleteRoleMenuByRoleId(data): Promise<any> {
  return defHttp.delete({ url: Api.RoleMenu, data });
}

export function getRoleList(params = {}): Promise<any> {
  return defHttp.get({ url: Api.Role, params });
}

export function addRole(data): Promise<any> {
  return defHttp.post<GetUserInfoModel>({ url: Api.Role, data });
}

export function editRole(data): Promise<any> {
  return defHttp.put<GetUserInfoModel>({ url: Api.Role, data });
}

export function getUserList(params): Promise<any> {
  return defHttp.get<GetUserInfoModel>({ url: Api.User, params });
}

export function addUser(data): Promise<any> {
  return defHttp.post<GetUserInfoModel>({ url: Api.User, data });
}

export function editUser(data): Promise<any> {
  return defHttp.put<GetUserInfoModel>({ url: Api.User, data });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(): Promise<any> {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
