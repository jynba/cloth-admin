<template>
  <el-dialog v-model="visible" title="业务配置" width="1400px" destroy-on-close :close-on-click-modal="false">
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state">
      <el-row>
        <el-col :span="24">
          <el-form-item label="AI视频:" prop="ai_video_enable">
            <el-radio-group v-model="state.ai_video_enable" @change="onAiVideoEnableChange">
              <el-radio :value="false">关闭</el-radio>
              <el-radio :value="true">开启</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="state.ai_video_enable">
        <el-col :span="24">
          <el-form-item label="视频模板:">
            <div class="w-full">
              <TablePro :data="state.video_templates" :total="state.count" :query="query" @page-next="fetchTemplates">
                <template #table>
                  <el-table :data="state.video_templates">
                    <el-table-column min-width="100">
                      <template #header>
                        <span>模板名称</span>
                        <span class="text-red-500">*</span>
                      </template>
                      <template #default="{ row, $index }">
                        <el-input
                          v-if="state.editingIndex === $index"
                          v-model="row.template_name"
                          placeholder="请输入模板名称"
                          type="textarea"
                          :rows="3"
                        />
                        <span v-else>{{ row.template_name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="120">
                      <template #header>
                        <span>模板参数</span>
                        <span class="text-red-500">*</span>
                      </template>
                      <template #default="{ row, $index }">
                        <el-input
                          v-if="state.editingIndex === $index"
                          v-model="row.template_params"
                          placeholder="请输入模板参数"
                          type="textarea"
                          :rows="3"
                        />
                        <span v-else>{{ row.template_params }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="prompt" min-width="200">
                      <template #default="{ row, $index }">
                        <el-input
                          v-if="state.editingIndex === $index"
                          v-model="row.prompt"
                          placeholder="请输入prompt"
                          type="textarea"
                          :rows="3"
                        />
                        <div v-else class="max-h-[72px] overflow-y-auto">{{ row.prompt }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="seed" width="100">
                      <template #default="{ row, $index }">
                        <el-input-number
                          v-if="state.editingIndex === $index"
                          v-model="row.seed"
                          :min="0"
                          :step="1"
                          controls-position="right"
                          style="width: 88px"
                        />
                        <span v-else>{{ row.seed }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="水印" width="200">
                      <template #default="{ row, $index }">
                        <div v-if="state.editingIndex === $index" class="flex flex-col gap-2">
                          <el-radio-group v-model="row.watermark" size="small">
                            <el-radio :value="true">有水印</el-radio>
                            <el-radio :value="false">无水印</el-radio>
                          </el-radio-group>
                          <template v-if="row.watermark">
                            <div class="w-full flex items-center gap-8px truncate">
                              <span class="w-70px">水印位置：</span>
                              <el-select
                                v-model="row.wm_position"
                                placeholder="选择位置"
                                :disabled="!row.watermark"
                                size="small"
                                style="width: 100%"
                              >
                                <el-option
                                  v-for="item in watermarkPositionOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                />
                              </el-select>
                            </div>
                            <div class="w-full flex items-center gap-8px truncate">
                              <span class="w-70px">水印图片：</span>
                              <UploadFile
                                v-model:value="row.wm_url"
                                class="flex-1 truncate"
                                type="image"
                                :disabled="!row.watermark"
                                :max-size="5"
                              />
                            </div>
                          </template>
                        </div>
                        <div v-else class="flex flex-col gap-1">
                          <div>{{ row.watermark ? '有水印' : '无水印' }}</div>
                          <template v-if="row.watermark">
                            <div class="w-full truncate">
                              水印位置：{{
                                watermarkPositionOptions.find((item) => item.value === row.wm_position)?.label
                              }}
                            </div>
                            <el-tooltip v-if="row.wm_url" :content="row.wm_url" placement="top">
                              <div class="w-full truncate">
                                水印图片：<span class="line-clamp-1 truncate">{{ row.wm_url }}</span>
                              </div>
                            </el-tooltip>
                          </template>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column width="120">
                      <template #header>
                        <span>样例视频</span>
                        <span class="text-red-500">*</span>
                      </template>
                      <template #default="{ row, $index }">
                        <UploadFile
                          v-if="state.editingIndex === $index"
                          v-model:value="row.sample_video"
                          type="video"
                          :max-size="200"
                        />
                        <el-tooltip v-else :content="row.sample_video || '未上传'" placement="top">
                          <div class="video-url-ellipsis">{{ row.sample_video ? row.sample_video : '未上传' }}</div>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" align="center">
                      <template #header>
                        <div class="flex items-center justify-center">
                          <span>排序</span>
                          <span class="text-red-500">*</span>
                          <el-tooltip content="数字越大，排序越前" placement="top">
                            <i-ep-warning class="ml-1 cursor-pointer text-gray-400" />
                          </el-tooltip>
                        </div>
                      </template>
                      <template #default="{ row, $index }">
                        <el-input-number
                          v-if="state.editingIndex === $index"
                          v-model="row.sort_order"
                          :min="1"
                          :step="1"
                          controls-position="right"
                          style="width: 88px"
                        />
                        <span v-else>{{ row.sort_order }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center" fixed="right">
                      <template #default="{ $index }">
                        <el-button
                          v-if="state.editingIndex !== $index"
                          type="primary"
                          link
                          size="small"
                          @click="handleEdit($index)"
                        >
                          编辑
                        </el-button>
                        <el-button v-else type="success" link size="small" @click="saveTemplate($index)">
                          保存
                        </el-button>
                        <el-button type="danger" link size="small" @click="deleteTemplate($index)"> 删除 </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </TablePro>
              <el-button type="primary" link class="mt-2" @click="addTemplate">
                <i-ep-plus class="mr-1" />
                新增
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { rules } from './model';
import { error, success, warning } from '@/hooks/elementPlus/useMessage';
import {
  createBusinessConfigApi,
  getBusinessConfigApi,
  updateBusinessConfigApi,
  updateBusinessConfigSwitchApi,
} from '@/api/app';
import { deleteBusinessConfigApi } from '@/api/app/index';
import type { IBusinessConfig, ShopForm } from '../types';
import { ElMessageBox } from 'element-plus';
import UploadFile from '@/components/upload/UploadFile.vue';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';

const props = defineProps({
  params: {
    type: Object as PropType<ShopForm>,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch']);
const watermarkPositionOptions = [
  { label: '左上角', value: 1 },
  { label: '右上角', value: 2 },
  { label: '右下角', value: 3 },
  { label: '左下角', value: 4 },
];
const shopId = computed(() => props.params?.id);
const formRef = ref();
const visible = ref(false);
const state = reactive({
  ai_video_enable: props.params?.ai_video_enable || false, // AI视频开关
  video_templates: [] as IBusinessConfig[], // 视频模板列表
  count: 0, // 模板数量
  editingIndex: null as number | null, // 当前编辑的行索引
});
const { query } = usePagination({ limit: 10 });

watch(
  () => props.params,
  async (val) => {
    if (val && val.id) {
      state.editingIndex = null;
      state.ai_video_enable = val.ai_video_enable || false;
      await fetchTemplates();
    }
  },
);

/** 获取视频模板列表 */
const fetchTemplates = async () => {
  if (!shopId.value) return;
  startLoading();
  const { Result, Count } = await getBusinessConfigApi('', {
    shop_id: shopId.value,
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  }).finally(() => {
    endLoading();
  });
  state.video_templates = Result;
  state.count = Count;
  state.editingIndex = null;
};

// AI视频开关切换时同步接口
const onAiVideoEnableChange = async (val: boolean) => {
  if (!shopId.value) return;
  try {
    startLoading();
    await updateBusinessConfigSwitchApi(shopId.value, { ai_video_enable: val });
    refresh();
  } catch {
    warning('切换失败');
    refresh();
  } finally {
    endLoading();
  }
};

/** 新增模板 */
const addTemplate = () => {
  if (state.editingIndex !== null) {
    warning('请先保存当前编辑项');
    return;
  }
  // 默认值
  state.video_templates.push({
    prompt: '',
    sample_video: '',
    template_name: '',
    template_params: '',
    seed: 0,
    watermark: false,
    wm_position: 3,
    wm_url: '',
    shop_id: '',
    shop: null,
    created_at: '',
    updated_at: '',
    sort_order: state.count + 1,
  });
  state.editingIndex = state.video_templates.length - 1;
};

const handleEdit = (index: number) => {
  if (state.editingIndex !== null) {
    warning('请先保存当前编辑项');
    return;
  }
  state.editingIndex = index;
};

/** 保存模板 */
const saveTemplate = async (index: number) => {
  const row = state.video_templates[index];
  // 验证必填项
  if (!row.template_name || !row.template_params || !row.sample_video || !row.sort_order) {
    warning('请完善必填项');
    return;
  }

  const params = {
    shop_id: shopId.value,
    template_name: row.template_name,
    template_params: row.template_params,
    prompt: row.prompt,
    seed: row.seed,
    watermark: row.watermark,
    wm_position: row.wm_position,
    wm_url: row.wm_url,
    sample_video: row.sample_video,
    sort_order: row.sort_order,
  };

  try {
    let res;
    if (row?.id) {
      res = await updateBusinessConfigApi(row.id, { ...params });
    } else {
      res = await createBusinessConfigApi({ ...params });
    }
    if (!res?.Result) {
      error(res.ErrMsg || '保存失败');
      return;
    }
    state.editingIndex = null;
    success('保存成功');
    refresh();
  } catch (e) {
    console.log('error', e);
  }
};

/** 删除模板 */
const deleteTemplate = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该模板吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const row = state.video_templates[index];
    if (row?.id) {
      const res = await deleteBusinessConfigApi(row.id);
      if (!res?.Result) {
        error(res.ErrMsg || '删除失败');
        return;
      }
      success('删除成功');
      await fetchTemplates();
    } else {
      state.video_templates.splice(index, 1);
      success('删除成功');
    }
    state.editingIndex = null;
  } catch {
    // 用户取消删除
  }
};

const refresh = () => {
  fetchTemplates();
  emit('fetch');
};

defineExpose({ visible });
</script>

<style lang="scss" scoped>
.video-url-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
  line-height: 1.5;
  max-height: 4.5em; /* 3行 * 1.5行高 */
}
</style>
