<template>
  <div class="largeScreen-container">
    <div ref="dataScreenRef" class="largeScreen">
      <div class="largeScreen-header">
        <div class="header-rg"></div>
        <div class="header-ct">
          <div class="header-ct-text">可视化大数据展示平台</div>
        </div>
        <div class="header-rg"></div>
      </div>
      <div class="largeScreen-main">
        <div class="largeScreen-lf">
          <div class="largeScreen-lf-t">
            <WaterBall ref="waterBallChartRef" />
          </div>
          <div class="largeScreen-lf-c"></div>
          <div class="largeScreen-lf-b"></div>
        </div>
        <div class="largeScreen-ct">
          <div class="largeScreen-map">
            <Map ref="mapChartRef" />
          </div>
        </div>
        <div class="largeScreen-rg">
          <div class="largeScreen-rg-t"></div>
          <div class="largeScreen-rg-c"></div>
          <div class="largeScreen-rg-b"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Map, WaterBall } from './components';
import type { ECharts } from 'echarts';
/* 获取子组件的ref */
interface ChartExpose {
  initChart: () => ECharts;
}
interface ChartProps {
  [key: string]: ECharts | null;
}
const largeScreen: ChartProps = {
  mapChart: null,
  waterBallChart: null,
};
const mapChartRef = ref<ChartExpose>();
const waterBallChartRef = ref<ChartExpose>();
const dataScreenRef = ref<HTMLElement | null>(null);
onMounted(() => {
  // 初始化时为外层盒子加上缩放属性，防止刷新界面时就已经缩放
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    dataScreenRef.value.style.width = `1920px`;
    dataScreenRef.value.style.height = `1080px`;
  }
  /* 初始化echarts */
  initCharts();
  // 为浏览器绑定事件
  window.addEventListener('resize', resize);
});

const initCharts = () => {
  largeScreen.mapChart = mapChartRef.value?.initChart() as ECharts;
  largeScreen.waterBallChart = waterBallChartRef.value?.initChart() as ECharts;
};

/* 浏览器监听 resize 事件 */
const resize = () => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
  }
  // 使用了 scale 的echarts其实不需要需要重新计算缩放比例
  Object.values(largeScreen).forEach((chart) => {
    chart && chart.resize();
  });
};

/* 根据浏览器大小推断缩放比例 */
const getScale = (width = 1920, height = 1080) => {
  const ww = window.innerWidth / width;
  console.log('ww: ', ww);
  const wh = window.innerHeight / height;
  console.log('wh: ', wh);
  return ww < wh ? ww : wh;
};
</script>

<style lang="scss" scoped>
@import url(./css/index.scss);
</style>
