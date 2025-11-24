<template>
  <el-tooltip :effect="effect" popper-class="testtooltip" :placement="placement">
    <template #content>
      <div :style="{ 'max-width': '800px' }">
        <slot />
      </div>
    </template>
    <div class="ellipsis-text"><slot /></div>
  </el-tooltip>
</template>

<script lang="ts" setup>
interface Props {
  maxWidth?: number | string; // 文本最大宽度
  line?: number; // 最大行数
  placement?: string;
  effect?: 'light' | 'dark';
}
const props = withDefaults(defineProps<Props>(), {
  maxWidth: '140px',
  line: 1,
  placement: 'top-start',
  effect: 'dark',
});

const width = computed(() => props.maxWidth);
const isLine = computed(() => props.line);
</script>

<style lang="scss" scoped>
.ellipsis-text {
  max-width: v-bind(width);
  overflow: hidden;
  display: -webkit-inline-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: v-bind(isLine);
  text-overflow: ellipsis;
}
</style>
