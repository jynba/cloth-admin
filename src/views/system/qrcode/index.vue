<template>
  <div class="table-box">
    <TablePro :query="query" title="二维码管理" @page-next="onPagination" @refresh="load">
      <template #search>
        <SearchBar @open="open" @search="search"></SearchBar>
      </template>
      <template #table-top>
        <el-button type="primary" @click="open">添加</el-button>
      </template>
      <template #table>
        <el-table :data="state.qrCodes" height="100%">
          <el-table-column prop="scene_str" label="scene"> </el-table-column>
          <el-table-column prop="url" label="url">
            <template #default="scope">
              <span v-if="scope.row.device?.name">{{ `${scope.row.url}_deviceName_${scope.row.device?.name}` }}</span>
              <span v-else>{{ scope.row.url }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="carrier.name" label="载体"> </el-table-column>
          <!-- <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status == 'normal' ? 'success' : 'danger'">
              {{ scope.row.status == 'normal' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column> -->
          <!-- <el-table-column prop="cabinet.name" label="绑定名称"> </el-table-column> -->
          <el-table-column prop="device.name" label="绑定名称"> </el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button type="text" @click="check(scope.row)"> 查看 </el-button>
              <!-- <el-button @click="open(scope.row)" type="text"> 编辑 </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <QrImg v-model:visible="state.isShow" :qr-obj="state.toastObj"></QrImg>

    <!-- 弹窗 -->
    <EditDialog v-model:visible="state.isVisible" :params="state.row" @fetch="search"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { EditDialog, SearchBar } from './components';
import { QrCodesApi } from '@/api/system';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';

const { query } = usePagination();
const state = reactive({
  qrCodes: [],
  isVisible: false,
  isShow: false,
  row: {},
  toastObj: {},
  menus: [
    {
      name: '二维码管理',
      path: '/system/qrcode',
    },
  ],
});

const load = async () => {
  await QrCodesApi({
    limit: query.limit,
    skip: query.skip,
  }).then((res) => {
    state.qrCodes = res.results;
    query.total = res.count;
  });
};

onMounted(() => {
  load();
});

const onPagination = () => {
  load();
};

const open = (row?: any) => {
  state.row = row ? { ...row } : {};
  state.isVisible = true;
};
const search = (form?: any) => {
  query.where = useSearchParams(form);
  load();
};
const check = (row) => {
  state.isShow = true;
  let url = '';
  if (row.device?.name) {
    url = row.url + '_deviceName_' + row.device?.name;
  } else {
    url = row.url;
  }
  state.toastObj = { type: 'qrcode', url };
};
</script>

<style lang="scss" scoped></style>
