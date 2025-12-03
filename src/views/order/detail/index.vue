<template>
  <div class="order-detail">
    <el-page-header content="订单详情" @back="goBack" />

    <el-card class="mt-16" shadow="never">
      <template #header>
        <div class="card-header">基础信息</div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ order?.order_no }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="handleTableFilterArr(order?.order_status, orderStatus)?.tag">
            {{ handleTableFilterArr(order?.order_status, orderStatus)?.label || order?.order_status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="金额(元)">{{ Number(order?.total_amount || 0).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ format(order?.created_at) }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="mt-16" shadow="never">
      <template #header>
        <div class="card-header">客户信息</div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ order?.customer?.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ order?.customer?.phone }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="mt-16" shadow="never">
      <template #header>
        <div class="card-header">师傅信息</div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ order?.tailor?.real_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ order?.tailor?.phone || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getOrderDetail } from '@/api/app';
import { handleTableFilterArr, orderStatus } from '@/enums';
import { format } from '@/utils/dateUtil';

const route = useRoute();
const router = useRouter();

const order = ref<any>(null);

const load = async () => {
  const id = Number(route.params.id);
  if (!id) return;
  const res: any = await getOrderDetail(id);
  order.value = res || null;
};

onMounted(() => {
  load();
});

const goBack = () => {
  router.back();
};
</script>

<style lang="scss" scoped>
.mt-16 { margin-top: 16px; }
.card-header { font-weight: 600; }
</style>

