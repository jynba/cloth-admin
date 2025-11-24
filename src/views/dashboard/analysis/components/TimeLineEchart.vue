<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts">
import type { Ref } from 'vue';
import { defineComponent, ref, watch } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';

export default defineComponent({
  props: {
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
  },

  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

    watch(
      () => props.loading,
      () => {
        if (props.loading) {
          return;
        }
        // 饼图数据
        // const { toolRate, storeRate, fileRate } = props.params;
        // const total = 28;
        // // 假数据
        // const paramsData = [
        //   { value: 1, name: '周一' },
        //   { value: 2, name: '周二' },
        //   { value: 3, name: '周三' },
        //   { value: 4, name: '周四' },
        //   { value: 5, name: '周五' },
        //   { value: 6, name: '周六' },
        //   { value: 7, name: '周天' },
        // ];

        setOptions({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['营收', '消费'],
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: '消费人数',
              type: 'line',
              data: [150, 230, 224, 218, 135, 147, 260],
              smooth: true,
              color: '#409EFF',
              areaStyle: {},
            },
          ],
        });
      },
      { immediate: true },
    );
    return { chartRef };
  },
});
</script>
