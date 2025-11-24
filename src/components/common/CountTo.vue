<template>
  <span>{{ output.toFixed(0) }}</span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { TransitionPresets, useTransition } from '@vueuse/core';

defineOptions({
  name: 'CountTo',
});
const props = withDefaults(defineProps<PropsType>(), {
  endCount: 0,
});
interface PropsType {
  endCount?: number;
}
const count = ref(0);
const output = useTransition(count, {
  duration: 1000,
  transition: TransitionPresets.easeInSine,
});

watch(
  () => props.endCount,
  () => {
    count.value = props.endCount;
  },
);
</script>

<style lang="stylus" scoped></style>
