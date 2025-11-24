import 'element-plus/es/components/message-box/style/css';
import { ElMessageBox } from 'element-plus';

export function confirm(message: any, title: string, options?: any) {
  return ElMessageBox.confirm(message, title, options);
}

export function prompt(message: any, title: string, options?: any) {
  return ElMessageBox.prompt(message, title, options);
}
