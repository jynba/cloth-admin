<template>
  <div>
    <el-card shadow="never" class="box-card">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span>公众号信息</span>
            <div class="ml-4">
              <el-button type="primary" @click="open">编辑</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 公众号名称：{{ state.item.name }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> mp_app_id：{{ state.item.mp_app_id }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> oa_app_id:{{ state.item.oa_app_id }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
          创建时间：{{ formatUnix(state.item.create_time) }}
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑弹窗 -->
    <EditDialog v-model:visible="state.isVisible" :params="state.item" @fetch="fetchShops"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { formatUnix } from '@/utils/dateUtil';
import { EditDialog } from '../components';
import { getSocialApi } from '@/api/system';

const route = useRoute();
const state = reactive({
  item: {} as any,
  activeIndex: '0',
  isVisible: false,
});
const objectId = computed(() => route.query.id as string);

const fetchShops = async () => {
  const data = await getSocialApi({}, objectId.value);
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
