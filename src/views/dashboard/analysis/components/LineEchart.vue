<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
import { useECharts } from '@/hooks/web/useECharts';
import type { PropType, Ref } from 'vue';
import { ref, watch } from 'vue';

const props = defineProps({
  loading: Boolean,
  width: {
    type: String as PropType<string>,
    default: '100%',
  },
  height: {
    type: String as PropType<string>,
    default: '400px',
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => [props.params, props.loading],
  () => {
    if (props.loading) {
      return;
    }

    const { xData = [], uData = [] } = props.params || {};

    setOptions({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        show: false,
        type: 'category',
        data: xData,
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          type: 'line',
          color: '#79bbff',
          data: uData,
          areaStyle: {},
        },
      ],
      grid: {
        left: '0',
        bottom: '3',
        top: '3',
      },
    });
  },
  { immediate: true, deep: true },
);
</script>
