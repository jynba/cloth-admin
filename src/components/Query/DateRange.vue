<template>
  <el-date-picker
    v-model="state.currentDate"
    class="max-w-350px"
    type="daterange"
    range-separator="至"
    :start-placeholder="startTxt"
    :end-placeholder="endTxt"
    :disabled-date="disabledDateFunc"
    @change="change"
  >
  </el-date-picker>
</template>

<script lang="ts" setup>
import { dateUtil, format, isAfter } from '@/utils/dateUtil';

defineProps({
  start: {
    type: String,
    default: '',
  },
  end: {
    type: String,
    default: '',
  },
  startTxt: {
    type: String,
    default: '开始时间',
  },
  endTxt: {
    type: String,
    default: '结束时间',
  },
});
const emit = defineEmits(['update:start', 'update:end', 'change']);
const state = reactive({
  currentDate: [],
});

const disabledDateFunc = (time) => {
  // true: 禁止选中，false:可以选中
  return !isAfter(new Date(), time);
};

const change = () => {
  const currentDate = state.currentDate || [];
  const [start, end] = currentDate;
  emit('update:start', format(start));
  emit('update:end', format(dateUtil(end).add(1, 'd').subtract(1, 's')));
  emit('change', state.currentDate);
};
</script>
