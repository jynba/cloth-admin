<template>
  <el-upload
    ref="uploadRef"
    action="string"
    :file-list="state.fileList"
    :before-upload="handleBefore"
    :http-request="handleRequest"
    :on-change="handleChange"
    :list-type="listType"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">{{ tip }}</div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/jpg',
  },

  multiple: {
    type: Boolean,
    default: false,
  },
  listType: {
    type: String,
    default: 'picture',
  },
  tip: {
    type: String,
    default: '只能上传 jpg/png 文件，且不超过 500kb',
  },
});
const emit = defineEmits(['upload']);
const uploadRef = ref();
const state = reactive({ fileList: [] as any[] });

const handleBefore = async (file) => {
  console.log('handleBefore:', file);
  return true;
};

const handleRequest = async ({ file }) => {
  emit('upload', file);
};

const handleChange = (file) => {
  uploadRef.value.clearFiles();
  if (props.multiple) {
    state.fileList = [...state.fileList, { name: file.name, url: file.url }];
  } else {
    state.fileList = [{ name: file.name, url: file.url }];
  }
};
</script>
