export interface PageQuery {
  page: number;
  limit: number;
  skip: number;
  total: number;
  where: any;
}
export interface StatusList{
  label: string;
  value: string | number | boolean;
  tag?: 'success' | 'danger' | 'info' | 'warning' | 'primary';
  disabled?: boolean;
}
