<template>
  <div class="file-upload-wrapper">
    <!-- 文件名显示 -->
    <div v-if="props.value" class="file-info">
      <el-tooltip effect="dark" :content="props.value" placement="top">
        <span class="file-name">{{ getFileName(props.value) }}</span>
      </el-tooltip>
    </div>

    <!-- 上传按钮 -->
    <el-upload
      action="#"
      :accept="acceptType"
      :show-file-list="false"
      :before-upload="handleBefore"
      :disabled="props.disabled"
    >
      <el-button
        :type="props.value ? 'primary' : 'primary'"
        link
        size="small"
        :loading="uploading"
        :disabled="props.disabled"
      >
        <i-ep-upload v-if="!props.value" />
        <el-tooltip v-if="props.value" effect="dark" content="重新上传" placement="top">
          <i-ep-refresh />
        </el-tooltip>
      </el-button>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import axios from 'axios';
import { error, success } from '@/hooks/elementPlus/useMessage';
import { getAppEnvConfig } from '@/utils/env';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<'image' | 'video'>,
    default: 'image',
    validator: (value: string) => ['image', 'video'].includes(value),
  },
  maxSize: {
    type: Number,
    default: 50, // 默认50MB
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:value']);
const { VITE_GLOB_APP_ID_UPLOAD, VITE_GLOB_UPLOAD_URL } = getAppEnvConfig();

const uploading = ref(false);
const store = useUserStore();

// 根据类型设置 accept
const acceptType = computed(() => {
  return props.type === 'image' ? 'image/*' : 'video/*';
});

// 获取文件名
const getFileName = (url: string) => {
  if (!url) return '';
  return url.split('/').pop() || '';
};

const handleBefore = (file: File) => {
  // 验证文件类型
  const isValidType = props.type === 'image' ? file.type.startsWith('image/') : file.type.startsWith('video/');

  if (!isValidType) {
    error(`只能上传${props.type === 'image' ? '图片' : '视频'}文件！`);
    return false;
  }

  // 验证文件大小
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize;
  if (!isLtMaxSize) {
    error(`上传文件大小不能超过 ${props.maxSize}MB!`);
    return false;
  }

  if (uploading.value) {
    error('正在上传中，请稍候...');
    return false;
  }

  uploadFile(file);
  return false; // 阻止 el-upload 自动添加 file-list
};

const uploadFile = (file: File) => {
  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  const auth = `Bearer ${store.token}`;

  axios
    .post(`${VITE_GLOB_UPLOAD_URL}/table/upload/`, formData, {
      headers: {
        Authorization: auth,
      },
      // 添加上传进度监听
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`上传进度: ${percentCompleted}%`);
        }
      },
    })
    .then((val) => {
      if (val.data) {
        success('上传成功');
        emit('update:value', val.data);
      }
    })
    .catch(() => {
      error('上传失败');
    })
    .finally(() => {
      uploading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-info {
  flex: 1;
  overflow: hidden;
}

.file-name {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}
</style>
