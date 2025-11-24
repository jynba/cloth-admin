<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="resource tb-flex">
    <subMenu v-if="menus.length" :menus="menus" />
    <slot v-if="state.searchVisible" name="search" />
    <div v-loading="isLoading" class="tb tb-flex bg-border">
      <div class="tb-top">
        <p class="tb-top-txt">{{ title }}</p>
        <div class="flex items-center">
          <slot name="table-top" />
          <!-- 暂时不用 -->
          <!--   <el-tooltip effect="dark" content="刷新表格" placement="top-start">
            <div class="icon" @click="$emit('refresh')"> <i-ep-refresh class="text-white" /> </div>
          </el-tooltip>
          <el-tooltip v-if="searchBtn" effect="dark" content="折叠搜索栏" placement="top-start">
            <div class="icon" @click="searchFun()"> <i-ep-search class="text-white" /> </div>
          </el-tooltip> -->
        </div>
      </div>
      <slot name="table" />
    </div>
    <Pagination
      v-if="pageVisible"
      v-model:page="query.page"
      v-model:limit="query.limit"
      v-model:skip="query.skip"
      class="pagination bg-border"
      :total="total"
      @pagination="$emit('pageNext')"
    />
  </div>
</template>

<script lang="ts" setup>
import { isLoading } from '@/hooks/elementPlus/useLoading';

defineOptions({
  name: 'TablePro', // 全局表格布局样式
});

const props = withDefaults(defineProps<Props>(), {
  query: () => ({} as any),
  menus: () => [] as Menus[],
  pageVisible: true,
});
defineEmits(['pageNext', 'refresh']);
const pageVisible = toRef(props, 'pageVisible');
// 暂时不用
// const searchFun = () => {
//   state.searchVisible = !state.searchVisible;
// };

interface Menus {
  name: string;
  path: string;
}
interface Props {
  query?: any; // 分页查询
  title?: string;
  total?: number;
  menus?: Menus[]; // 支持传菜单
  pageVisible?: boolean;
}
const state = reactive({
  searchVisible: true,
});
</script>

<style lang="scss" scoped>
.resource {
  box-sizing: border-box;
  overflow-x: hidden;
  box-shadow: 0 0 12px #0000000d;
  background-color: #f0f2f5;

  .tb-top {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    &-txt {
      font-size: 18px;
      color: #333333;
    }
  }

  .icon {
    margin-left: 5px;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    background-color: var(--el-color-primary);
  }

  .tb {
    overflow-x: hidden;
    padding: 0 20px;
  }

  .pagination {
    padding: 15px 0 15px 15px;
  }

  .bg-border {
    background: $bg-panel;
  }
}

.tb-flex {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

:deep(.el-table__fixed) {
  z-index: 1000;
}
</style>
