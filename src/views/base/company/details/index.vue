<template>
  <div>
    <el-card shadow="never" class="box-card">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span>平台信息</span>
            <div class="ml-4">
              <el-button v-auth="['company:u']" type="primary" @click="open">编辑</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 平台名称：{{ state.item.name }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          状态：
          <el-tag :type="handleTableFilterArr(state.item.status, managerStatus)?.tag">
            {{ handleTableFilterArr(state.item.status, managerStatus)?.label }}
          </el-tag>
        </el-col>
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
        <el-tab-pane label="公司管理员">
          <!-- <Admins from="Company" v-if="state.activeIndex === '0'" /> -->
        </el-tab-pane>
        <el-tab-pane label="部门管理">
          <Departments v-if="state.activeIndex === '1'" :company-id="Number(objectId)" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑弹窗 -->
    <EditDialog v-model:visible="state.isVisible" :params="state.item" @fetch="fetchShops"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { formatUnix } from '@/utils/dateUtil';
import { EditDialog } from '../components';
import { Departments } from './components';
import { getCompanyApi } from '@/api/app';
import { handleTableFilterArr, managerStatus } from '@/enums';
// import  Admins  from '@/views/base/admins/index.vue'

const route = useRoute();
const state = reactive({
  item: {} as any,
  activeIndex: '0',
  isVisible: false,
});
const objectId = computed(() => route.query.id as string);

const fetchShops = async () => {
  const data = await getCompanyApi(objectId.value);
  state.item = data;
};

onMounted(() => {
  fetchShops();
});

const open = () => {
  state.isVisible = true;
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
