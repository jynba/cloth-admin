<template>
  <el-dialog
    v-model="visible"
    title="支付配置"
    width="900px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="180px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="收款平台" prop="mch">
            <el-select v-model="state.form.mch" class="w-full" placeholder="请选择收款平台">
              <el-option v-for="item in payChannelList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-debounce @click="close">取 消</el-button>
        <el-button v-debounce type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { buildForm, rules } from './model';
import { success } from '@/hooks/elementPlus/useMessage';
import { updateShopsApi } from '@/api/app';
import type { ShopForm } from '../types';
import { payChannelList } from '@/enums';
import { JSONUtils } from '@/utils/tools';

const props = defineProps({
  params: {
    type: Object as PropType<ShopForm>,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch']);
const objectId = computed(() => props.params?.id);
const formRef = ref();
const visible = ref(false);
const state = reactive({
  form: buildForm(props.params),
});

watch(
  () => props.params,
  async (val) => {
    if (val) {
      const parsedRateMap =
        val?.rate_map && typeof val?.rate_map === 'string'
          ? JSONUtils.parse(val?.rate_map)
          : val?.rate_map || { company: undefined, shop: undefined };
      state.form = buildForm({ ...val, rate_map: parsedRateMap }) as ShopForm;
    }
  },
);

const update = async () => {
  const params = useParams();
  const data = await updateShopsApi(objectId.value, params);
  data?.Result?.id && callback();
};

const useParams = () => {
  const { mch, rate_map, NodeListMap, ...rest } = state.form;
  const params = { mch, rate_map: JSON.stringify(rate_map), ...rest };
  return params;
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      update();
    }
  });
};

const close = () => {
  formRef.value.resetFields();
  visible.value = false;
};

const refresh = () => {
  emit('fetch');
};

const callback = () => {
  close();
  refresh();
  success(`${objectId.value ? '修改' : '新增'}成功`);
};

defineExpose({ visible });
</script>
