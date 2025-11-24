export interface SelectProps {
  multiple?: boolean;
  disabled?: boolean;
  remote?: boolean;
  valueKey?: string;
  labelKey?: string;
  clearable?: boolean;
  placeholder?: string;
  filterable?: boolean;
  remoteMethod: (value: any) => void;
}

export interface OptionProps {
  label?: string;
  value?: any;
  [key: string]: any;
}
