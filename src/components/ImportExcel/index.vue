<template>
  <ImpExcel @success="loadDataSuccess">
    <el-button :type="type"> {{ btnText }} </el-button>
  </ImpExcel>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ExcelData } from '@/components/Excel';
import ImpExcel from '@/components/Excel/src/ImportExcel.vue';

defineProps({
  btnText: {
    type: String,
    default: '导入Excel',
  },
  type: {
    type: String,
    default: 'primary',
  },
});
const emit = defineEmits(['success']);
const tableListRef = ref<
  {
    title: string;
    columns?: any[];
    dataSource?: any[];
  }[]
>([]);

function loadDataSuccess(excelDataList: ExcelData[]) {
  tableListRef.value = [];
  console.log(excelDataList);
  for (const excelData of excelDataList) {
    const {
      header,
      results,
      meta: { sheetName },
    } = excelData;
    const columns: any[] = [];
    for (const title of header) {
      columns.push({ title, dataIndex: title });
    }
    tableListRef.value.push({ title: sheetName, dataSource: results, columns });
  }

  emit('success', tableListRef.value);
}
</script>
