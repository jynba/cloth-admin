<template>
  <el-dialog v-model="isShow" title="二维码展示" width="400px" :close-on-click-modal="false" :before-close="close">
    <div v-if="qrObj.type === 'qrcode'">
      <div v-if="qrObj.url">
        <QrcodeVue :value="qrObj.url" :size="360" level="H"></QrcodeVue>
        <div class="text-center text-xl">{{ qrObj?.code }}</div>
      </div>
      <span v-else>无效二维码</span>
    </div>
    <div v-else>
      <img v-if="qrObj.url" :src="qrObj.url" style="width: 360px" />
      <span v-else>未上传图片</span>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';

interface QrcodeObject {
  type: 'qrcode' | 'image';
  url: string;
  code: string;
}
defineOptions({
  name: 'QrImg',
});
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  qrObj: {
    type: Object as PropType<QrcodeObject>,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:visible']);
const isShow = computed(() => props.visible);
const close = () => {
  emit('update:visible', false);
};
</script>

<style lang="scss" scoped></style>
