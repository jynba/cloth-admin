<!--
 * @Author: pengjiaoli
 * @Date: 2023-12-14 10:50:31
 * @LastEditTime: 2024-12-13 09:31:36
 * @LastEditors: Please set LastEditors
-->
<template>
  <el-cascader
    v-model="state.selectedOptions"
    :size="size"
    placeholder="请选择省市"
    :filterable="filterable"
    :options="pcTextArrAll"
    @change="onHandleChange"
  />
</template>

<script lang="ts" setup>
import areaJson from './area.json';
// import { convertPMCData, convertPMData } from '@/utils/area';
import { reactive, watch } from 'vue';

defineOptions({
  name: 'AreaSelect',
});

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  size: {
    type: String,
    default: 'large',
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    // 二级：'city',三级：'region'
    default: 'city',
  },
});

const emit = defineEmits(['update:modelValue']);

const state = reactive({
  selectedOptions: [] as string[],
});

watch(
  () => props.modelValue,
  (val) => {
    if (val?.length) {
      if (val[1] === '市辖区') val[1] = val[0];
      state.selectedOptions = val;
    }
  },
  {
    immediate: true,
  },
);
const pcTextArrAll = ref([]);
onMounted(() => {
  pcTextArrAll.value = areaJson.regionData;
});

const onHandleChange = (value) => {
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped></style>
