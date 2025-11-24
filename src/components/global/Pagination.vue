<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    class="pagination"
    :background="background"
    :layout="layout"
    :page-sizes="pageSizes"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Pagination',
});
const props = defineProps({
  total: {
    required: true,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
  skip: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array<number>,
    default: () => [10, 50, 100, 500],
  },
  layout: {
    type: String,
    // default: () => 'total, sizes, prev, pager, next, jumper',
    default: () => 'total, sizes, prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:page', 'update:limit', 'pagination', 'update:skip']);
// 默认第一页
const DEFAULT_PAGE = 1;

const currentPage = computed({
  get: () => {
    return props.page;
  },
  set: (val) => {
    emit('update:page', val);
  },
});

const pageSize = computed({
  get: () => {
    return props.limit;
  },
  set: (val) => {
    emit('update:limit', val);
  },
});
// 将用户切换页面逻辑和程序的切换逻辑隔离开，相互不影响
const handleSizeChange = (pageSize: number) => {
  // 页数改变时，重置页码为第一页
  currentPage.value = DEFAULT_PAGE;
  onChangePagination(DEFAULT_PAGE, pageSize);
};
const handleCurrentChange = (page: number) => {
  onChangePagination(page, pageSize.value);
};
const onChangePagination = (page: number, limit: number) => {
  const skip = useSkip(page, limit);
  emit('pagination', { page, limit, skip });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};

const useSkip = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  emit('update:skip', skip);
  return skip;
};
</script>

<style lang="scss" scoped></style>
