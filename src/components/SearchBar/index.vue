<template>
  <!-- label-width="0px" -->
  <el-form v-bind="formAttrs" ref="formRef" class="w-full" :model="form" @keyup.enter="search">
    <el-row class="pt-2" :gutter="10">
      <!-- 当isExpand 为false时 需要判断item.field是否是有效的 以判断当前el-col是否展示 -->
      <el-col
        v-for="(item, index) in options"
        v-show="(isExpand || (oneLineFormShowNum > index && !isExpand && !!item.field)) && item.visible !== false"
        :key="item.field"
        class="col"
        v-bind="{ ...getColSpanByComponentName(item), ...(item.colAttrs ?? {}) }"
      >
        <!-- :label-width="`${calcFormLabelWidth(item?.label ?? '')}px`" -->
        <el-form-item
          class="form-item"
          :class="item.label ? 'has-label' : ''"
          v-bind="item.formItemAttrs"
          :prop="item.field"
        >
          <template #label>
            <el-tooltip effect="dark" :content="item.label" placement="top-start">
              <div class="form-label truncate">{{ item.label }}</div>
            </el-tooltip>
          </template>
          <component
            :is="item.render(item, form)"
            v-if="!!item.render"
            v-bind="item.attrs"
            v-model="form[item.field!]"
            @change="item?.onChange ? item?.onChange(form[item.field!], form) : null"
          ></component>
          <el-select
            v-else-if="ComponentNameEnum.select === item?.componentName"
            v-model="form[item.field!]"
            class="w-full"
            placeholder="请选择"
            clearable
            v-bind="item?.attrs"
            @change="item?.onChange ? item?.onChange(form[item.field!], form) : null"
          >
            <el-option
              v-for="data in item?.options ?? []"
              v-bind="data"
              :key="item?.attrs?.fieldNames?.value ? data[item?.attrs?.fieldNames?.value] : data.value"
              :label="item?.attrs?.fieldNames?.label ? data[item?.attrs?.fieldNames?.label] : data.label"
              :value="item?.attrs?.fieldNames?.value ? data[item?.attrs?.fieldNames?.value] : data.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-else-if="ComponentNameEnum.input === item?.componentName"
            v-model="form[item.field!]"
            placeholder="请输入"
            clearable
            v-bind="item?.attrs"
            @input="item?.onInput ? item?.onInput(form[item.field!], form) : null"
          ></el-input>
          <el-date-picker
            v-else-if="ComponentNameEnum.datePicker === item?.componentName"
            v-model="form[item.field!]"
            placeholder="选择时间"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            clearable
            v-bind="item?.attrs"
            @change="handleDateRangeChange(item.timeField, $event)"
          ></el-date-picker>
          <RemoteDataSelect
            v-else-if="ComponentNameEnum.remoteDataSelect === item?.componentName"
            v-model="form[item.field!]"
            placeholder="请选择"
            clearable
            v-bind="item?.attrs"
          ></RemoteDataSelect>
          <el-autocomplete
            v-else-if="ComponentNameEnum.autocomplete === item?.componentName"
            v-model="form[item.field!]"
            class="w-full"
            placeholder="请输入"
            clearable
            v-bind="item?.attrs"
            @select="item?.onSelect ? item?.onSelect(form[item.field!], form) : null"
          ></el-autocomplete>
          <el-checkbox
            v-else-if="ComponentNameEnum.checkbox === item?.componentName"
            v-model="form[item.field!]"
            v-bind="item?.attrs"
            @change="item?.onChange ? item?.onChange(form[item.field!], form) : null"
          />
          <el-input-number
            v-else-if="ComponentNameEnum.inputNumber === item?.componentName"
            v-model="form[item.field!]"
            v-bind="item?.attrs"
            @change="item?.onChange ? item?.onChange(form[item.field!], form) : null"
          >
          </el-input-number>
        </el-form-item>
      </el-col>
      <el-col style="flex: 1 1 auto">
        <div class="flex items-center flex-wrap justify-end">
          <SearchButton @search="search" @reset="reset" />
          <div class="ml-4">
            <el-button v-if="isShowExpandButton" link type="primary" @click="flexible">
              <i-ep-arrow-up v-if="isExpand" class="mr-2" />
              <i-ep-arrow-down v-else class="mr-2" />
              {{ isExpand ? '收起' : '展开' }}
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { ExtraField, FormDataOptions } from './types';
import { ComponentNameEnum } from './types';
import { calcCurrentColSpan, getColSpanByComponentName, getColViewPortType } from './utils';
import { useStorageForm } from './useStorageForm';
import type { FormInstance, FormProps } from 'element-plus';
import { useEventListener } from '@/hooks/event/useEventListener';
import { RemoteDataSelect } from '@/components/Query';
import { cloneDeep } from 'lodash-es';
import { dateUtil } from '@/utils/dateUtil';

const props = defineProps({
  // 表单项配置数据
  options: {
    type: Array as PropType<FormDataOptions[]>,
    default: () => {
      return [];
    },
  },
  formAttrs: {
    type: Object as PropType<Partial<FormProps>>,
    default: () => {
      return {};
    },
  },
  // 是否显示展开管理按钮
  isExpandButtonEnable: {
    type: Boolean,
    default: true,
  },
  // 初次渲染是否展开
  isInitExpand: {
    type: Boolean,
    default: true,
  },
  // 页面名称 （设置缓存时必传）
  pageName: {
    type: String,
    default: '',
  },
  // 是否缓存
  keepAlive: {
    type: Boolean,
    default: false,
  },
  // 不需要缓存字段
  keepNotAliveField: {
    type: Array as PropType<string[]>,
    default: () => {
      return [];
    },
  },
});
const emit = defineEmits(['search', 'reset']);
const form = ref<Recordable>({});
const formRef = ref<FormInstance>();
const realPageName = toRef(props, 'pageName');
const { clearItemToForm, setFormToItemSearch, getItemToForm } = useStorageForm(realPageName);

// 计算一行放下的表单项数量
const calcOneLineFormNum = () => {
  let colNum = 0;
  const length = props.options?.length;
  for (let i = 0; i < length; i++) {
    const item = props.options[i];
    colNum += calcCurrentColSpan(item);
    // 之所以是判断大于20，是因为一行是24，搜索的操作按钮需要占位4
    if (colNum > 20) {
      return i;
    }
  }
  return length;
};

// 切换日期控件，设置初始日期和结束日期
const handleDateRangeChange = (timeField, value: any) => {
  if (Array.isArray(timeField) && timeField.length === 2 && Array.isArray(value) && timeField.length === 2) {
    form.value[timeField[0].field] = dateUtil(value[0]).startOf('d').unix();
    form.value[timeField[1].field] = dateUtil(value[1]).add(1, 'd').subtract(1, 's').unix();
    // delete form.value[fields.join(',')];
  }
};

// 计算右侧操作按钮一行能放下的数量
const calcOneLineOperateButtonNum = () => {
  const colType = getColViewPortType();
  if (['xl'].includes(colType)) {
    return 2;
  } else if (['lg'].includes(colType)) {
    return 1;
  } else {
    return 1;
  }
};

// 记录展开收起的状态 true 代表展开
const isExpand = ref(true);
const isShowExpandButton = computed(() => {
  return props.isExpandButtonEnable && oneLineFormShowNum.value < props.options?.length;
});

// 一行能够放多少个表单项
const oneLineFormShowNum = ref(0);
const oneLineButtonShowNum = ref(calcOneLineOperateButtonNum());

// 调整视口宽度时，重新计算一行能够放多少个表单项
const resizeFn = () => {
  initOneLineButtonShowNum();
  oneLineButtonShowNum.value = calcOneLineOperateButtonNum();
};

// 计算一行能够放多少个表单项
const initOneLineButtonShowNum = () => {
  oneLineFormShowNum.value = calcOneLineFormNum();
};

initOneLineButtonShowNum();
const { removeEvent } = useEventListener({
  el: window,
  name: 'resize',
  listener: resizeFn,
});

watch(
  () => props.options,
  () => {
    initOneLineButtonShowNum();
  },
  { deep: true },
);
// 表单项列表，格式：例：[{field: 'name', value: 'xiaotie'}]
const filedList = ref<Record<string, any>[]>([]);

// 序列化表单项列表
const serializeFiled = () => {
  props.options.forEach((item) => {
    filedList.value.push({
      field: item.field,
      value: item.value ?? undefined,
    });
    if (item.extraField && item.extraField.length) {
      item.extraField.forEach((it: ExtraField) => {
        filedList.value.push({
          field: it.field,
          value: it.value ?? undefined,
        });
      });
    }
    if (item.timeField && item.timeField.length) {
      item.timeField.forEach((it: ExtraField) => {
        filedList.value.push({
          field: it.field,
          value: it.value ?? undefined,
        });
      });
    }
  });
};

// 初始化form
const initForm = () => {
  props.options.forEach((item) => {
    if (item.field) {
      form.value[item.field!] = form.value[item.field!] || item.value;
    }
    if (item.extraField && item.extraField.length) {
      item.extraField.forEach((it: ExtraField) => {
        form.value[it.field!] = form.value[it.field!] || it.value;
      });
    }
    if (item.timeField && item.timeField.length) {
      item.timeField.forEach((it: ExtraField) => {
        form.value[it.field!] = form.value[it.field!] || it.value;
      });
    }
  });
  // 删除不需要显示的表单项
  // remove(props.options, (item) => Reflect.has(item, 'visible') && !item?.visible);
  if (props.pageName && props.keepAlive) {
    serializeFiled();
    Object.assign(form.value, getItemToForm());
  }
};
initForm();

// 搜索
const search = (type?: string) => {
  if (props.pageName && props.keepAlive && type !== 'reset') {
    setAliveField();
  }
  emit('search', form.value);
};

// 重置
const reset = () => {
  clearItemToForm();
  props.options.forEach((item) => {
    if (item.field) {
      form.value[item.field!] = item.value || undefined;
    }
    if (item.extraField && item.extraField.length) {
      item.extraField.forEach((it: ExtraField) => {
        form.value[it.field!] = it.value || undefined;
      });
    }
    if (item.timeField && item.timeField.length) {
      item.timeField.forEach((it: ExtraField) => {
        form.value[it.field!] = it.value || undefined;
      });
    }
  });
  emit('reset');
  // formRef.value?.resetFields?.();
  search('reset');
};

// 设置缓存
const setAliveField = () => {
  const copyForm: Recordable = cloneDeep(form.value);
  const notAliveFieldList = props.keepNotAliveField || [];
  notAliveFieldList.forEach((item) => {
    const filedIndex = filedList.value.findIndex((it) => it.field === item);
    if (
      Object.prototype.toString.call(copyForm) === '[object Object]' &&
      Reflect.has(copyForm, item) &&
      filedIndex > -1
    ) {
      copyForm[item] = filedList.value[filedIndex].value;
    }
  });
  setFormToItemSearch(copyForm);
};
// 获取form表单数据
const getFormData = () => {
  return cloneDeep(form.value);
};
// 设置form表单数据
const setFormData = (data) => {
  form.value = Object.assign(form.value, data);
};
onMounted(() => {
  isExpand.value = props.isInitExpand;
});

onUnmounted(() => {
  removeEvent();
});

const flexible = () => {
  isExpand.value = !isExpand.value;
};

defineExpose({
  form,
  getFormData,
  setFormData,
  initForm,
  reset,
  initOneLineButtonShowNum,
  // setAliveField
  // reset1
});
</script>

<style scoped lang="scss">
.form-label {
  max-width: 98px;
}

.form-item {
  :deep {
    .el-form-item__label {
      max-width: 98px;
      padding: 0;
    }
  }
}

.has-label {
  :deep {
    .el-form-item__label {
      padding-right: 12px;
    }
  }
}
</style>
