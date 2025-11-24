<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑商户' : '新增商户'"
    width="900px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="180px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商户名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" class="w-full" placeholder="请选择状态">
              <el-option v-for="item in managerStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择合作商" prop="parent_id">
            <OrzSelect v-model:node-id="state.form.parent_id" v-model:item="parentItem" type="Agent" txt="选择合作商" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="state.form.contact" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="state.form.phone" clearable></el-input>
          </el-form-item>
        </el-col>
        <div v-if="state.form.parent_id" class="text-gray-500 text-sm w-full text-center mb-4">
          ------------- 分成设置 ------------
        </div>
        <template v-for="(item, index) in state.form.NodeListMap" :key="item.id">
          <el-col :span="12">
            <el-form-item :prop="`NodeListMap.${index}.value`" :rules="moneyOther[0]">
              <template #label>
                <EllipsisTip>{{ `${item?.name}` }}</EllipsisTip>
                <text class="whitespace-nowrap">{{ `(${typeMap[item?.type]})` }}比例：</text>
              </template>
              <el-input v-model.trim="item.value" clearable>
                <template #append>% </template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label="测试组织" prop="remark">
            <el-checkbox v-model="state.form.is_test"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="state.form.remark" :rows="2" type="textarea" clearable></el-input>
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
import { error, success } from '@/hooks/elementPlus/useMessage';
import { createShopsApi, getNodeTreeApi, updateShopsApi } from '@/api/app';
import { OrzSelect } from '@/components/Query';
import type { ShopForm } from '../types';
import { managerStatus } from '@/enums';
import { moneyOther } from '@/utils/pattern';
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
  cityLabel: [] as string[],
});
const parentItem = ref();
const typeMap = {
  Agent: '合作商',
  Shop: '商户',
  Company: '公司',
};

watch(
  () => props.params,
  (val) => {
    // 解析,后端可能序列化了两次
    const parsedRateMap =
      props.params?.rate_map && typeof props.params?.rate_map === 'string'
        ? JSONUtils.parse(props.params?.rate_map)
        : props.params?.rate_map || { company: undefined, shop: undefined };
    state.form = buildForm({ ...val, rate_map: parsedRateMap }) as ShopForm;
    console.log(state.form, 'state.form');
  },
);

watch(
  () => visible.value && state.form.parent_id, // 这里要监听visible，每次打开弹窗都要重新获取树
  async (val) => {
    console.log(val, 'val');
    // 添加时要清空
    if (!state.form.parent_id) return;
    if (!visible.value) return;
    state.form.NodeListMap = []; // 要先清空
    const { Result } = await getNodeTreeApi(state.form.parent_id);
    // 按服务器顺序排序
    Result.forEach((item) => {
      state.form.NodeListMap.unshift({ name: item?.name, type: item?.node_type, value: 0 });
    });
    // 需要自己加上商户分成比例
    state.form.NodeListMap.push({ name: '', type: 'Shop', value: 0 });

    // 编辑的时候要回显
    if (state.form?.rate_map) {
      const keylist = Object.keys(state.form.rate_map);
      state.form.NodeListMap[state.form.NodeListMap.length - 1].value = state.form.rate_map.shop;
      state.form.NodeListMap[0].value = state.form.rate_map.company;

      // 合作商
      keylist.forEach((key, index) => {
        if (index > 0 && index < keylist.length - 1) {
          if (index < state.form.NodeListMap.length - 1) {
            // 赋值映射中有的值，没有的清空为0
            state.form.NodeListMap[index].value = state.form.rate_map[key];
            if (index != 1) {
              // 第一个没有
              state.form.NodeListMap[index].agent_name = state.form.NodeListMap[index - 1].name;
            }
          } else {
            state.form.rate_map[key] = 0;
          }
        }
      });
    }
    console.log(state.form.NodeListMap, 'state.form.NodeListMap');
  },
);

const create = async () => {
  const params = useParams();
  const data = await createShopsApi(params);
  data?.Result?.id && callback();
};

const update = async () => {
  const params = useParams();
  state.form.parent_id === props.params.node?.parent?.name &&
    Object.assign(params, { parent_id: props.params.node?.parent?.id });
  const data = await updateShopsApi(objectId.value, params);
  data?.Result?.id && callback();
};

const useParams = () => {
  const { NodeListMap = [], rate_map = {} as any, ...rest } = state.form;
  // 分成比例
  if (NodeListMap.length > 0) {
    // 剔除平台、商户的
    const plat = Number(NodeListMap[0].value); // 第一个是平台
    const shop = Number(NodeListMap[NodeListMap.length - 1].value); // 最后一个是商户
    rate_map.company = plat;
    rate_map.shop = shop;
    console.log(NodeListMap, 'NodeListMap');
    NodeListMap.forEach((item, index) => {
      if (index > 0 && index < NodeListMap.length - 1) {
        rate_map[`agent${index}`] = Number(item.value);
      }
    });
  }
  const params = { ...rest, rate_map };
  params.rate_map = JSON.stringify(params.rate_map);
  return params;
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 分成比例总和必须为100%
      const sum = state.form.NodeListMap.reduce((prev, cur) => {
        return prev + Number(cur.value);
      }, 0);
      if (sum !== 100) {
        error('分成比例总和必须为100%');
        return;
      }
      (objectId.value ? update : create)();
    }
  });
};

const close = () => {
  formRef.value.resetFields();
  visible.value = false;
  state.form = buildForm({} as ShopForm) as ShopForm;
  // 重置合作商选择
  parentItem.value = null;
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
