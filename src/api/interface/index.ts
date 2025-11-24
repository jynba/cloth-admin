// ====================================================
// 基础类型
// ====================================================

export interface BasicPageParams {
  limit?: number;
  skip?: number;
  order?: string;
  type?: string;
  include?: string;
  count?: boolean; // true: 返回总数
  where?: WhereParams;
  [propName: string]: any;
}

interface WhereParams {
  [key: string]: any;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

// ====================================================
// 1. Auth / 登录相关
// ====================================================

export interface LoginParams {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ResetPasswordParams {
  user_id: number;
  new_password: string;
}

export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
}

export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

// ====================================================
// 2. 用户 User
// ====================================================

export interface User {
  id: number;
  username: string;
  phone: string;
  real_name?: string;
  role: 1 | 2; // 1: 店长, 2: 师傅
  status: 0 | 1; // 0: 禁用, 1: 启用
  created_at?: string;
  updated_at?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserCreateParams {
  username: string;
  password: string;
  phone: string;
  real_name?: string;
  role: 1 | 2;
}

export interface UserUpdateParams {
  username?: string;
  phone?: string;
  real_name?: string;
  role?: 1 | 2;
  status?: 0 | 1;
}

// ====================================================
// 3. 企业 Company
// ====================================================

export interface Company {
  id: number;
  name: string;
  address?: string;
  status: 0 | 1;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyListResponse {
  data: Company[];
  total?: number;
}

export interface CompanyCreateParams {
  name: string;
  address?: string;
  status?: 0 | 1;
}

export interface CompanyUpdateParams {
  name?: string;
  address?: string;
  status?: 0 | 1;
}

// ====================================================
// 4. 部门 Department（树形结构）
// ====================================================

export interface Department {
  id: number;
  name: string;
  parent_id?: number | null;
  company_id?: number;
  children?: Department[];
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentListResponse {
  data: Department[];
}

export interface DepartmentCreateParams {
  name: string;
  parent_id?: number | null;
  company_id?: number;
}

export interface DepartmentUpdateParams {
  name?: string;
  parent_id?: number | null;
}

// ====================================================
// 5. 客户 Customer
// ====================================================

export interface Customer {
  id: number;
  name: string;
  phone: string;
  customer_type: 1 | 2; // 1: 个人, 2: 企业
  company_id?: number;
  department_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerListResponse {
  data: Customer[];
  total?: number;
}

export interface CustomerCreateParams {
  name: string;
  phone: string;
  customer_type?: 1 | 2;
  company_id?: number;
  department_id?: number;
}

// ====================================================
// 6. 量体 Measurement
// ====================================================

export interface MeasurementData {
  [key: string]: any;
}

export interface Measurement {
  id: number;
  company_id?: number;
  department_id?: number;
  customer_id?: number;
  customer_name?: string;
  customer_phone?: string;
  template_id?: number;
  data: MeasurementData;
  created_at?: string;
  updated_at?: string;
}

export interface MeasurementCreateParams {
  company_id?: number;
  department_id?: number;
  customer_id?: number;
  customer_name?: string;
  customer_phone?: string;
  template_id?: number;
  data: MeasurementData;
}

export interface OrderDetail {
  id: number;
  measure_data: MeasurementData;
  final_data?: MeasurementData;
  price?: number;
}

export interface MeasurementResponse extends OrderDetail {}

// ====================================================
// 7. 订单 Order
// ====================================================

export interface Order {
  id: number;
  order_no: string;
  customer: Customer;
  tailor?: Tailor;
  total_amount: number;
  order_status: number;
  measurement_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderCreateParams {
  measurement_id: number;
}

export interface OrderSearchParams {
  query: string;
}

export interface OrderStatusUpdateParams {
  status: number;
}

export interface OrderExportParams {
  status?: number;
  company_id?: number;
  tailor_id?: number;
  query?: string;
}

// ====================================================
// 8. 量体模板 Template
// ====================================================

export interface MeasureTemplate {
  id: number;
  name: string;
  type: 1 | 2; // 1: 个人, 2: 企业
  category?: string;
  specifications?: string[];
  default_data?: MeasurementData;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateListResponse {
  data: MeasureTemplate[];
  total?: number;
}

export interface TemplateCreateParams {
  name: string;
  type: 1 | 2;
  category?: string;
  specifications?: string[];
  default_data?: MeasurementData;
}

export interface TemplateUpdateParams {
  name?: string;
  type?: 1 | 2;
  category?: string;
  specifications?: string[];
  default_data?: MeasurementData;
}

// ====================================================
// 9. 二维码 QRCode
// ====================================================

export interface QRCode {
  id: number;
  code: string;
  company_id?: number;
  department_id?: number;
  tailor_id?: number;
  status: 0 | 1;
  created_at?: string;
  updated_at?: string;
}

export interface QRCodeListResponse {
  data: QRCode[];
  total?: number;
}

export interface QRCodeCreateParams {
  company_id?: number;
  department_id?: number;
  tailor_id?: number;
}

export interface QRCodeStats {
  id: number;
  code: string;
  scan_count: number;
  unique_scan_count: number;
  last_scanned_at?: string;
}

export interface QRCodeStatsResponse extends QRCodeStats {}

// ====================================================
// 10. 师傅 Tailor
// ====================================================

export interface Tailor {
  id: number;
  real_name: string;
  phone: string;
  work_number?: string;
  level?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TailorListResponse {
  data: Tailor[];
  total?: number;
}

export interface TailorCreateParams {
  real_name: string;
  phone: string;
  work_number?: string;
  level?: number;
  user_id?: number;
}

export interface TailorUpdateParams {
  real_name?: string;
  phone?: string;
  work_number?: string;
  level?: number;
}

export interface TailorProfile extends Tailor {
  // 可选：与旧权限体系兼容
  role?: 1 | 2;
  roles?: Array<{ permissions?: string[] }>;
}

export interface TailorProfileResponse extends TailorProfile {}

export interface TailorPerformance {
  tailor_id: number;
  total_orders: number;
  completed_orders: number;
  total_amount: number;
  average_rating?: number;
  period?: string;
}

export interface TailorPerformanceResponse extends TailorPerformance {}
