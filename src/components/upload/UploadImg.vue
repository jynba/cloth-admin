<template>
  <div>
    <el-upload
      v-model:file-list="fileList"
      action="#"
      :accept="acceptType"
      :before-upload="handleBefore"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      list-type="picture-card"
      :multiple="multiple"
      :limit="multiple ? maxCount : 1"
      :class="{
        disabled: (!multiple && fileList.length > 0) || (multiple && fileList.length >= maxCount),
      }"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import axios from 'axios';
import { isImage } from '@/utils/pattern';
import { error, success } from '@/hooks/elementPlus/useMessage';
import { getAppEnvConfig } from '@/utils/env';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
  image: {
    type: String,
  },
  images: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  acceptType: {
    type: String,
    default: 'image/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  maxCount: {
    type: Number,
    default: 9,
  },
});
const emit = defineEmits(['update:image', 'update:images']);
const { VITE_GLOB_APP_ID_UPLOAD, VITE_GLOB_UPLOAD_URL } = getAppEnvConfig();

const fileList = ref<any[]>([]);

// 生成唯一 uid
const genUid = (url: string | undefined) => {
  return url || String(Date.now() + Math.random());
};

// 封装 fileList 赋值
const setFileList = (urls?: string[]) => {
  if (urls && urls.length > 0) {
    fileList.value = urls.map((url, index) => ({
      name: url.split('/')?.pop() || `图片${index + 1}`,
      url,
      uid: genUid(url),
    }));
  } else {
    fileList.value = [];
  }
};

// 初始化 fileList
const initFileList = () => {
  if (props.multiple && props.images && props.images.length > 0) {
    setFileList(props.images);
  } else if (!props.multiple && props.image) {
    setFileList([props.image]);
  }
};

initFileList();

// 监听变化
watch(
  () => props.images,
  (val) => {
    if (props.multiple) {
      setFileList(val);
    }
  },
  { deep: true },
);

watch(
  () => props.image,
  (val) => {
    if (!props.multiple) {
      setFileList(val ? [val] : []);
    }
  },
);

const store = useUserStore();

const handleBefore = (file: File) => {
  if (!isImage(file)) {
    error('文件格式错误');
    return false;
  }
  console.log(file, 'file', fileList.value, 'list');

  // 检查数量限制
  if (props.multiple && fileList.value.length >= props.maxCount) {
    error(`最多只能上传${props.maxCount}张图片`);
    return false;
  }

  if (!props.multiple && fileList.value.length >= 1) {
    error('只能上传一张图片');
    return false;
  }

  uploadImage(file);
  return false; // 阻止 el-upload 自动添加 file-list
};

const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const auth = `Bearer ${store.token}`;
  axios
    .post(`${VITE_GLOB_UPLOAD_URL}/table/upload/`, formData, {
      headers: {
        Authorization: auth,
      },
    })
    .then((val) => {
      if (val.data) {
        success('上传成功');

        // 添加新图片到列表
        const newFile = {
          name: val.data.split('/')?.pop() || '图片',
          url: val.data,
          uid: genUid(val.data),
        };

        if (props.multiple) {
          fileList.value.push(newFile);
          const newImages = fileList.value.map((item) => item.url);
          console.log(newImages, 'newImages');
          emit('update:images', newImages);
        } else {
          fileList.value = [newFile];
          emit('update:image', val.data);
        }
      }
    })
    .catch(() => {
      error('上传失败');
    });
};

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const handlePreview = (file: any) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleRemove = (_file: any, files: any[]) => {
  if (props.multiple) {
    const newImages = (files || []).map((item: any) => item.url);
    emit('update:images', newImages);
  } else {
    emit('update:image', '');
  }
};
</script>

<style lang="scss" scoped>
.disabled {
  :deep(.el-upload--picture-card) {
    display: none !important;
  }
}

.el-upload--picture-card {
  --el-upload-picture-card-size: 100px;
}

/* 隐藏图片右上角绿色角标 */
:deep(.el-upload-list__item-status-label) {
  display: none !important;
}

// 上传按钮和图片卡片样式
:deep(.el-upload--picture-card),
:deep(.el-upload-list__item),
:deep(.el-upload-list__item-thumbnail) {
  width: 100px !important;
  height: 100px !important;
  border-radius: 8px !important;
}
:deep(.el-upload--picture-card),
:deep(.el-upload-list__item) {
  border: 1px dashed #d8d8d8 !important;
}
:deep(.el-upload-list__item-thumbnail) {
  object-fit: cover;
}
</style>
