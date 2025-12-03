<template>
  <div class="admins-box">
    <div class="mb-3 flex items-center justify-between">
      <div class="text-base font-medium">公司员工</div>
      <div class="flex items-center gap-2">
        <el-input
          v-model="state.search"
          placeholder="搜索客户名/手机号"
          clearable
          @clear="onSearch"
          @keyup.enter.native="onSearch"
          style="width: 240px"
        />
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </div>
    </div>

    <el-table :data="state.list" height="100%" style="min-height: 300px">
      <el-table-column prop="name" label="客户名称" min-width="160" />
      <el-table-column prop="phone" label="手机号" min-width="140" />
      <el-table-column prop="customer_type" label="类型" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.customer_type === 2 ? 'warning' : 'success'">
            {{ scope.row.customer_type === 2 ? '企业' : '个人' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="scope">{{ format(scope.row.created_at) }}</template>
      </el-table-column>
    </el-table>

    <div class="mt-3 flex justify-end">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="state.limit"
        :current-page="state.page"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue';
import { getCustomerByCompany } from '@/api/app';
import { format } from '@/utils/dateUtil';

const props = defineProps<{ companyId: number | string }>();

const state = reactive({
  fullList: [] as any[],
  list: [] as any[],
  total: 0,
  page: 1,
  limit: 20,
  search: '',
});

const applyFilterAndPaginate = () => {
  const keyword = (state.search || '').trim();
  const filtered = state.fullList.filter((item: any) => {
    if (!keyword) return true;
    return String(item.name || '').includes(keyword) || String(item.phone || '').includes(keyword);
  });
  state.total = filtered.length;
  const start = (state.page - 1) * state.limit;
  state.list = filtered.slice(start, start + state.limit);
};

const fetchList = async () => {
  if (!props.companyId) {
    state.fullList = [];
    applyFilterAndPaginate();
    return;
  }
  const res: any = await getCustomerByCompany(Number(props.companyId), {
    company_id: Number(props.companyId),
  });
  const data = res?.data ?? res?.Result ?? [];
  state.fullList = data;
  applyFilterAndPaginate();
};

const onSearch = () => {
  state.page = 1;
  applyFilterAndPaginate();
};

const onSizeChange = (size: number) => {
  state.limit = size;
  state.page = 1;
  applyFilterAndPaginate();
};

const onPageChange = (page: number) => {
  state.page = page;
  applyFilterAndPaginate();
};

watch(
  () => props.companyId,
  () => {
    state.page = 1;
    fetchList();
  },
);

onMounted(() => fetchList());
</script>

<style scoped>
.admins-box {
  padding: 8px 0;
}
</style>
