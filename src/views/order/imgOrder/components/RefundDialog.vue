<template>
  <el-dialog
    v-model="isVisible"
    title="退款"
    width="550px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
    @closed="afterAnimate"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-width="100px"
      :rules="refundRules(handleMoney(params.payed))"
      :model="state.form"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="用户openid:">
            {{ params.user?.open_id }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="可退金额:"> {{ params.payed <= 0 ? 0 : handleMoney(params.payed) }} 元 </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="实付金额:"> {{ handleMoney(params.payed) }} 元 </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="退款金额" prop="money">
            <el-input v-model="state.form.money" placeholder="请输入退款金额" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="state.form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-debounce type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { buildRefundForm, refundRules } from './model/index';
import { postOrdersRefundApi } from '@/api/member';
import { success } from '@/hooks/elementPlus/useMessage';
import { handleMoney, handlePostMoney } from '@/utils/tools';

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
const emit = defineEmits(['fetch', 'update:visible']);
const isVisible = computed(() => props.visible);
const objectId = computed(() => props.params.id);
const formRef = ref();
const state = reactive({
  form: buildRefundForm(props.params),
});

watch(
  () => props.params, // 监听非响应式数据
  (val) => {
    state.form = buildRefundForm(val);
  },
);

const close = () => {
  formRef.value.resetFields();
  emit('update:visible', false);
};

const locking = ref(false);
const submit = () => {
  if (locking.value) return;
  locking.value = true;
  formRef.value.validate((valid) => {
    if (valid) {
      const params = {
        ...state.form,
        money: handlePostMoney(Number(state.form.money)),
      };
      postOrdersRefundApi(objectId.value, params).then(() => {
        success('退款成功');
        close();
        emit('fetch');
      });
    }
  });
};

//  关闭动画结束时的回调：注意必须弹窗完全关闭才能把锁解开
const afterAnimate = () => {
  locking.value = false;
};
</script>
