<template>
  <el-select
    v-model="state.node"
    class="w-full"
    clearable
    filterable
    remote
    :remote-method="remote"
    :disabled="disabled"
    :placeholder="txt"
    @change="changeValue"
  >
    <el-option v-for="opt of state.list" :key="opt.id" :label="opt.name" :value="opt.id"></el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { getCompanyList, getDepartmentList } from '@/api/app';
import { computed, reactive } from 'vue';

defineOptions({
  name: 'OrzSelect',
});
const props = defineProps({
  nodeId: {
    type: String,
  },
  item: {
    type: Object,
    default: () => ({}), // 用于接收当前选择的组织对象
  },
  type: {
    type: String as PropType<OrzType>, // 根据类型来判断需要查询的组织
  },
  txt: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:nodeId', 'update:item']);
// type OrzType =  1 | 2 | 3 | 4;
type OrzType = 'Company' | 'Department';
const nodeIdCmp = computed(() => props.nodeId);
const state = reactive({
  list: [] as any,
  node: nodeIdCmp.value,
});
// 监听type，发生改变置空当前值
watch(
  () => props.type,
  (newVal, oldVal) => {
    if (!newVal) {
      state.list = [];
    } else if (newVal && newVal !== oldVal) {
      remote();
    }
  },
);
// 监听选择的id，当id为空时置空
watch(
  () => props.nodeId,
  (val) => {
    state.node = val;
    if (!val) {
      state.node = undefined;
      state.list = [];
      remote();
    }
  },
  {
    deep: true,
  },
);

onMounted(() => {
  remote();
});

const remoteNode = async (api: any, query?: string) => {
  let totalData = [];
  const { Result } = await api(undefined, {
    name_contains: query && query !== ' ' ? query : undefined,
    limit: 100,
  });
  totalData = Result ?? [];

  // 如果列表中不存在，则单独再查一追加到列表中展示
  const findIdx = totalData.findIndex((item) => item.id === props.nodeId);
  const unHas: boolean = findIdx === -1;
  console.log(unHas, 'unhas');
  // if (props.nodeId && unHas) {
  //   const reShowData = await api(props.nodeId);
  //   totalData = totalData.concat(reShowData);
  // }
  state.list = totalData;
  emit('update:item', state.list[findIdx]); // 初始加载即可获取除id外其他item数据
};

const remote = async (query?: string) => {
  switch (props.type) {
    case 'Company':
      remoteNode(getCompanyList, query);
      break;
    case 'Department':
      remoteNode(getDepartmentList, query);
      break;
  }
};

const changeValue = () => {
  emit('update:nodeId', state.node);
  emit(
    'update:item',
    state.list.find((item: any) => item.id === state.node),
  );
};
</script>

<style lang="scss" scoped></style>
