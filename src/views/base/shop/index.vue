<template>
  <div class="table-box">
    <TablePro :total="state.count" :query="query" title="商户管理" @page-next="onPagination" @refresh="fetchShops">
      <template #search>
        <GlobalSearch
          ref="searchRef"
          :page-name="pageName"
          :keep-alive="true"
          class="searchbar"
          :options="searchBarOptions"
          @search="search"
        ></GlobalSearch>
      </template>
      <template #table-top>
        <el-button v-auth="['shop:c']" class="btn" type="primary" @click="open()">添加</el-button>
      </template>
      <template #table>
        <el-table :data="state.list" height="100%" style="min-height: 400px">
          <el-table-column prop="name" label="商户名称"> </el-table-column>
          <el-table-column prop="node.parent.name" label="上级合作商"> </el-table-column>
          <el-table-column prop="contact" label="联系人"></el-table-column>
          <el-table-column prop="phone" label="联系方式"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, managerStatus).tag">
                {{ handleTableFilterArr(scope.row.status, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="支付配置">
            <template #default="{ row }">
              {{ handleTableFilterArr(row.mch, payChannelList)?.label }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
              {{ format(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="200">
            <template #default="scope">
              <el-button v-auth="['shop:u']" @click="editRow(scope.row)">编辑</el-button>
              <el-button v-auth="['shop:pay']" @click="editPayConfig(scope.row)">支付配置</el-button>
              <el-button v-auth="['shop:business']" @click="editBusinessConfig(scope.row)">业务配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <!-- 弹窗 -->
    <EditDialog ref="dialogRef" :params="state.row" @fetch="search"></EditDialog>
    <SetPayChannel ref="setPayChannelRef" :params="state.row" @fetch="search"></SetPayChannel>
    <BusinessConfig ref="businessConfigRef" :params="state.row" @fetch="search"></BusinessConfig>
  </div>
</template>

<script lang="ts" setup>
import { BusinessConfig, EditDialog, SetPayChannel } from './components';
import { format } from '@/utils/dateUtil';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { getShopsApi } from '@/api/app';
import type { ShopForm } from './types';
import { handleTableFilterArr, managerStatus, payChannelList } from '@/enums';
import { useSearchBar } from '../model/useSearchBar';

const pageName = 'Shop';
const { searchBarOptions } = useSearchBar(pageName, 'Shop', 'Agent');
const searchRef = ref();
const { query } = usePagination({ limit: 50 });
const dialogRef = ref();
const setPayChannelRef = ref();
const businessConfigRef = ref();
const state = reactive({
  list: [] as ShopForm[],
  row: {} as ShopForm,
  count: 0,
});

const fetchShops = async () => {
  const { Result, Count } = await getShopsApi(undefined, {
    limit: query.limit,
    skip: query.skip,
    // parent_id: objectId?.value ?? undefined,
    ...query.where,
  });
  state.list = Result;
  state.count = Count;
};

const fetchData = () => {
  const formData = searchRef.value?.getFormData() || {};
  search(formData);
};

onMounted(() => {
  fetchData();
});

const onPagination = () => {
  fetchShops();
};

const editPayConfig = (row) => {
  state.row = row;
  setPayChannelRef.value.visible = true;
};

/** 业务配置 */
const editBusinessConfig = (row) => {
  state.row = row;
  businessConfigRef.value.visible = true;
};

const open = () => {
  dialogRef.value.visible = true;
  state.row = {} as ShopForm;
};

const search = (form) => {
  query.where = useSearchParams(form);
  query.page = 1;
  query.skip = 0;
  fetchShops();
};

const editRow = (row) => {
  state.row = { ...row };
  dialogRef.value.visible = true;
};
</script>

<style lang="scss" scoped></style>
