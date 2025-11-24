<template>
  <el-dialog
    v-model="isVisible"
    title="编辑二维码"
    width="45%"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="form">
      <el-row :gutter="20">
        <el-col v-if="params.hasOwnProperty('url')" :span="12">
          <el-form-item label="url" prop="url">
            <el-input v-model="form.url" clearable disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="二维码数量" prop="count">
            <el-input v-model="form.count" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属载体" prop="carrier">
            <el-select
              v-model="form.carrier"
              clearable
              placeholder="所属载体"
              filterable
              remote
              :remote-method="getCarriers"
            >
              <el-option v-for="item in carrierList" :key="item" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-debounce type="primary" :loading="isLoading" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { qrcodeForm, qrcodeStatus, rules } from '../model';
import { createQrCodesApi, getCarriersApi, updateQrCodesApi } from '@/api/system';
import { success } from '@/hooks/elementPlus/useMessage';
import { endLoading, isLoading, startLoading } from '@/hooks/elementPlus/useLoading';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: {
    'update:visible': (value: boolean) => typeof value === 'boolean',
    fetch: () => true,
  },
  setup(props, { emit }) {
    const isVisible = computed(() => props.visible);
    const objectId = computed(() => props.params.objectId);
    const formRef = ref();

    const state = reactive({
      form: qrcodeForm(props.params),
      qrcodeStatus,
      carrierList: [] as any,
    });

    watch(
      () => props.params,
      (val) => {
        state.form = qrcodeForm(val);
      },
    );

    const create = () => {
      const { count, ...rest } = state.form;
      startLoading();
      (async function next(i) {
        if (i > Math.round(state.form.count)) {
          endLoading();
          close();
          refresh();
          return;
        }
        const { scene_str } = await createQrCodesApi({ ...rest, type: 'xiaoiron' });
        if (scene_str) {
          next(i + 1);
        }
        success(`编号${scene_str}${objectId.value ? '修改' : '新增'}成功`);
      })(1);
    };

    const update = async () => {
      const { sceneStr } = await updateQrCodesApi(objectId.value, state.form);
      callback(sceneStr);
    };

    const submit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          (props.params.objectId ? update : create)();
        }
      });
    };

    const close = () => {
      emit('update:visible', false);
    };

    const refresh = () => {
      emit('fetch');
    };

    const callback = (sceneStr: string) => {
      close();
      refresh();
      success(`编号${sceneStr}${objectId.value ? '修改' : '新增'}成功`);
    };

    const getCarriers = async (query = '') => {
      await getCarriersApi({
        ordering: '-createdAt',
        search: query.trim(),
      }).then((res) => {
        state.carrierList = res.results;
      });
    };

    return { close, submit, getCarriers, isVisible, formRef, rules, isLoading, ...toRefs(state) };
  },
});
</script>
