<template>
  <el-dialog
    v-model="dialogVisible"
    :title="objectId ? '编辑网点' : '新增网点'"
    width="680px"
    top="10vh"
    :before-close="close"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="state.form" :rules="rules" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="网点名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" placeholder="请选择状态" class="w-full">
              <el-option v-for="item in managerStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属商户" prop="parent_id">
            <OrzSelect v-model:node-id="state.form.parent_id" type="Shop" txt="选择所属商户" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联钉钉人员" prop="ding_staff_id">
            <el-select
              v-model="state.form.ding_staff_id"
              class="w-full"
              clearable
              filterable
              remote
              placeholder="选择钉钉人员"
              :remote-method="remoteStaffMethod"
              @clear="state.form.ding_staff_id = ''"
            >
              <el-option
                v-for="item in state.dingStaffList"
                :key="item.user_id"
                :label="item.name"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="营业时间" prop="time">
            <el-time-picker
              v-model="state.form.time"
              is-range
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          {{ state.form.time }}
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="state.form.contact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="state.form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="网点地址" prop="provinceAndCity">
            <AreaSelect v-model="state.form.provinceAndCity" size="default" style="width: 100%" type="region" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="state.form.address" clearable placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="耗材沟通群" prop="materiel_group_wechat">
            <el-input v-model="state.form.materiel_group_wechat" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="耗材对接人" prop="materiel_phone">
            <el-input v-model="state.form.materiel_phone" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网点对账群" prop="site_group_wechat">
            <el-input v-model="state.form.site_group_wechat" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对账对接人" prop="site_group_phone">
            <el-input v-model="state.form.site_group_phone" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="营业时间" prop="week_mask">
            <el-checkbox-group v-model="state.form.week_mask" size="small">
              <el-checkbox v-for="day in weekDays" :key="day.value" :label="day.value" :value="day.value">
                周{{ day.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="time_ranges">
            <div class="time-ranges-container">
              <!-- 时间范围列表 -->
              <div v-if="timeRangesDisplay.length > 0" class="time-ranges-list">
                <div v-for="(range, index) in timeRangesDisplay" :key="index" class="time-range-item">
                  <div class="time-range-input flex">
                    <el-time-picker
                      v-model="range.startTime"
                      class="!w-26"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="开始时间"
                      @change="updateTimeRange(index, 'start', $event)"
                    />
                    <span class="time-separator">至</span>
                    <el-time-picker
                      v-model="range.endTime"
                      class="!w-26"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="结束时间"
                      @change="updateTimeRange(index, 'end', $event)"
                    />
                  </div>
                  <div class="time-range-actions">
                    <el-button type="danger" size="small" :icon="Delete" circle @click="removeTimeRange(index)" />
                  </div>
                </div>
              </div>
              <!-- 添加时间范围按钮 -->
              <div class="add-time-range">
                <el-button type="primary" :icon="Plus" @click="addTimeRange"> 添加时间段 </el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="测试组织" prop="remark">
            <el-checkbox v-model="state.form.is_test"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="state.form.remark" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button v-debounce type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Delete, Plus } from '@element-plus/icons-vue';
import { buildForm, rules } from './model';
import { managerStatus } from '@/enums';
import { createSiteApi, getDingStaffApi, updateSiteApi } from '@/api/app';
import { error, success } from '@/hooks/elementPlus/useMessage';
import type { TimeRangeDisplay } from '@/utils/dateUtil';
import {
  convertDisplayToTimeRanges,
  convertTimeRangesToDisplay,
  timeStringToMinutes,
  weekDays,
} from '@/utils/dateUtil';
import type { SiteForm } from '../types';

interface EditProps {
  visible?: boolean;
  params?: SiteForm;
}
const props = withDefaults(defineProps<EditProps>(), {
  visible: false,
});
const emit = defineEmits(['update:visible', 'search']);
const formRef = ref();
const objectId = computed(() => props.params?.id);
const dialogVisible = computed(() => props.visible);
const state = reactive<Record<string, any>>({
  form: buildForm(),
  dingStaffList: [],
});

// 时间范围显示数据（用于 el-time-picker）
const timeRangesDisplay = ref<TimeRangeDisplay[]>([]);

// 添加时间范围
const addTimeRange = () => {
  timeRangesDisplay.value.push({
    startTime: '',
    endTime: '',
  });
  updateFormTimeRanges();
};

// 删除时间范围
const removeTimeRange = (index: number) => {
  timeRangesDisplay.value.splice(index, 1);
  updateFormTimeRanges();
};

// 更新时间范围
const updateTimeRange = (index: number, type: 'start' | 'end', value: string) => {
  if (type === 'start') {
    timeRangesDisplay.value[index].startTime = value;
  } else {
    timeRangesDisplay.value[index].endTime = value;
  }
  updateFormTimeRanges();
};

// 更新表单中的时间范围数据
const updateFormTimeRanges = () => {
  state.form.time_ranges = convertDisplayToTimeRanges(timeRangesDisplay.value);
};
// 初始化时间范围（确保至少有一个空的时间段）
const initializeTimeRanges = () => {
  if (timeRangesDisplay.value.length === 0) {
    timeRangesDisplay.value = [
      {
        startTime: '',
        endTime: '',
      },
    ];
  }
};

const remoteStaffMethod = async (query?: string) => {
  const { Result = [] } = await getDingStaffApi({
    skip: 0,
    limit: 100,
    name: query && query !== ' ' ? query : undefined,
  });
  state.dingStaffList = Result;
};

watch(
  () => props.visible,
  (visible) => {
    if (visible && !props.params) {
      // 新增时初始化一个空的时间段
      initializeTimeRanges();
    }
  },
);

watch(
  () => props.params,
  (val) => {
    state.form = buildForm(val);
    if (val?.province && val?.city && val?.area) {
      const { province, city, area } = state.form;
      state.form.provinceAndCity = [province, city, area];
    }

    // 初始化时间范围显示数据
    if (val?.time_ranges && val.time_ranges.length > 0) {
      timeRangesDisplay.value = convertTimeRangesToDisplay(val.time_ranges);
    } else {
      // 默认展示一个空的时间段
      timeRangesDisplay.value = [
        {
          startTime: '',
          endTime: '',
        },
      ];
    }
  },
  { immediate: true },
);

const update = async () => {
  const params = useParams();
  if (!params) return; // 如果验证失败，直接返回
  state.form.parent_id === props.params?.node?.parent?.name &&
    Object.assign(params, { parent_id: props.params?.node?.parent_id });
  params.ding_staff_id === props.params?.ding_staff?.name && (params.ding_staff_id = props.params?.ding_staff_id);
  console.log(params, 'params');

  const data = await updateSiteApi(objectId.value, params);
  data?.Result?.id && callback();
};

const create = async () => {
  const params = useParams();
  if (!params) return; // 如果验证失败，直接返回
  const data = await createSiteApi(params);
  data?.Result?.id && callback();
};

const useParams = () => {
  const params = {
    ...state.form,
  };
  params.province = params.provinceAndCity[0] ?? '';
  params.city = params.provinceAndCity[1] ?? '';
  params.area = params.provinceAndCity[2] ?? '';

  // 更新时间范围数据
  updateFormTimeRanges();

  // 验证时间段完整性和边界条件
  const validTimeRanges: TimeRangeDisplay[] = [];

  for (let i = 0; i < timeRangesDisplay.value.length; i++) {
    const range = timeRangesDisplay.value[i];

    // 跳过空的时间段
    if (!range.startTime && !range.endTime) {
      continue;
    }

    // 检查时间段是否完整
    if (!range.startTime || !range.endTime) {
      error(`第${i + 1}个时间段：请完整填写开始时间和结束时间`);
      return;
    }

    const startMinutes = timeStringToMinutes(range.startTime);
    const endMinutes = timeStringToMinutes(range.endTime);

    // 检查开始时间是否早于结束时间
    if (startMinutes > endMinutes) {
      error(`第${i + 1}个时间段：开始时间必须早于结束时间`);
      return;
    }

    validTimeRanges.push(range);
  }

  // 检查时间段之间是否存在交叉
  for (let i = 0; i < validTimeRanges.length; i++) {
    const currentRange = validTimeRanges[i];
    const currentStart = timeStringToMinutes(currentRange.startTime);
    const currentEnd = timeStringToMinutes(currentRange.endTime);

    for (let j = i + 1; j < validTimeRanges.length; j++) {
      const otherRange = validTimeRanges[j];
      const otherStart = timeStringToMinutes(otherRange.startTime);
      const otherEnd = timeStringToMinutes(otherRange.endTime);

      // 检查时间段是否重叠
      if (currentStart < otherEnd && otherStart < currentEnd) {
        error(
          `时间段存在交叉：${currentRange.startTime}-${currentRange.endTime} 与 ${otherRange.startTime}-${otherRange.endTime}`,
        );
        return;
      }
    }
  }

  // 星期和时间段必须同时设置或同时为空
  const weekSet = Array.isArray(state.form.week_mask) && state.form.week_mask.length > 0;
  const timeSet = validTimeRanges.length > 0;

  if ((weekSet && !timeSet) || (!weekSet && timeSet)) {
    error('星期和时间段必须同时设置或同时为空');
    return;
  }

  return params;
};
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      objectId.value ? update() : create();
    }
  });
};

const callback = () => {
  success(`${objectId.value ? '修改' : '新增'}成功`);
  close();
  emit('search');
};
const close = () => {
  emit('update:visible', false);
  formRef.value.resetFields();
};
</script>

<style lang="scss" scoped>
.time-ranges-container {
  .time-ranges-list {
    margin-bottom: 16px;

    .time-range-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 12px;

      .time-range-input {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;

        .time-separator {
          color: #909399;
          font-weight: 500;
        }

        :deep(.el-time-picker) {
          width: 140px;
        }
      }

      .time-range-actions {
        flex-shrink: 0;
      }
    }
  }

  .add-time-range {
    margin-bottom: 12px;
  }

  .time-range-tip {
    color: #909399;
    font-size: 12px;
    background-color: #f5f7fa;
    padding: 8px 12px;
    border-radius: 4px;
    border-left: 4px solid #409eff;
  }
}

:deep(.el-checkbox-group) {
  .el-checkbox {
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
