import type {
  AutocompleteProps,
  CheckboxProps,
  ColProps,
  DatePickerProps,
  FormItemProps,
  InputNumberProps,
  InputProps,
} from 'element-plus';
import type { OptionProps, SelectProps } from './selectProps';
import type { RemoteDataSelectProps } from '@/components/RemoteDataSelect/src/types/index';
import type { VNode } from 'vue';

export enum ComponentNameEnum {
  input = 'input',
  select = 'select',
  datePicker = 'date-picker',
  remoteDataSelect = 'remote-data-select',
  autocomplete = 'autocomplete',
  checkbox = 'checkbox',
  inputNumber = 'inputNumber',
  upload = 'upload',
}
export interface ExtraField {
  field: string;
  value?: any;
}
export interface FormDataOptions {
  field?: string; // 当filed 为undefined 时 代表当前项仅仅是用来占位的
  timeField?: ExtraField[];
  extraField?: ExtraField[];
  label?: string;
  value?: any;
  // 其中render函数和componentName 至少需要传递一个 render函数得优先级高于componentName
  render?: (option: FormDataOptions, form?: Recordable<string>) => VNode;
  componentName?: ComponentNameEnum;
  colAttrs?: Partial<ColProps>;
  formItemAttrs?: Partial<FormItemProps>;
  attrs?: Partial<
    | InputProps
    | SelectProps
    | DatePickerProps
    | RemoteDataSelectProps
    | AutocompleteProps
    | CheckboxProps
    | InputNumberProps
  >;
  options?: Partial<OptionProps>[];
  onChange?: (value: any, form: Recordable) => void;
  onInput?: (value: any, form: Recordable) => void;
  onSelect?: (value: any, form: Recordable) => void;
  pageName?: string;
  keepAlive?: boolean;
  keepNotAliveField?: string[];
  visible?: boolean;
}
