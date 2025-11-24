<template>
  <div>
    <el-card shadow="never" class="box-card">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span>商户信息</span>
            <div class="ml-4">
              <el-button v-auth="['shop:u']" type="primary" @click="open(false)">编辑</el-button>
              <el-button type="primary" @click="openParent">编辑上级</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 商户名称：{{ state.item.name }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          状态：
          <el-tag :type="handleTableFilterArr(state.item.status, managerStatus)?.tag">
            {{ handleTableFilterArr(state.item.status, managerStatus)?.label }}
          </el-tag>
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          下单使用余额：
          {{ handleTableFilterArr(state.item.use_balance_enable, useBalanceEnable)?.label }}
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          所属合作商：{{ state.item.info?.parent_name }}
        </el-col>
        <!-- <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          网点数：{{ state.item.site_count }}
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          地址：{{ `${state.item.province}-${state.item.city}-${state.item.area}-${state.item.address}` }}
        </el-col> -->
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 联系人：{{ state.item.contact }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 联系方式：{{ state.item.phone }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 备注：{{ state.item.remark }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          创建时间：{{ formatUnix(state.item.create_time) }}
        </el-col>
      </el-row>
    </el-card>
    <div class="mt-4 tabs">
      <el-tabs v-model="state.activeIndex">
        <el-tab-pane label="下级网点">
          <LowSite v-if="state.activeIndex === '0'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑弹窗 -->
    <EditDialog ref="dialogRef" :params="state.item" @fetch="load"></EditDialog>
    <!-- <HideDialog ref="hideRef" /> -->
    <EditParent ref="dialogParentRef" :params="state.item" type="Agent" @fetch="load"></EditParent>
  </div>
</template>

<script lang="ts" setup>
import { formatUnix } from '@/utils/dateUtil';
import { LowSite } from './components';
import { EditDialog, useBalanceEnable } from '../components';
import { getShopsApi } from '@/api/app';
import { handleTableFilterArr, managerStatus } from '@/enums';
import type { ShopForm } from '../types';

const route = useRoute();
const dialogRef = ref();
const dialogParentRef = ref();
const hideRef = ref();
const state = reactive({
  item: {} as ShopForm,
  activeIndex: '0',
});
const objectId = computed(() => route.query.id as string);

const load = async () => {
  const data = await getShopsApi(objectId.value);
  state.item = data;
};

onMounted(() => {
  load();
});

const open = (hide: boolean) => {
  if (hide) {
    hideRef.value.visible = true;
  } else {
    dialogRef.value.visible = true;
  }
};
const openParent = () => {
  dialogParentRef.value.visible = true;
};
</script>

<style lang="scss" scoped>
.tabs {
  padding: 15px;
  background: $bg-panel;
}

.box-card {
  :deep(.el-card__header) {
    padding: 15px;
    background: $bg-primary;
  }
}
</style>
