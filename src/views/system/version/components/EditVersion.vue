<template>
  <el-dialog
    v-model="isVisible"
    :title="objectId ? '修改版本' : '新增版本'"
    width="45%"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="版本号" prop="code">
            <el-input v-model="state.form.code" :disabled="!!objectId"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备类型" prop="device_type">
            <el-select
              v-model="state.form.device_type"
              class="w-full"
              placeholder="请选择设备类型"
              :disabled="!!objectId"
            >
              <el-option v-for="item in deviceType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" class="w-full" placeholder="请选择状态">
              <el-option v-for="item in versionStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 上传后的文件地址 -->
        <el-col :span="24">
          <el-form-item label="file_url" prop="file_url">
            <el-input v-model="state.form.file_url" :disabled="!!objectId"></el-input>
            <!-- <FileUpload
              class="mt-4"
              tip="上传版本安装包,注意安装包格式"
              list-type="text"
              @upload="onUpload"
            ></FileUpload>  -->
            <el-upload v-if="!objectId" action="#" :limit="1" :http-request="uploadFile">
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="更新内容" prop="description">
            <el-input v-model="state.form.description" type="textarea" maxlength="500" :autosize="{ minRows: 6 }" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-debounce type="primary" :loading="state.fileLoading" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { buildForm, rules } from '@/views/system/version/components/model';
import { createVersionApi, updateVersionApi } from '@/api/system';
import { success } from '@/hooks/elementPlus/useMessage';
import { deviceType, versionStatus } from '@/enums';
import { uploadVersionsApi } from '@/api/common/upload';

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
const emit = defineEmits(['update:visible', 'fetch']);
const isVisible = computed(() => props.visible);
const objectId = computed(() => props.params.id);
const formRef = ref();

const state = reactive({
  form: buildForm(props.params),
  fileLoading: false,
});

watch(
  () => props.params,
  (val) => {
    state.form = buildForm(val);
  },
);

const create = async () => {
  const { Result } = await createVersionApi(state.form);
  callback(Result.code);
};

const update = async () => {
  const { Result } = await updateVersionApi(objectId.value, state.form);
  callback(Result.code);
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      (props.params.id ? update : create)();
    }
  });
};

// 文件上传
async function uploadFile(params) {
  state.fileLoading = true;
  const file = params.file;
  const res = await uploadVersionsApi({ file });
  state.fileLoading = false;
  // 返回图片路径
  state.form.file_url = res.data;
  console.log('res.data:', res.data);
}

const close = () => {
  emit('update:visible', false);
};

const callback = (code: string) => {
  close();
  emit('fetch');
  success(`${code}${objectId.value ? '修改' : '新增'}成功`);
};
</script>
