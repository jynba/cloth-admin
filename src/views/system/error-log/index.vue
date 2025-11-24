<template>
  <div class="p-5 pb-0 bg-white">
    <el-timeline>
      <el-timeline-item v-for="err in errorLogInfoList" :key="err.time" color="#ca9d5a" :timestamp="err.time">
        <div class="mb-4">错误名称：{{ err.name }}</div>
        <div class="mb-4">
          错误类型： <el-tag type="danger">{{ err.type }}</el-tag>
        </div>
        <div class="mb-4">错误消息：{{ err.message }}</div>
        <div class="mb-4">错误详情：{{ err.detail }}</div>
        <div class="mb-4">来源地址：{{ err.url }}</div>
      </el-timeline-item>
    </el-timeline>
    <!-- <el-button @click="create">create</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { useErrorLogStoreWithOut } from '@/store/modules/errorLog';
/**
 * 错误日志列表，显示出收集的错误日志
 */
// const activeNames = ref<string>();
const errorLogStore = useErrorLogStoreWithOut();
const errorLogInfoList = computed(() => errorLogStore.errorLogInfoList);
console.log('errorLogInfoList: ', errorLogInfoList);

// const create = () => {
//   throw new Error('错误日志');
// };
</script>
