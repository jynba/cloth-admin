<template>
  <div>
    <el-card shadow="never" class="box-card">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span>网点信息</span>
            <div class="ml-4">
              <el-button v-auth="['site:u']" type="primary" @click="open(false)">编辑</el-button>
              <!-- <el-button type="primary" @click="open(true)">隐藏信息</el-button> -->
              <el-button type="primary" @click="openParent">编辑上级</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-skeleton :rows="3" style="width: 100%" :loading="state.loading" animated>
        <template #default>
          <el-row :gutter="20">
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 网点名称：{{ state.item.name }} </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              状态：
              <el-tag :type="handleTableFilterArr(state.item.status, managerStatus)?.tag">
                {{ handleTableFilterArr(state.item.status, managerStatus)?.label }}
              </el-tag>
            </el-col>
            <!-- <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              所属代理：{{ state.item.agent_name }}
            </el-col> -->
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              所属商户：{{ state.item.info?.parent_name }}
            </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              取包方式：{{ handleTableFilterArr(state.item.fetch_type, fetchType)?.label }}
            </el-col>
            <!-- <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              设备数：{{ state.item.device_count }}
            </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              合作类型：{{ state.item.partner_type }}
            </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              场景分类：{{ state.item.scene_type }}
            </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              子场景分类：{{ state.item.sub_scene_type }}
            </el-col> -->
            <!-- <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              地址：{{ `${state.item.province}-${state.item.city}-${state.item.area}-${state.item.address}` }}
            </el-col> -->
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 联系人：{{ state.item.contact }} </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 联系方式：{{ state.item.phone }} </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 地址：{{ state.item.address }} </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              开业/停业时间：{{ `${minuteToHours(state.item.open_time)}/${minuteToHours(state.item.close_time)}` }}
            </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6"> 备注：{{ state.item.remark }} </el-col>
            <el-col class="mb-4" :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
              创建时间：{{ formatUnix(state.item.create_time) }}
            </el-col>
          </el-row>
          <div class="flex">
            <div class="align-top">收费规则图片：</div>
            <div class="border-dashed border-1">
              <el-image
                style="width: 80px; height: 80px"
                :src="state.item.pay_rule_url"
                :preview-src-list="[state.item.pay_rule_url]"
                fit="cover"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-card>
    <div class="mt-4 tabs">
      <el-tabs v-model="state.activeIndex">
        <el-tab-pane label="设备列表">
          <LowDevice v-if="state.activeIndex === '0'"></LowDevice>
        </el-tab-pane>
        <el-tab-pane label="收费规则列表">
          <Rules v-if="state.activeIndex === '1'"></Rules>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑弹窗 -->
    <EditSite v-model:visible="state.isVisible" :params="state.item" @search="getSites"></EditSite>
    <!-- <HideDialog ref="hideRef"></HideDialog> -->
    <EditParent ref="dialogRef" :params="state.item" type="Shop" @fetch="getSites"></EditParent>
  </div>
</template>

<script lang="ts" setup>
import { EditSite } from '../components';
import { LowDevice, Rules } from './components';
import { fetchType, handleTableFilterArr, managerStatus } from '@/enums';
import { getSitesApi } from '@/api/app';
import { formatUnix, minuteToHours } from '@/utils/dateUtil';

const dialogRef = ref();
const route = useRoute();
const hideRef = ref();
const state = reactive({
  item: {} as any,
  activeIndex: '0',
  isVisible: false,
  loading: false,
});
const objectId = computed(() => route.query.id as string);

const getSites = async () => {
  state.loading = true;
  const data = await getSitesApi(objectId.value).finally(() => (state.loading = false));
  state.item = data;
};
getSites();

const open = (type: boolean) => {
  if (type) {
    hideRef.value.visible = true;
  } else {
    state.isVisible = true;
  }
};
const openParent = () => {
  dialogRef.value.visible = true;
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
    .el-collapse-item__header,
    .el-collapse-item__content {
      font-size: 16px;
    }
  }
}
</style>
