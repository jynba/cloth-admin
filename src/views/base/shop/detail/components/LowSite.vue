<template>
  <div>
    <TablePro :total="state.count" :query="query" @page-next="onPagination" @refresh="loadSite()">
      <template #table>
        <el-table :data="state.list">
          <el-table-column fixed="left" prop="name" label="网点名称" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, managerStatus)?.tag">
                {{ handleTableFilterArr(scope.row.status, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
            <template #default="scope">
              {{ formatUnix(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column v-auth="['site:r']" label="操作" fixed="right" align="center" width="120">
            <template #default="scope">
              <el-button @click="goTo(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
  </div>
</template>

<script lang="ts" setup>
import { handleTableFilterArr, managerStatus } from '@/enums';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { getSitesApi } from '@/api/app';
import { formatUnix } from '@/utils/dateUtil';

const route = useRoute();
const objectId = computed(() => route.query.id as string);
const { query } = usePagination({ limit: 50 });
const router = useRouter();

const state = reactive({
  list: [],
  count: 0,
});
// 获取网点
const loadSite = async () => {
  startLoading();
  const params = {
    limit: query.limit,
    skip: query.skip,
    parent_id: objectId.value,
    ...query.where,
  };
  const { data, count } = await getSitesApi(undefined, params).finally(() => endLoading());
  state.list = data;
  state.count = count;
};
loadSite();
const onPagination = () => {
  loadSite();
};
// 详情
const goTo = async (id: string) => {
  router.push({ path: '/base/siteDetail', query: { id } });
};
</script>

<style lang="scss" scoped></style>
