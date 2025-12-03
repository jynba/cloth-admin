<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑模板' : '新增模板'"
    width="920px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="120px" :model="form" :rules="rules">
      <!-- 基础信息 -->
      <el-card shadow="never" class="mb-16">
        <template #header>
          <b>基础信息</b>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" clearable placeholder="请输入模板名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板类型" prop="type">
              <el-select v-model="form.type" class="w-full" placeholder="请选择类型" @change="onTypeChange">
                <el-option :value="1" label="个人" />
                <el-option :value="2" label="企业" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" class="w-full" placeholder="请选择分类(可选)">
                <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 默认量体数据 default_data -->
      <el-card shadow="never">
        <template #header>
          <b>默认量体数据</b>
        </template>

        <!-- 个人模板：按分类展示 -->
        <template v-if="form.type === 1">
          <!-- 上衣 -->
          <template v-if="form.category === 1">
            <h4 class="sec-title">上衣</h4>
            <el-row :gutter="20">
              <el-col :span="12" v-for="f in personalTopFields" :key="f.key">
                <el-form-item :label="f.label">
                  <el-input v-model="(form.default_data as any).top[f.key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- 裤装 -->
          <template v-if="form.category === 2">
            <h4 class="sec-title">裤装</h4>
            <el-row :gutter="20">
              <el-col :span="12" v-for="f in personalPantsFields" :key="f.key">
                <el-form-item :label="f.label">
                  <el-input v-model="(form.default_data as any).pants[f.key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- 裙装 -->
          <template v-if="form.category === 3">
            <h4 class="sec-title">裙装</h4>
            <el-row :gutter="20">
              <el-col :span="12" v-for="f in personalSkirtFields" :key="f.key">
                <el-form-item :label="f.label">
                  <el-input v-model="(form.default_data as any).skirt[f.key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>

        <!-- 企业模板：按分类展示 -->
        <template v-else>
          <!-- 上衣 -->
          <template v-if="form.category === 1">
            <h4 class="sec-title">上衣</h4>
            <el-row :gutter="20">
              <el-col :span="12" v-for="f in enterpriseTopFields" :key="f.key">
                <el-form-item :label="f.label">
                  <el-input-number
                    v-if="f.number"
                    v-model="(form.default_data as any).top[f.key]"
                    :min="0"
                    class="w-full"
                  />
                  <el-input v-else v-model="(form.default_data as any).top[f.key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- 裤装 -->
          <template v-if="form.category === 2">
            <h4 class="sec-title">裤装</h4>
            <el-row :gutter="20">
              <el-col :span="12" v-for="f in enterprisePantsFields" :key="f.key">
                <el-form-item :label="f.label">
                  <el-input v-model="(form.default_data as any).pants[f.key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- 裙装 -->
          <template v-if="form.category === 3">
            <h4 class="sec-title">裙装</h4>
            <el-row :gutter="20">
              <el-col :span="12" v-for="f in enterpriseSkirtFields" :key="f.key">
                <el-form-item :label="f.label">
                  <el-input v-model="(form.default_data as any).skirt[f.key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
      </el-card>

      <!-- 款式配置 specification (仅个人可用) -->
      <el-card v-if="form.type === 1" shadow="never" class="mb-16">
        <template #header>
          <b>款式配置</b>
        </template>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="品类">
              <el-select
                v-model="(form.default_data as any).style_config.category"
                class="w-full"
                placeholder="请选择品类"
              >
                <el-option label="衬衫" value="shirt" />
                <el-option label="西装" value="suit" />
                <el-option label="马甲" value="vest" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 衬衫款式 -->
        <el-row v-if="(form.default_data as any).style_config?.category === 'shirt'" :gutter="20">
          <el-col :span="24"><h4 class="sec-title">衬衫款式</h4></el-col>
          <el-col :span="12">
            <el-form-item label="主面料号">
              <el-input
                v-model="(form.default_data as any).style_config.shirt_style.main_fabric_no"
                placeholder="手动输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅面料号">
              <el-input
                v-model="(form.default_data as any).style_config.shirt_style.sub_fabric_no"
                placeholder="手动输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领型">
              <el-select
                v-model="(form.default_data as any).style_config.shirt_style.collar_type"
                class="w-full"
                placeholder="选择领型"
              >
                <el-option v-for="opt in collarTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配白">
              <el-switch v-model="(form.default_data as any).style_config.shirt_style.collar_with_white" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="袖型">
              <el-select
                v-model="(form.default_data as any).style_config.shirt_style.sleeve_type"
                class="w-full"
                placeholder="选择袖型"
              >
                <el-option v-for="opt in sleeveTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="袖配白">
              <el-switch v-model="(form.default_data as any).style_config.shirt_style.sleeve_with_white" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后身省">
              <el-select
                v-model="(form.default_data as any).style_config.shirt_style.back_pleat"
                class="w-full"
                placeholder="选择后身省"
              >
                <el-option v-for="opt in backPleatOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="胸袋">
              <el-select
                v-model="(form.default_data as any).style_config.shirt_style.chest_pocket"
                class="w-full"
                placeholder="选择胸袋"
              >
                <el-option v-for="opt in chestPocketOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门襟">
              <el-select
                v-model="(form.default_data as any).style_config.shirt_style.placket"
                class="w-full"
                placeholder="选择门襟"
              >
                <el-option v-for="opt in placketOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="衬">
              <el-input
                v-model="(form.default_data as any).style_config.shirt_style.lining"
                placeholder="常规 / 柔软"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级">
              <el-input v-model="(form.default_data as any).style_config.shirt_style.grade" placeholder="常规 / 经典" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纽扣">
              <el-input
                v-model="(form.default_data as any).style_config.shirt_style.button"
                placeholder="常规 / 珍贝"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绣花内容">
              <el-input v-model="(form.default_data as any).style_config.shirt_style.embroidery_content" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绣花颜色">
              <el-input v-model="(form.default_data as any).style_config.shirt_style.embroidery_color" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绣花部位">
              <el-input v-model="(form.default_data as any).style_config.shirt_style.embroidery_position" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="(form.default_data as any).style_config.shirt_style.remark"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 西装款式 -->
        <el-row v-if="(form.default_data as any).style_config?.category === 'suit'" :gutter="20" class="mt-16">
          <el-col :span="24"><h4 class="sec-title">西装款式</h4></el-col>
          <el-col :span="12">
            <el-form-item label="门襟">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.button_style"
                placeholder="单排扣 / 双排扣"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后开衩">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.vent"
                placeholder="无衩 / 中衩 / 双衩"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驳头">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.lapel"
                placeholder="平驳头 / 戗驳头 / 青果领"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驳头宽">
              <el-input v-model="(form.default_data as any).style_config.suit_style.lapel_width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="口袋">
              <el-input v-model="(form.default_data as any).style_config.suit_style.pocket" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="胸兜">
              <el-input v-model="(form.default_data as any).style_config.suit_style.chest_pocket" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="袖扣">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.sleeve_button"
                placeholder="真袖衩 / 假袖衩"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内部">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.inner_lining"
                placeholder="全里 / 半里"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.workmanship"
                placeholder="粘合衬 / 半毛衬 / 全毛衬"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="西裤褶">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.dress_pants"
                placeholder="无褶 / 单褶 / 双褶"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="脚口">
              <el-input
                v-model="(form.default_data as any).style_config.suit_style.leg_opening"
                placeholder="常规 / 外翻边"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="(form.default_data as any).style_config.suit_style.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
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
import type { PropType } from 'vue';
import { reactive, ref, watch, computed } from 'vue';
import { createTemplate, updateTemplate } from '@/api/app';
import { success } from '@/hooks/elementPlus/useMessage';
import type { StyleConfig, EnterpriseClothingData, PersonalClothingData } from './index';

const categoryOptions = [
  { label: '上衣', value: 1 },
  { label: '裤装', value: 2 },
  { label: '裙装', value: 3 },
];

interface TemplateForm {
  id?: number;
  name?: string;
  type?: 1 | 2; // 1: Personal, 2: Enterprise
  category?: number; //1-上衣, 2-裤装, 3-裙装
  default_data:
    | (PersonalClothingData & { style_config?: StyleConfig })
    | (EnterpriseClothingData & { style_config?: never });
}

const props = defineProps({
  params: {
    type: Object as PropType<Partial<TemplateForm>>,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch']);

const visible = ref(false);
const formRef = ref();
const objectId = computed(() => props.params?.id);

// 选项
const collarTypeOptions = [
  { label: '直角立领', value: 'A01' },
  { label: '圆角立领', value: 'A02' },
  { label: '尖领', value: 'A11' },
  { label: '领扣领', value: 'A12' },
  { label: '方领', value: 'A20' },
  { label: '开领', value: 'A21' },
  { label: '大开领', value: 'A22' },
  { label: '一字领', value: 'A23' },
  { label: '燕式领', value: 'A90' },
];
const sleeveTypeOptions = [
  { label: '截角袖', value: 'C01' },
  { label: '圆角袖', value: 'C02' },
  { label: '直角袖', value: 'C03' },
  { label: '法式袖', value: 'C04' },
];
const backPleatOptions = [
  { label: '无褶', value: 'B00' },
  { label: '中间褶', value: 'B01' },
  { label: '两侧褶', value: 'B02' },
  { label: '收腰省', value: 'B03' },
];
const chestPocketOptions = [
  { label: '无胸袋', value: 'P00' },
  { label: '截角袋', value: 'P01' },
  { label: '圆角袋', value: 'P02' },
  { label: '尖角袋', value: 'P03' },
];
const placketOptions = [
  { label: '平门襟', value: 'F01' },
  { label: '明门襟', value: 'F02' },
  { label: '暗门襟', value: 'F03' },
];

// 字段定义（用于循环渲染）
const personalTopFields = [
  { key: 'neck_circumference', label: '领围' },
  { key: 'shoulder_width', label: '肩宽' },
  { key: 'chest_circumference', label: '胸围' },
  { key: 'abdomen_circumference', label: '腹围' },
  { key: 'hip_circumference', label: '臀围' },
  { key: 'left_sleeve_length', label: '左袖长' },
  { key: 'right_sleeve_length', label: '右袖长' },
  { key: 'front_chest_width', label: '前胸宽' },
  { key: 'back_width', label: '后背宽' },
  { key: 'upper_arm_circumference', label: '大臂围' },
  { key: 'cuff_circumference', label: '袖口' },
  { key: 'front_length_with_remark', label: '前长(备注)' },
  { key: 'back_length_with_remark', label: '后长(备注)' },
  { key: 'bust_apex_height', label: '胸高点' },
  { key: 'bust_distance', label: '胸间距' },
  { key: 'front_waist_section', label: '前腰节' },
  { key: 'back_waist_section', label: '后腰节' },
  { key: 'remark', label: '备注' },
];
const personalPantsFields = [
  { key: 'waist_circumference', label: '腰围' },
  { key: 'hip_circumference', label: '臀围' },
  { key: 'rise_including_waist', label: '立裆含腰' },
  { key: 'crotch_including_waist', label: '通裆含腰' },
  { key: 'thigh_circumference', label: '大腿围' },
  { key: 'pants_length', label: '裤长' },
  { key: 'leg_opening', label: '裤口' },
  { key: 'remark', label: '备注' },
];
const personalSkirtFields = [
  { key: 'waist_circumference', label: '腰围' },
  { key: 'hip_circumference', label: '臀围' },
  { key: 'skirt_length', label: '裙长' },
  { key: 'remark', label: '备注' },
];

const enterpriseTopFields = [
  { key: 'neck_circumference', label: '领围', number: true },
  { key: 'shoulder_width', label: '肩宽', number: true },
  { key: 'chest_circumference', label: '胸围', number: true },
  { key: 'abdomen_circumference', label: '腹围', number: true },
  { key: 'hip_circumference', label: '臀围', number: true },
  { key: 'sleeve_length', label: '袖长', number: true },
  { key: 'upper_arm_circumference', label: '大臂围', number: true },
  { key: 'cuff_circumference', label: '袖口', number: true },
  { key: 'front_length_shirt', label: '前长(衬衫)', number: true },
  { key: 'back_length_shirt', label: '后长(衬衫)', number: true },
  { key: 'front_length_suit', label: '前长(西装)', number: true },
  { key: 'back_length_suit', label: '后长(西装)', number: true },
  { key: 'remark', label: '备注' },
];
const enterprisePantsFields = [
  { key: 'waist_circumference', label: '腰围' },
  { key: 'hip_circumference', label: '臀围' },
  { key: 'rise_including_waist', label: '立裆含腰' },
  { key: 'thigh_circumference', label: '大腿围' },
  { key: 'pants_length', label: '裤长' },
  { key: 'leg_opening', label: '裤口' },
  { key: 'remark', label: '备注' },
];
const enterpriseSkirtFields = [
  { key: 'waist_circumference', label: '腰围' },
  { key: 'hip_circumference', label: '臀围' },
  { key: 'skirt_length', label: '裙长' },
  { key: 'remark', label: '备注' },
];

const rules = {
  name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '模板类型不能为空', trigger: 'change' }],
};

const buildDefaultStyleConfig = (): StyleConfig => ({
  category: 'shirt',
  shirt_style: {
    main_fabric_no: '',
    sub_fabric_no: '',
    collar_type: '',
    collar_with_white: false,
    sleeve_type: '',
    sleeve_with_white: false,
    back_pleat: '',
    chest_pocket: '',
    placket: '',
    lining: '',
    grade: '',
    button: '',
    embroidery_content: '',
    embroidery_color: '',
    embroidery_position: '',
    remark: '',
  },
  suit_style: {
    button_style: '',
    vent: '',
    lapel: '',
    lapel_width: '',
    pocket: '',
    chest_pocket: '',
    sleeve_button: '',
    inner_lining: '',
    workmanship: '',
    dress_pants: '',
    leg_opening: '',
    remark: '',
  },
});

const buildPersonalData = (): PersonalClothingData => ({
  top: {
    neck_circumference: '',
    shoulder_width: '',
    chest_circumference: '',
    abdomen_circumference: '',
    hip_circumference: '',
    left_sleeve_length: '',
    right_sleeve_length: '',
    front_chest_width: '',
    back_width: '',
    upper_arm_circumference: '',
    cuff_circumference: '',
    front_length_with_remark: '',
    back_length_with_remark: '',
    bust_apex_height: '',
    bust_distance: '',
    front_waist_section: '',
    back_waist_section: '',
    remark: '',
  },
  pants: {
    waist_circumference: '',
    hip_circumference: '',
    rise_including_waist: '',
    crotch_including_waist: '',
    thigh_circumference: '',
    pants_length: '',
    leg_opening: '',
    remark: '',
  },
  skirt: {
    waist_circumference: '',
    hip_circumference: '',
    skirt_length: '',
    remark: '',
  },
});

const buildEnterpriseData = (): EnterpriseClothingData => ({
  top: {
    neck_circumference: 0,
    shoulder_width: 0,
    chest_circumference: 0,
    abdomen_circumference: 0,
    hip_circumference: 0,
    sleeve_length: 0,
    upper_arm_circumference: 0,
    cuff_circumference: 0,
    front_length_shirt: 0,
    back_length_shirt: 0,
    front_length_suit: 0,
    back_length_suit: 0,
    remark: '',
  },
  pants: {
    waist_circumference: '',
    hip_circumference: '',
    rise_including_waist: '',
    thigh_circumference: '',
    pants_length: '',
    leg_opening: '',
    remark: '',
  },
  skirt: {
    waist_circumference: '',
    hip_circumference: '',
    skirt_length: '',
    remark: '',
  },
});

const form = reactive<TemplateForm>({
  name: '',
  type: 1,
  category: undefined as number | undefined,
  default_data: { ...buildPersonalData(), style_config: buildDefaultStyleConfig() },
});

watch(
  () => props.params,
  (val) => {
    form.id = (val as any)?.id as number | undefined;
    form.name = (val as any)?.name || '';
    form.type = (((val as any)?.type as 1 | 2) ?? 1) as 1 | 2;
    form.category = (val as any)?.category || undefined;
    if (form.type === 1) {
      const incoming = (val as any)?.default_data || buildPersonalData();
      const sc = (incoming as any).style_config || buildDefaultStyleConfig();
      form.default_data = { ...(incoming as any), style_config: sc } as any;
    } else {
      const incoming = (val as any)?.default_data || buildEnterpriseData();
      if (incoming && (incoming as any).style_config) {
        delete (incoming as any).style_config;
      }
      form.default_data = incoming as any;
    }
    form.default_data = (val as any)?.default_data || (form.type === 1 ? buildPersonalData() : buildEnterpriseData());
  },
  { immediate: true },
);

const onTypeChange = () => {
  // 切换类型时，如果当前默认数据结构不匹配，则重建
  if (form.type === 1) {
    const isPersonal = (form.default_data as any)?.top?.left_sleeve_length !== undefined;
    if (!isPersonal) {
      form.default_data = { ...buildPersonalData(), style_config: buildDefaultStyleConfig() } as any;
    } else {
      // 若已有个人结构但缺少 style_config，则补齐
      if (!(form.default_data as any).style_config) {
        (form.default_data as any).style_config = buildDefaultStyleConfig();
      }
    }
  } else {
    const isEnterprise = (form.default_data as any)?.top?.sleeve_length !== undefined;
    if (!isEnterprise) form.default_data = buildEnterpriseData() as any;
    // 企业不保留 style_config
    if ((form.default_data as any).style_config) delete (form.default_data as any).style_config;
  }
};

const submit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    const payload: any = {
      name: form.name,
      type: form.type,
      category: form.category || undefined,

      default_data: form.default_data,
    };
    if (objectId.value) {
      await updateTemplate(objectId.value as number, payload);
      success('修改成功');
    } else {
      await createTemplate(payload);
      success('新增成功');
    }
    emit('fetch');
    visible.value = false;
  });
};

const close = () => {
  formRef.value?.resetFields?.();
  visible.value = false;
};

defineExpose({ visible });
</script>

<style scoped>
.mb-16 {
  margin-bottom: 16px;
}
.mt-16 {
  margin-top: 16px;
}
.w-full {
  width: 100%;
}
.sec-title {
  margin: 6px 0 8px;
  font-weight: 600;
}
</style>
