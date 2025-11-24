<template>
  <el-dialog
    v-model="isVisible"
    title="上传"
    width="30%"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <Upload @upload="upload"></Upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-debounce type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Upload from './Upload.vue';
import { uploadApi } from '@/api/common/upload';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['upload', 'update:visible']);
const isVisible = computed(() => props.visible);
const state = ref<any>();

const upload = (file: File) => {
  state.value = file;
};

const submit = async () => {
  const res = await uploadApi(`/v1/files/images/${state.value?.name}`, {
    name: 'buffer',
    file: state.value,
  });

  emit('upload', res.data);
  close();
};

const close = () => {
  emit('update:visible', false);
};
</script>
