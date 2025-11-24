import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';

export function success(msg: string) {
  ElMessage.success(msg);
}

export function error(msg: string) {
  ElMessage.error(msg);
}

export function warning(msg: string) {
  ElMessage.warning(msg);
}

export function info(msg: string) {
  ElMessage.info(msg);
}
