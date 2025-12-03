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
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 公司名称：{{ state.item.name }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          状态：
          <el-tag :type="handleTableFilterArr(state.item.status, managerStatus)?.tag">
            {{ handleTableFilterArr(state.item.status, managerStatus)?.label }}
          </el-tag>
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          联系电话：{{ state.item.contact_phone }}
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 地址：{{ state.item.address }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          创建时间：{{ format(state.item.created_at) }}
        </el-col>
      </el-row>
    </el-card>
    <div class="mt-4 tabs">
      <el-tabs v-model="state.activeIndex">
        <el-tab-pane label="部门管理">
          <Departments v-if="state.activeIndex === '0'" :company-id="Number(objectId)" />
        </el-tab-pane>
        <el-tab-pane label="公司员工">
          <Admins v-if="state.activeIndex === '1'" :company-id="Number(objectId)" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑弹窗 -->
    <EditDialog v-model:visible="state.isVisible" :params="state.item"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { format } from '@/utils/dateUtil';
import { EditDialog } from '../components';
import { Departments, Admins } from './components';
import { handleTableFilterArr, managerStatus } from '@/enums';

const route = useRoute();
const state = reactive({
  item: {} as any,
  activeIndex: '0',
  isVisible: false,
});
const objectId = computed(() => route.query.id as string);

const parseRow = () => {
  const raw = route.query.row as string;
  if (!raw) return {} as any;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch (e) {
    console.warn('Failed to parse company row from route:', e);
    return {} as any;
  }
};

onMounted(() => {
  state.item = parseRow();
});

watch(
  () => route.query.row,
  () => {
    state.item = parseRow();
  },
);

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
