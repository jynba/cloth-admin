<template>
  <div class="table-box">
    <TablePro :data-length="state.list" title="收费规则" :query="query" @page-next="onPagination" @refresh="loadRules">
      <template #table-top>
        <el-button class="btn" type="primary" @click="open()">添加</el-button>
      </template>
      <template #table>
        <el-table :data="state.list">
          <el-table-column type="expand">
            <template #default="props">
              <div class="pl-50px">
                <div>
                  <span>清柜时间：{{ minuteToHours(props.row.cost.end_time) }}</span>
                  <span class="ml-25px">超时时长：{{ `${props.row.cost.owing_time}分钟` }}</span>
                </div>
                <div v-if="![1].includes(props.row.type)">
                  <span class="ml-25px">封顶金额：{{ `${handleMoney(props.row.cost.top_money)}元` }}</span>
                  <span class="ml-25px">开门次数：{{ props.row.cost.unlock_count }}</span>
                  <span class="ml-25px">封顶时长：{{ `${props.row.cost.top_time}分钟` }}</span>
                  <span class="ml-25px">免费时长：{{ `${props.row.cost.free_time}分钟` }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="规则名称"></el-table-column>
          <el-table-column label="收费类型">
            <template #default="scope">
              <el-tag effect="dark" :type="handleTableFilterArr(scope.row.type, rulesType)?.tag">
                {{ handleTableFilterArr(scope.row.type, rulesType)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="柜门类型">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.locker_type, lockerType)?.tag">
                {{ handleTableFilterArr(scope.row.locker_type, lockerType)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="押金/预付费">
            <template #default="scope">
              {{ `${handleMoney(scope.row.deposit)}元/` }}
              <span v-if="![1].includes(scope.row.type)">{{ `${handleMoney(scope.row.prepaid)}元` }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="单位金额/时长">
            <template #default="scope">
              <span v-if="![1].includes(scope.row.type)">{{ `${handleMoney(scope.row.cost.per_money)}元` }}</span>
              <span v-else> - </span>
              <span>/{{ `${scope.row.cost.per_time}分钟` }}</span>
            </template>
          </el-table-column>
          <el-table-column label="忘记取包次数/费用">
            <template #default="scope">
              <p>{{ scope.row.forget_count }}次/{{ handleMoney(scope.row.forget_paid) }}元</p>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="描述"> </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="180px">
            <template #default="scope">
              <div>
                <el-button @click="open(scope.row)">编辑</el-button>
                <el-button @click="deleteRule(scope.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <EditDialog ref="dialogRef" :params="state.row" @fetch="onPagination"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { EditDialog } from './components';
import { usePagination } from '@/hooks/elementPlus/usePagination';
// import { getFeeRulesApi, deleteFeeRulesAPi } from '@/api/operation';
import { handleMoney } from '@/utils/tools';
import { minuteToHours } from '@/utils/dateUtil';
import { handleTableFilterArr, lockerType, rulesType } from '@/enums';

const { query } = usePagination();
const dialogRef = ref();
const state = reactive({
  row: {},
  list: [] as any[],
});

const loadRules = async () => {
  // startLoading();
  // const { data } = await getFeeRulesApi(undefined, {
  //   limit: query.limit,
  //   skip: query.skip,
  //   node_id: String(route.query.id),
  //   ...query.where,
  // }).finally(() => endLoading());
  // state.list = data;
};
loadRules();
const open = (row?: any) => {
  dialogRef.value.visible = true;
  state.row = row;
};

// 结束订单
const deleteRule = async () => {
  // const data = await useHandleData(deleteFeeRulesAPi, { id: id }, '删除当前收费规则', 'error');
  // data && loadRules();
};

const onPagination = () => {
  loadRules();
};
</script>

<style lang="scss" scoped></style>
