<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑收费规则' : '新增收费规则'"
    width="750px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="120px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收费模式" prop="type">
            <el-select v-model="state.form.type" class="w-full">
              <el-option v-for="item in rulesType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="押金" prop="deposit">
            <el-input v-model="state.form.deposit">
              <template #suffix> 元 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="watchFreeType()" :span="12">
          <el-form-item label="预付费" prop="prepaid">
            <el-input v-model="state.form.prepaid">
              <template #suffix> 元 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="忘记取包次数" prop="forget_count">
            <el-input v-model="state.form.forget_count" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="忘记取包费用" prop="forget_paid">
            <el-input v-model="state.form.forget_paid"> <template #suffix> 元 </template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="柜门类型" prop="locker_type">
            <el-select v-model="state.form.locker_type" class="w-full">
              <el-option v-for="item in lockerType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="desc">
            <el-input v-model="state.form.desc" :rows="2" type="textarea" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider />
        </el-col>
        <el-col v-if="watchFreeType() && state.form.type !== 3" :span="12">
          <el-form-item label="单位金额" prop="cost.per_money">
            <el-input v-model="state.form.cost.per_money" clearable>
              <template #suffix> 元 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="watchFreeType() && state.form.type !== 3" :span="12">
          <el-form-item label="封顶金额" prop="cost.top_money">
            <el-input v-model="state.form.cost.top_money" clearable>
              <template #suffix> 元 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="清柜时间" prop="cost.end_time">
            <el-select v-model="state.form.cost.end_time" class="w-full" filterable>
              <el-option v-for="(item, index) in timeArr()" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="watchFreeType() && watchLockerType()" :span="12">
          <el-form-item label="免费时长" prop="cost.free_time">
            <el-input v-model="state.form.cost.free_time" clearable>
              <template #suffix> 分钟 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="watchLockerType()" :span="12">
          <el-form-item label="单位时长" prop="cost.per_time">
            <el-input v-model="state.form.cost.per_time" clearable>
              <template #suffix> 分钟 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="watchFreeType() && watchLockerType()" :span="12">
          <el-form-item label="封顶时长" prop="cost.top_time">
            <el-input v-model="state.form.cost.top_time" clearable>
              <template #suffix> 分钟 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="watchLockerType()" :span="12">
          <el-form-item label="超时时长" prop="cost.owing_time">
            <el-input v-model="state.form.cost.owing_time" clearable>
              <template #suffix> 分钟 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="watchFreeType()" :span="12">
          <el-form-item label="开门次数" prop="cost.unlock_count">
            <el-input v-model="state.form.cost.unlock_count"> </el-input>
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
import { buildForm, rules } from './model/index';
// import { postFeeRulesApi, putFeeRulesApi } from '@/api/operation';
import { lockerType, rulesType } from '@/enums';

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
});
const objectId = computed(() => props.params.id);
const formRef = ref();
const visible = ref();
const state = reactive({
  form: buildForm(props.params),
});

watch(
  () => props.params, // 监听非响应式数据
  (val) => {
    console.log('val: ', val);
    state.form = buildForm(val);
  },
);

const create = async () => {
  // const params = getParams();
  // const data = await postFeeRulesApi(params);
  // data.id && callback();
};

const update = async () => {
  // const params = getParams();
  // const data = await putFeeRulesApi(objectId.value, params);
  // data.id && callback();
};

// 处理收费规则字段
// const getParams = () => {
//   const clearTime = hoursToMinute(state.form.cost.end_time);
//   const per_money = handlePostMoney(state.form.cost.per_money);
//   const top_money = handlePostMoney(state.form.cost.top_money);
//   const cost = {
//     ...state.form.cost,
//     end_time: clearTime,
//     per_money,
//     top_money,
//     free_time: state.form.cost.free_time ?? 0,
//     top_time: state.form.cost.top_time ?? 0,
//   };
//   for (const key in cost) {
//     cost[key] = Number(cost[key]);
//   }
//   const deposit = handlePostMoney(state.form.deposit);
//   const prepaid = handlePostMoney(state.form.prepaid);
//   const forget_paid = handlePostMoney(state.form.forget_paid);
//   const forget_count = Number(state.form.forget_count);
//   return {
//     ...state.form,
//     cost,
//     deposit,
//     prepaid,
//     forget_paid,
//     forget_count,
//     node_id: route.query.id,
//   };
// };

// 免费的规则，不显示预付费、单位金额、封顶金额、免费时长、封顶时长、开门次数
const watchFreeType = () => {
  if (state.form.type === 1) {
    return false;
  }
  return true;
};

const watchLockerType = () => {
  if (state.form.type === 3) {
    return false;
  }
  return true;
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      (objectId.value ? update : create)();
    }
  });
};

const close = () => {
  visible.value = false;
  formRef.value.resetFields();
};

// const refresh = () => {
//   emit('fetch');
// };

// const callback = () => {
//   close();
//   refresh();
//   success(`${objectId.value ? '修改' : '新增'}成功`);
// };

defineExpose({ visible });
</script>
