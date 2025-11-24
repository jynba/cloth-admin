import { defHttp } from '@/utils/http/axios';
import type {
  LoginParams,
  LoginResponse,
  ResetPasswordParams,
  ChangePasswordParams,
  UserListParams,
  UserListResponse,
  UserCreateParams,
  UserUpdateParams,
  CompanyListResponse,
  CompanyCreateParams,
  CompanyUpdateParams,
  DepartmentListResponse,
  DepartmentCreateParams,
  DepartmentUpdateParams,
  CustomerListResponse,
  CustomerCreateParams,
  MeasurementCreateParams,
  MeasurementResponse,
  OrderListParams,
  OrderListResponse,
  OrderCreateParams,
  OrderSearchParams,
  OrderStatusUpdateParams,
  OrderExportParams,
  TemplateListResponse,
  TemplateCreateParams,
  TemplateUpdateParams,
  QRCodeListResponse,
  QRCodeCreateParams,
  QRCodeStatsResponse,
  TailorListResponse,
  TailorCreateParams,
  TailorUpdateParams,
  TailorProfileResponse,
  TailorPerformanceResponse,
} from '../interface';

// ====================================================
// 1. Auth / 登录相关
// ====================================================

enum AuthApi {
  LoginPassword = `/login/password`,
  LoginWeChat = `/login/wechat`,
  AdminResetPassword = `/admin/reset-password`,
  UserChangePassword = `/user/change-password`,
}

/**
 * 密码登录
 */
export const loginWithPassword = (params: LoginParams) =>
  defHttp.post<LoginResponse>({
    url: AuthApi.LoginPassword,
    params,
  });

/**
 * 微信登录
 */
export const loginWithWeChat = (params: { code: string }) =>
  defHttp.post<LoginResponse>({
    url: AuthApi.LoginWeChat,
    params,
  });

/**
 * 管理员重置用户密码
 */
export const adminResetPassword = (params: ResetPasswordParams) =>
  defHttp.post({
    url: AuthApi.AdminResetPassword,
    params,
  });

/**
 * 用户修改密码
 */
export const changePassword = (params: ChangePasswordParams) =>
  defHttp.post({
    url: AuthApi.UserChangePassword,
    params,
  });

// ====================================================
// 2. 用户 User
// ====================================================

enum UserApi {
  AdminUserList = `/admin/users`,
  AdminUserCreate = `/admin/users`,
  AdminUserDetail = `/admin/users`,
  AdminUserUpdate = `/admin/users`,
  AdminUserDelete = `/admin/users`,
}

/**
 * 管理员获取用户列表
 */
export const getUserList = (params: UserListParams) =>
  defHttp.get<UserListResponse>({
    url: UserApi.AdminUserList,
    params,
  });

/**
 * 管理员创建用户
 */
export const createUser = (params: UserCreateParams) =>
  defHttp.post({
    url: UserApi.AdminUserCreate,
    params,
  });

/**
 * 获取用户详情
 */
export const getUserDetail = (id: number) =>
  defHttp.get({
    url: `${UserApi.AdminUserDetail}/${id}`,
  });

/**
 * 管理员更新用户
 */
export const updateUser = (id: number, params: UserUpdateParams) =>
  defHttp.put({
    url: `${UserApi.AdminUserUpdate}/${id}`,
    params,
  });

/**
 * 管理员删除用户
 */
export const deleteUser = (id: number) =>
  defHttp.delete({
    url: `${UserApi.AdminUserDelete}/${id}`,
  });

// ====================================================
// 3. 企业 Company
// ====================================================

enum CompanyApi {
  CompanyList = `/admin/companies`,
  CompanyCreate = `/admin/companies`,
  CompanyDetail = `/admin/companies`,
  CompanyUpdate = `/admin/companies`,
  CompanyDelete = `/admin/companies`,
  CompanyMeasurement = `/admin/companies/measurement`,
}

/**
 * 获取企业列表
 */
export const getCompanyList = (params?: any) =>
  defHttp
    .get<CompanyListResponse>({
      url: CompanyApi.CompanyList,
      params,
    })
    .then((res: any) => ({ Result: res ?? [], Count: res?.total ?? res?.Count ?? res?.length }));

// 兼容旧调用：获取企业（列表或详情）
export const getCompanyApi = (id?: number | string, params?: any) => {
  if (id) {
    return defHttp.get({ url: `${CompanyApi.CompanyDetail}/${id}` });
  }
  return getCompanyList(params);
};

// 兼容旧调用：创建企业
export const postCompanyApi = (params: CompanyCreateParams) =>
  defHttp.post({ url: CompanyApi.CompanyCreate, params }).then((res: any) => ({ Result: res }));

// 兼容旧调用：更新企业
export const putCompanyApi = (id: number | string, params: CompanyUpdateParams) =>
  defHttp.put({ url: `${CompanyApi.CompanyUpdate}/${id}`, params }).then((res: any) => ({ Result: res }));

/**
 * 创建企业
 */
export const createCompany = (params: CompanyCreateParams) =>
  defHttp.post({
    url: CompanyApi.CompanyCreate,
    params,
  });

/**
 * 获取企业详情
 */
export const getCompanyDetail = (id: number) =>
  defHttp.get({
    url: `${CompanyApi.CompanyDetail}/${id}`,
  });

/**
 * 更新企业
 */
export const updateCompany = (id: number, params: CompanyUpdateParams) =>
  defHttp.put({
    url: `${CompanyApi.CompanyUpdate}/${id}`,
    params,
  });

/**
 * 删除企业
 */
export const deleteCompany = (id: number) =>
  defHttp.delete({
    url: `${CompanyApi.CompanyDelete}/${id}`,
  });

/**
 * 小程序师傅获取所属企业列表
 */
export const getTailorCompanyList = () =>
  defHttp.get<CompanyListResponse>({
    url: CompanyApi.CompanyMeasurement,
  });

// ====================================================
// 4. 部门 Department（树形结构）
// ====================================================

enum DepartmentApi {
  DepartmentList = `/departments`,
  DepartmentCreate = `/departments`,
  DepartmentByCompany = `/departments/company`,
  DepartmentDetail = `/departments`,
  DepartmentUpdate = `/departments`,
  DepartmentDelete = `/departments`,
}

/**
 * 获取所有部门（树形）
 */
export const getDepartmentList = (id?: number, params?: any) =>
  id
    ? defHttp.get({ url: `${DepartmentApi.DepartmentDetail}/${id}` }).then((res: any) => ({ Result: res }))
    : defHttp
        .get<DepartmentListResponse>({ url: DepartmentApi.DepartmentList, params })
        .then((res: any) => ({ Result: res?.data ?? res?.Result ?? [], Count: res?.total ?? res?.Count ?? 0 }));

/**
 * 创建部门
 */
export const createDepartment = (params: DepartmentCreateParams) =>
  defHttp.post({
    url: DepartmentApi.DepartmentCreate,
    params,
  });

/**
 * 查询企业下的部门（树形）
 */
export const getDepartmentByCompany = (companyId: number) =>
  defHttp.get<DepartmentListResponse>({
    url: DepartmentApi.DepartmentByCompany,
    params: { company_id: companyId },
  });

/**
 * 获取部门详情
 */
export const getDepartmentDetail = (id: number) =>
  defHttp.get({
    url: `${DepartmentApi.DepartmentDetail}/${id}`,
  });

/**
 * 更新部门
 */
export const updateDepartment = (id: number, params: DepartmentUpdateParams) =>
  defHttp.put({
    url: `${DepartmentApi.DepartmentUpdate}/${id}`,
    params,
  });

/**
 * 删除部门
 */
export const deleteDepartment = (id: number) =>
  defHttp.delete({
    url: `${DepartmentApi.DepartmentDelete}/${id}`,
  });

// ====================================================
// 5. 客户 Customer
// ====================================================

enum CustomerApi {
  CustomerByCompany = `/customers/company`,
  CustomerByDepartment = `/customers/department`,
  CustomerPersonalCreate = `/customers/personal`,
}

/**
 * 获取企业客户
 */
export const getCustomerByCompany = (companyId: number) =>
  defHttp.get<CustomerListResponse>({
    url: `${CustomerApi.CustomerByCompany}/${companyId}`,
  });

/**
 * 根据部门获取客户
 */
export const getCustomerByDepartment = (departmentId: number) =>
  defHttp.get<CustomerListResponse>({
    url: `${CustomerApi.CustomerByDepartment}/${departmentId}`,
  });

/**
 * 创建个人客户
 */
export const createPersonalCustomer = (params: CustomerCreateParams) =>
  defHttp.post({
    url: CustomerApi.CustomerPersonalCreate,
    params,
  });

// ====================================================
// 6. 量体 Measurement
// ====================================================

enum MeasurementApi {
  MeasurementCompanyCreate = `/measurements/company`,
  MeasurementPersonalCreate = `/measurements/personal`,
}

/**
 * 创建企业量体记录
 */
export const createCompanyMeasurement = (params: MeasurementCreateParams) =>
  defHttp.post<MeasurementResponse>({
    url: MeasurementApi.MeasurementCompanyCreate,
    params,
  });

/**
 * 创建个人量体记录
 */
export const createPersonalMeasurement = (params: MeasurementCreateParams) =>
  defHttp.post<MeasurementResponse>({
    url: MeasurementApi.MeasurementPersonalCreate,
    params,
  });

// ====================================================
// 7. 订单 Order
// ====================================================

enum OrderApi {
  OrderList = `/orders`,
  OrderCompanyCreate = `/orders/company`,
  OrderPersonalCreate = `/orders/personal`,
  OrderSearch = `/orders/search`,
  OrderMy = `/orders/my`,
  OrderDetail = `/orders`,
  OrderStatusUpdate = `/orders`,
  OrderExport = `/orders/export`,
}

/**
 * 分页获取订单列表
 */
export const getOrderList = (params: OrderListParams) =>
  defHttp.get<OrderListResponse>({
    url: OrderApi.OrderList,
    params,
  });

/**
 * 基于企业量体生成订单
 */
export const createCompanyOrder = (params: OrderCreateParams) =>
  defHttp.post({
    url: OrderApi.OrderCompanyCreate,
    params,
  });

/**
 * 基于个人量体生成订单
 */
export const createPersonalOrder = (params: OrderCreateParams) =>
  defHttp.post({
    url: OrderApi.OrderPersonalCreate,
    params,
  });

/**
 * 订单搜索
 */
export const searchOrder = (params: OrderSearchParams) =>
  defHttp.post<OrderListResponse>({
    url: OrderApi.OrderSearch,
    params,
  });

/**
 * 获取当前登录师傅的订单
 */
export const getMyOrders = () =>
  defHttp.get<OrderListResponse>({
    url: OrderApi.OrderMy,
  });

/**
 * 订单详情（含量体数据）
 */
export const getOrderDetail = (id: number) =>
  defHttp.get({
    url: `${OrderApi.OrderDetail}/${id}`,
  });

/**
 * 更新订单状态
 */
export const updateOrderStatus = (id: number, params: OrderStatusUpdateParams) =>
  defHttp.put({
    url: `${OrderApi.OrderStatusUpdate}/${id}/status`,
    params,
  });

/**
 * 导出订单
 */
export const exportOrders = (params: OrderExportParams) =>
  defHttp.get<{ download_url: string }>({
    url: OrderApi.OrderExport,
    params,
  });

// ====================================================
// 8. 量体模板 Template
// ====================================================

enum TemplateApi {
  TemplateList = `/templates`,
  TemplateCreate = `/templates`,
  TemplateDetail = `/templates`,
  TemplateUpdate = `/templates`,
  TemplateDelete = `/templates`,
}

/**
 * 获取量体模板列表
 */
export const getTemplateList = () =>
  defHttp.get<TemplateListResponse>({
    url: TemplateApi.TemplateList,
  });

/**
 * 创建模板
 */
export const createTemplate = (params: TemplateCreateParams) =>
  defHttp.post({
    url: TemplateApi.TemplateCreate,
    params,
  });

/**
 * 获取模板详情
 */
export const getTemplateDetail = (id: number) =>
  defHttp.get({
    url: `${TemplateApi.TemplateDetail}/${id}`,
  });

/**
 * 更新模板
 */
export const updateTemplate = (id: number, params: TemplateUpdateParams) =>
  defHttp.put({
    url: `${TemplateApi.TemplateUpdate}/${id}`,
    params,
  });

/**
 * 删除模板
 */
export const deleteTemplate = (id: number) =>
  defHttp.delete({
    url: `${TemplateApi.TemplateDelete}/${id}`,
  });

// ====================================================
// 9. 二维码 QRCode
// ====================================================

enum QRCodeApi {
  QRCodeList = `/qrcodes`,
  QRCodeCreate = `/qrcodes`,
  QRCodeStats = `/qrcodes`,
}

/**
 * 获取二维码列表
 */
export const getQRCodeList = () =>
  defHttp.get<QRCodeListResponse>({
    url: QRCodeApi.QRCodeList,
  });

/**
 * 生成二维码（企业 / 部门 / 师傅）
 */
export const createQRCode = (params: QRCodeCreateParams) =>
  defHttp.post({
    url: QRCodeApi.QRCodeCreate,
    params,
  });

/**
 * 二维码统计
 */
export const getQRCodeStats = (id: number) =>
  defHttp.get<QRCodeStatsResponse>({
    url: `${QRCodeApi.QRCodeStats}/${id}/stats`,
  });

// ====================================================
// 10. 师傅 Tailor
// ====================================================

enum TailorApi {
  TailorList = `/tailors`,
  TailorCreate = `/tailors`,
  TailorDetail = `/tailors`,
  TailorUpdate = `/tailors`,
  TailorDelete = `/tailors`,
  TailorProfile = `/profile`,
  TailorPerformance = `/performance`,
}

/**
 * 获取师傅列表
 */
export const getTailorList = () =>
  defHttp.get<TailorListResponse>({
    url: TailorApi.TailorList,
  });

/**
 * 创建师傅
 */
export const createTailor = (params: TailorCreateParams) =>
  defHttp.post({
    url: TailorApi.TailorCreate,
    params,
  });

/**
 * 获取师傅详情
 */
export const getTailorDetail = (id: number) =>
  defHttp.get({
    url: `${TailorApi.TailorDetail}/${id}`,
  });

/**
 * 更新师傅
 */
export const updateTailor = (id: number, params: TailorUpdateParams) =>
  defHttp.put({
    url: `${TailorApi.TailorUpdate}/${id}`,
    params,
  });

/**
 * 删除师傅
 */
export const deleteTailor = (id: number) =>
  defHttp.delete({
    url: `${TailorApi.TailorDelete}/${id}`,
  });

/**
 * 获取当前登录师傅信息
 */
export const getTailorProfile = () =>
  defHttp.get<TailorProfileResponse>({
    url: TailorApi.TailorProfile,
  });

/**
 * 更新当前登录师傅信息
 */
export const updateTailorProfile = (params: TailorUpdateParams) =>
  defHttp.put({
    url: TailorApi.TailorProfile,
    params,
  });

/**
 * 获取师傅个人业绩统计
 */
export const getTailorPerformance = () =>
  defHttp.get<TailorPerformanceResponse>({
    url: TailorApi.TailorPerformance,
  });
