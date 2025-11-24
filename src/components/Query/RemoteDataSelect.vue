<template>
  <el-select
    ref="selectRef"
    v-model="selectValue"
    class="w-full"
    clearable
    filterable
    remote
    :remote-method="remote"
    @change="change"
  >
    <slot :list="mergelist">
      <el-option v-for="item in mergelist" :key="item.id" :label="item[labelKey]" :value="item[valueKey]"> </el-option>
    </slot>
  </el-select>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { omitByValues } from '@/utils/tools';
import { useCurrentItem } from './hooks/useCurrentItem';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  api: {
    type: Function as PropType<(undefined, params: any) => Promise<any>>,
    default: () => Promise.resolve({ Results: [] }),
  },
  detailApi: {
    type: Function as PropType<(id: string, params: any) => Promise<any>>,
    default: () => Promise.resolve({ Result: {} } as any),
  },
  searchKey: {
    type: String,
    default: 'name',
  },
  labelKey: {
    type: String,
    default: 'name',
  },
  valueKey: {
    type: String,
    default: 'id',
  },
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const emit = defineEmits(['update:modelValue', 'change']);
const list = ref<any[]>([]);
const selectValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
const selectRef = ref();

const remote = async (query?: string) => {
  currentQuery.value = query || '';
  const { Results } = await props.api(
    undefined,
    omitByValues({
      [props.searchKey]: query?.trim(),
      ...props.params,
    }),
  );
  list.value = Results || [];
};

const change = async (value) => {
  await nextTick();
  emit('change', value, getItem());
};

const currentQuery = ref('');
const { mergelist } = useCurrentItem({
  list,
  currentSelect: selectValue,
  currentQuery,
  https: ref(props.detailApi),
  key: props.valueKey,
});

watch(
  () => props.params,
  () => {
    remote();
  },
  {
    immediate: true,
    deep: true,
  },
);

const getItem = () => {
  const item = mergelist.value.find((item) => item[props.valueKey] === selectValue.value) ?? {};
  return item;
};

const focus = () => {
  return selectRef.value?.focus();
};

const blur = () => {
  return selectRef.value?.blur();
};

defineExpose({
  focus,
  blur,
  getItem,
  mergelist,
});
</script>
