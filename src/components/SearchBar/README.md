# 说明文档

## SearchBar 组件的 props

| 属性名               | 说明                              | 类型               |
| -------------------- | --------------------------------- | ------------------ |
| options              | 搜索项配置                        | FormDataOptions[]  |
| operates             | 右侧操作按钮配置项目              | FormDAtaOperates[] |
| rowAttrs             | element-plus el-row 的 props      | RowProps           |
| formAttrs            | element-plus el-form 组件的 props | FormProps          |
| isExpandButtonEnable | 是否显示展开管理按钮              | Boolean            |
| isInitExpand         | 默认是否展开                      | Boolean            |

## FormDataOptions

| 字段名                | 说明                                    | 类型                  |
| --------------------- | --------------------------------------- | --------------------- |
| field                 | 表单项的数据字段键名                    | string                |
| extraField            | 表单项的额外数据字段键名                | string                |
| label                 | 表单项的文字 label                      | string                |
| value                 | 表单项初始值                            | any                   |
| colAttrs              | element-plus el-col 组件的 props        | ColProps              |
| formItemAttrs         | element-plus el-form-item 组件的 props  | FormItemProps         |
| inputAttrs            | element-plus el-input 组件的 prop       | FormProps             |
| selectAttrs           | element-plus el-select 组件的 prop      | SelectProps           |
| optionAttrs           | element-plus el-option 组件的 prop      | OptionProps           |
| datePickerAttrs       | element-plus el-date-picker 组件的 prop | DataPickerProps       |
| remoteDataSelectAttrs | 组件 RemoteDataSelect 的 props          | RemoteDataSelectProps |
| children              | 组件 RemoteDataSelect 的 props          | FormDataOptions       |

## FormDataOperates

| 字段名       | 说明                                   | 类型         |
| ------------ | -------------------------------------- | ------------ |
| operate      | 操作的唯一 key 不能重复                | string       |
| text         | 按钮的文字                             | string       |
| buttonAttrs  | element-plus 的 el-button 组件的 props | ButtonProps  |
| ButtonEvents | element-plus 的 el-button 组件的 事件  | ButtonEvents |
