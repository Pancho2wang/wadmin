import { stringify } from 'qs';
import request from '@/utils/request';
import config from '@/config';
const {serverUrl} = config
const method = 'POST'
const {adminUrl} = serverUrl

/**
 * 系统管理-公司管理-列表
 * @param {} body 
 */
export async function queryCompanyList(body) {
  return request(`${adminUrl}/company/list`, {method, body})
}

/**
 * 系统管理-公司管理-获取所有公司
 * @param {} body 
 */
export async function queryAllCompanyList(body) {
  return request(`${adminUrl}/company/allList`, {method, body})
}

/**
 * 系统管理-公司管理-根据ID获取
 * @param {} body 
 */
export async function queryCompanyById(body) {
  return request(`${adminUrl}/company/getOneById`, {method, body})
}

/**
 * 系统管理-公司管理-新增
 * @param {} body 
 */
export async function addCompany(body) {
  return request(`${adminUrl}/company/add`, {method, body})
}

/**
 * 系统管理-公司管理-更新
 * @param {} body 
 */
export async function updateCompany(body) {
  return request(`${adminUrl}/company/update`, {method, body})
}

/**
 * 系统管理-公司管理-删除
 * @param {} body 
 */
export async function deleteCompany(body) {
  return request(`${adminUrl}/company/delete`, {method, body})
}

/**
 * 系统管理-角色管理-列表
 * @param {} body 
 */
export async function queryRoleList(body) {
  return request(`${adminUrl}/role/list`, {method, body})
}

/**
 * 系统管理-角色管理-获取所有角色
 * @param {} body 
 */
export async function queryAllRoleList(body) {
  return request(`${adminUrl}/role/allList`, {method, body})
}

/**
 * 系统管理-角色管理-根据id获取
 * @param {} body 
 */
export async function queryRoleById(body) {
  return request(`${adminUrl}/role/getOneById`, {method, body})
}

/**
 * 系统管理-角色管理-新增
 * @param {} body 
 */
export async function addRole(body) {
  return request(`${adminUrl}/role/add`, {method, body})
}

/**
 * 系统管理-角色管理-更新
 * @param {} body 
 */
export async function updateRole(body) {
  return request(`${adminUrl}/role/update`, {method, body})
}

/**
 * 系统管理-角色管理-删除
 * @param {} body 
 */
export async function deleteRole(body) {
  return request(`${adminUrl}/role/delete`, {method, body})
}

/**
 * 系统管理-用户管理-列表
 * @param {} body 
 */
export async function queryUserList(body) {
  return request(`${adminUrl}/user/list`, {method, body})
}

/**
 * 系统管理-用户管理-根据ID获取
 * @param {} body 
 */
export async function queryUserById(body) {
  return request(`${adminUrl}/user/getOneById`, {method, body})
}

/**
 * 系统管理-用户管理-新增
 * @param {} body 
 */
export async function addUser(body) {
  return request(`${adminUrl}/user/add`, {method, body})
}

/**
 * 系统管理-用户管理-更新
 * @param {} body 
 */
export async function updateUser(body) {
  return request(`${adminUrl}/user/update`, {method, body})
}

/**
 * 系统管理-用户管理-删除
 * @param {} body 
 */
export async function deleteUser(body) {
  return request(`${adminUrl}/user/delete`, {method, body})
}

/**
 * 系统管理-资源管理-列表
 * @param {} body 
 */
export async function queryResourceList(body) {
  return request(`${adminUrl}/resource/list`, {method, body})
}

/**
 * 系统管理-资源管理-获取资源列表
 * 用于下拉选择
 * @param {} body 
 */
export async function queryParentResourceList(body) {
  return request(`${adminUrl}/resource/plist`, {method, body})
}

/**
 * 系统管理-资源管理-根据id获取
 * @param {} body 
 */
export async function queryResourceById(body) {
  return request(`${adminUrl}/resource/getOneById`, {method, body})
}

/**
 * 系统管理-资源管理-新增
 * @param {} body 
 */
export async function addResource(body) {
  return request(`${adminUrl}/resource/add`, {method, body})
}

/**
 * 系统管理-资源管理-更新
 * @param {} body 
 */
export async function updateResource(body) {
  return request(`${adminUrl}/resource/update`, {method, body})
}

/**
 * 系统管理-资源管理-删除
 * @param {} body 
 */
export async function deleteResource(body) {
  return request(`${adminUrl}/resource/delete`, {method, body})
}

/**
 * 系统管理-SQL资源管理-列表
 * @param {} body 
 */
export async function querySQLResourceList(body) {
  return request(`${adminUrl}/sqlresource/list`, {method, body})
}

/**
 * 系统管理-SQL资源管理-列表所有
 * @param {} body 
 */
export async function queryAllSQLResourceList(body) {
  return request(`${adminUrl}/sqlresource/allList`, {method, body})
}

/**
 * 系统管理-SQL资源管理-根据ID获取
 * @param {} body 
 */
export async function querySQLResourceById(body) {
  return request(`${adminUrl}/sqlresource/getOneById`, {method, body})
}

/**
 * 系统管理-SQL资源管理-新增
 * @param {} body 
 */
export async function addSQLResource(body) {
  return request(`${adminUrl}/sqlresource/add`, {method, body})
}

/**
 * 系统管理-SQL资源管理-更新
 * @param {} body 
 */
export async function updateSQLResource(body) {
  return request(`${adminUrl}/sqlresource/update`, {method, body})
}

/**
 * 系统管理-SQL资源管理-删除
 * @param {} body 
 */
export async function deleteSQLResource(body) {
  return request(`${adminUrl}/sqlresource/delete`, {method, body})
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(body) {
  return request(`${adminUrl}/login`, {method, body,});
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
