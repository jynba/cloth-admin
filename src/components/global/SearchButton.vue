<template>
  <div class="flex">
    <el-button v-debounce type="primary" @click="$emit('search')"> <i-ep-search /> &nbsp;搜索 </el-button>
    <el-button v-debounce type="danger" @click="$emit('reset')"><i-ep-delete />&nbsp;重置 </el-button>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'SearchButton',
});
defineEmits(['search', 'reset']);
</script>

<style lang="scss" scoped></style>
