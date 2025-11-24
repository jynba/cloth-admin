<template>
  <div class="bg-white h-40px flex w-full justify-between">
    <div class="relative w-[calc(100%-5rem)]">
      <el-tabs v-model="tabActive" type="card" tab-position="top" @tab-click="handleClick" @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.close"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <TabButton class="mr-3 items-center" />
  </div>
</template>

<script lang="ts" setup>
import { tabsStoreFun } from '@/store/modules/tabs';
import TabButton from './components/TabButton.vue';

const tabsStore = tabsStoreFun();
const router = useRouter();
const route = useRoute();
const tabActive = computed({
  get: () => {
    return tabsStore.tabsMenuValue;
  },
  set: (val) => {
    tabsStore.setTabsMenuValue(val);
  },
});
const tabList = computed(() => tabsStore.getTabList() as any);
// 监听路由
watch(
  () => route.path,
  (val) => {
    let params = {
      title: route.meta.title as string,
      path: val,
      close: true,
    };
    // 当跳转为详情页时存入参数
    if (Object.getOwnPropertyNames(route.query).length !== 0) {
      params = { ...params, path: `${val}?${JSON.stringify(route.query)}` };
    }
    tabsStore.addTabsToList(params);
  },
  { immediate: true },
);

// 点击tab跳转路由,跳详情页要带参
const handleClick = (pane: any) => {
  const temp = pane.props.name.split('?');
  if (temp && temp.length > 1) {
    router.push({ path: temp[0], query: JSON.parse(temp[1]) });
  } else {
    router.push({ path: pane.props.name });
  }
};

// 删除tabs
const removeTab = (tab: any) => {
  tabsStore.removeTab(tab);
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs) {
  .el-tabs__header {
    border: none;

    .el-tabs__nav,
    .el-tabs__item {
      color: #afafaf;
      border: none;
      .is-active {
        color: var(--el-color-primary);
        border-bottom: 2px solid var(--el-color-primary);
      }
    }
  }
}
</style>
