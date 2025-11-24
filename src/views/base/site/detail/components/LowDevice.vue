<template>
  <div class="table-box">
    <TablePro :query="query" @page-next="onPagination">
      <template #table>
        <el-table :data="state.list">
          <el-table-column prop="name" label="设备编号"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, managerStatus).tag">
                {{ handleTableFilterArr(scope.row.status, managerStatus).label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="可用柜门/总柜门">
            <template #default="scope">
              <p>{{ `${scope.row.free_locker_count}/${scope.row.locker_count} ` }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="created_at" label="创建时间"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="160" align="center">
            <template #default="scope">
              <el-button v-auth="['locker:r']" @click="GoTo(scope.row.id)"> 查看 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
  </div>
</template>

<script lang="ts" setup>
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { handleTableFilterArr, managerStatus } from '@/enums';
import { getDevicesApi } from '@/api/cabinet';

const router = useRouter();
const route = useRoute();
const objectId = computed(() => route.query.id as string);
const { query } = usePagination();
const state = reactive({
  list: [],
});

const load = async () => {
  const { data } = await getDevicesApi(undefined, {
    limit: query.limit,
    skip: query.skip,
    site_id: objectId.value,
  });
  state.list = data;
};
load();
const onPagination = () => {
  load();
};

// 查看详情
const GoTo = async (id: string) => {
  router.push({
    path: '/cabinet/lockersDetail',
    query: { id },
  });
};
</script>

<style lang="scss" scoped></style>
