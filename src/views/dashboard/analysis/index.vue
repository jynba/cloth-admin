<template>
  <div class="content">
    <h2 class="text-lg font-bold mb-4">总览</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between items-center">
            <div class="inline-block text-base">网点总数</div>
            <div class="text-primary"><i-ep-place /></div>
          </div>
          <div class="mt-4 min-h-[60px]">
            <div class="text-3xl font-bold">{{ state.totalSiteCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between items-center">
            <div class="inline-block text-base">设备总数</div>
            <div class="text-primary"><i-ep-monitor /></div>
          </div>
          <div class="mt-4 min-h-[60px]">
            <div class="text-3xl font-bold">{{ state.totaldeviceCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" class="!flex justify-between">
        <el-card class="box-card w-1/2" shadow="never">
          <div class="flex justify-between items-center">
            <div class="inline-block text-base">在线设备</div>
          </div>
          <div class="mt-4 min-h-[60px]">
            <div class="text-3xl font-bold">{{ state.deviceOnlineCount }}</div>
          </div>
        </el-card>

        <el-card class="box-card w-1/2" shadow="never">
          <div class="flex justify-between items-center">
            <div class="inline-block text-base">离线设备</div>
          </div>
          <div class="mt-4 min-h-[60px]">
            <div class="text-3xl font-bold">{{ state.deviceOfflineCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between items-center">
            <div class="inline-block text-base">总GMV</div>
          </div>
          <div class="mt-4 min-h-[60px]">
            <div class="text-3xl font-bold">{{ handleMoney(state.totalGmv) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />

    <div class="mb-2 flex items-center gap-2">
      <el-date-picker v-model="state.currentDate" type="date" placeholder="选择日期" />
      <el-button type="primary" @click="resetCurrentDate">重置</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">网点数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.daySiteCount }}</div>
                <div class="text-sm mt-1">环比： {{ state.daySiteRate > 0 ? '+' : '' }}{{ state.daySiteRate }}%</div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.weekSiteCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">设备数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.dayDeviceCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.dayDeviceRate > 0 ? '+' : '' }}{{ state.dayDeviceRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.weekDeviceCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.dayOrderCount }}</div>
                <div class="text-sm mt-1">环比： {{ state.dayOrderRate > 0 ? '+' : '' }}{{ state.dayOrderRate }}%</div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.weekOrderCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.dayGmv }}</div>
                <div class="text-sm mt-1">环比： {{ state.dayGmvRate > 0 ? '+' : '' }}{{ state.dayGmvRate }}%</div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.weekGmv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" class="mt-4">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">客单价</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.dayCustomerUnitPrice }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.dayCustomerRate > 0 ? '+' : '' }}{{ state.dayCustomerRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.weekCustomerUnitPrice" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-divider />

    <div class="mb-2 flex items-center gap-2 xl:w-1/4">
      <el-date-picker
        v-model="state.pickerDaysRange"
        class="!bg-white !h-32px"
        type="daterange"
        placeholder="选择日期"
      />
      <el-button type="primary" @click="resetPickerDaysRange">重置</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">总GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerGmv }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerGmvRate > 0 ? '+' : '' }}{{ state.pickerGmvRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysGmv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">日均GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ (state.pickerGmv / state.pickerDays).toFixed(2) }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerGmvRate > 0 ? '+' : '' }}{{ state.pickerGmvRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysGmv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">台均GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceAvgGmv }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceAvgGmvRate > 0 ? '+' : '' }}{{ state.pickerDeviceAvgGmvRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceAvgGmv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">客单价</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ (state.pickerGmv / state.pickerOrderCount).toFixed(2) }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerCustomerUnitPriceRate > 0 ? '+' : '' }}{{ state.pickerCustomerUnitPriceRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysCustomerUnitPrice" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerOrderCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerOrderRate > 0 ? '+' : '' }}{{ state.pickerOrderRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysOrderCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">日均订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ (state.pickerOrderCount / state.pickerDays).toFixed(2) }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerOrderRate > 0 ? '+' : '' }}{{ state.pickerOrderRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysOrderCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">台均订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceAvgOrderCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceAvgOrderRate > 0 ? '+' : '' }}{{ state.pickerDeviceAvgOrderRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceAvgOrderCount" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增网点数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerSiteNewCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerSiteNewRate > 0 ? '+' : '' }}{{ state.pickerSiteNewRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysSiteNewCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceNewCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewCount" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceNewOrderCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewOrderRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewOrderRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewOrderCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备日均订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">
                  {{ (state.pickerDeviceNewOrderCount / state.pickerDays).toFixed(2) }}
                </div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewOrderRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewOrderRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewOrderCount" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备台均订单数</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceNewAvgOrderCount }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewAvgOrderRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewAvgOrderRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewAvgOrderCount" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceNewGmv }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewGmvRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewGmvRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewGmv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备日均GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ (state.pickerDeviceNewGmv / state.pickerDays).toFixed(2) }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewGmvRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewGmvRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewGmv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div class="inline-block text-base">新增设备台均GMV</div>
              </div>
              <div class="mt-4 min-h-[60px]">
                <div class="text-3xl font-bold">{{ state.pickerDeviceNewAvgGmv }}</div>
                <div class="text-sm mt-1">
                  环比： {{ state.pickerDeviceNewAvgGmvRate > 0 ? '+' : '' }}{{ state.pickerDeviceNewAvgGmvRate }}%
                </div>
              </div>
            </div>
            <LineEchart height="120px" width="120px" :params="state.pickerDaysDeviceNewAvgGmv" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { GetAllDetail, GetThisWeek, GetTotalOverview, GetWeekDetail } from '@/api/dashboard';
import { LineEchart } from './components';
import { handleMoney } from '@/utils/tools';
import { formatToDate } from '@/utils/dateUtil';
import dayjs from 'dayjs';
import type { AnalysisState } from './model';

const state = reactive<AnalysisState>({
  loading: false,
  // 设备总览数据
  totalSiteCount: 0,
  totaldeviceCount: 0,
  deviceOnlineCount: 0,
  deviceOfflineCount: 0,
  totalGmv: 0,

  // 单日数据
  currentDate: formatToDate(new Date()),
  days: 7,
  daysRange: [formatToDate(dayjs().subtract(6, 'day')), formatToDate(dayjs().add(1, 'day'))],

  daySiteCount: 0,
  daySiteRate: 0,
  weekSiteCount: { xData: [], uData: [] },

  dayDeviceCount: 0,
  dayDeviceRate: 0,
  weekDeviceCount: { xData: [], uData: [] },

  dayOrderCount: 0,
  dayOrderRate: 0,
  weekOrderCount: { xData: [], uData: [] },

  dayGmv: 0,
  dayGmvRate: 0,
  weekGmv: { xData: [], uData: [] },

  dayCustomerUnitPrice: 0,
  dayCustomerRate: 0,
  weekCustomerUnitPrice: { xData: [], uData: [] },

  // 多日数据
  pickerDaysRange: [formatToDate(dayjs().subtract(7, 'day')), formatToDate(dayjs().subtract(1, 'day'))],
  pickerDays: 7,
  searchDaysRange: [formatToDate(dayjs().subtract(14, 'day')), formatToDate(dayjs())],

  pickerGmv: 0,
  pickerGmvRate: 0,
  pickerDaysGmv: { xData: [], uData: [] },

  pickerDeviceAvgGmv: 0,
  pickerDeviceAvgGmvRate: 0,
  pickerDaysDeviceAvgGmv: { xData: [], uData: [] },

  pickerCustomerUnitPriceRate: 0,
  pickerDaysCustomerUnitPrice: { xData: [], uData: [] },

  pickerOrderCount: 0,
  pickerOrderRate: 0,
  pickerDaysOrderCount: { xData: [], uData: [] },

  pickerDeviceAvgOrderCount: 0,
  pickerDeviceAvgOrderRate: 0,
  pickerDaysDeviceAvgOrderCount: { xData: [], uData: [] },

  pickerSiteNewCount: 0,
  pickerSiteNewRate: 0,
  pickerDaysSiteNewCount: { xData: [], uData: [] },

  pickerDeviceNewCount: 0,
  pickerDeviceNewRate: 0,
  pickerDaysDeviceNewCount: { xData: [], uData: [] },

  pickerDeviceNewOrderCount: 0,
  pickerDeviceNewOrderRate: 0,
  pickerDaysDeviceNewOrderCount: { xData: [], uData: [] },

  pickerDeviceNewAvgOrderCount: 0,
  pickerDeviceNewAvgOrderRate: 0,
  pickerDaysDeviceNewAvgOrderCount: { xData: [], uData: [] },

  pickerDeviceNewGmv: 0,
  pickerDeviceNewGmvRate: 0,
  pickerDaysDeviceNewGmv: { xData: [], uData: [] },

  pickerDeviceNewAvgGmv: 0,
  pickerDeviceNewAvgGmvRate: 0,
  pickerDaysDeviceNewAvgGmv: { xData: [], uData: [] },
});

watch(
  () => state.currentDate,
  (newDate) => {
    state.daysRange = [formatToDate(dayjs(newDate).subtract(6, 'day')), formatToDate(dayjs(newDate).add(1, 'day'))];
    fetchDayData();
  },
);

watch(
  () => state.pickerDaysRange,
  (newDate) => {
    // 计算两个日期的天数差
    state.pickerDays = dayjs(newDate[1]).diff(dayjs(newDate[0]), 'day') + 1;
    state.searchDaysRange = [
      formatToDate(dayjs(newDate[0]).subtract(state.pickerDays, 'day')),
      formatToDate(dayjs(newDate[1]).add(1, 'day')),
    ];
    fetchDaysData();
  },
);

// 生成完整的日期范围数据（填充缺失的日期）
const generateFullDateRange = (currentDate: string, days: number) => {
  const today = new Date(currentDate);
  const result: string[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(today.getDate() + i);
    result.push(date.toISOString().split('T')[0]);
  }

  return result;
};

// 格式化API返回的日期
const formatApiDate = (dateString: string) => {
  return dateString.split('T')[0];
};

// 更新营收图表数据
const updateRevenueChart = (sourceData, currentDate: string, days: number, isMoney: boolean) => {
  const dateRange = generateFullDateRange(currentDate, days);

  // 创建日期映射，以便快速查找
  const dataMap: Record<string, any> = {};
  sourceData.forEach((item) => {
    dataMap[formatApiDate(item.date)] = item;
  });

  // 使用日期范围填充数据，缺失的设为0
  const xData: string[] = [];
  const uData: number[] = []; // 营收数据

  dateRange.forEach((date) => {
    xData.push(date);
    if (dataMap[date]) {
      let xdata = isMoney ? handleMoney(dataMap[date].data) : dataMap[date].data;
      xdata = Number(xdata.toFixed(2));
      uData.push(xdata);
    } else {
      uData.push(0);
    }
  });

  return {
    xData,
    uData,
  };
};

const genRateData = (currData: number[], prevData: number[]) => {
  const data = currData ? currData.reduce((a, b) => a + b, 0) : 0;
  const prev = prevData ? prevData.reduce((a, b) => a + b, 0) : 0;
  if (prev === 0) {
    return {
      data,
      rate: data > 0 ? 100 : 0,
    };
  }
  const rate = Number((((data - prev) / prev) * 100).toFixed(2));
  return {
    data,
    rate,
  };
};

// 统一处理日环比数据
const fetchDayRates = () => {
  // GMV
  const gmvRes = genRateData(state.weekGmv.uData.slice(-1), state.weekGmv.uData.slice(-2, -1));
  state.dayGmv = gmvRes.data;
  state.dayGmvRate = gmvRes.rate;
  // Site
  const siteRes = genRateData(state.weekSiteCount.uData.slice(-1), state.weekSiteCount.uData.slice(-2, -1));
  state.daySiteCount = siteRes.data;
  state.daySiteRate = siteRes.rate;
  // Device
  const deviceRes = genRateData(state.weekDeviceCount.uData.slice(-1), state.weekDeviceCount.uData.slice(-2, -1));
  state.dayDeviceCount = deviceRes.data;
  state.dayDeviceRate = deviceRes.rate;
  // Order
  const orderRes = genRateData(state.weekOrderCount.uData.slice(-1), state.weekOrderCount.uData.slice(-2, -1));
  state.dayOrderCount = orderRes.data;
  state.dayOrderRate = orderRes.rate;
  // Customer Unit Price
  const customerRes = genRateData(
    state.weekCustomerUnitPrice.uData.slice(-1),
    state.weekCustomerUnitPrice.uData.slice(-2, -1),
  );
  state.dayCustomerUnitPrice = Number(customerRes.data.toFixed(2));
  state.dayCustomerRate = customerRes.rate;
};

const fetchDayData = async () => {
  const total_data = await GetThisWeek({
    start_at: state.daysRange[0],
    end_at: state.daysRange[1],
  });
  state.weekGmv = updateRevenueChart(total_data.Result.gmv, state.daysRange[0], state.days, true);
  state.weekSiteCount = updateRevenueChart(total_data.Result.site, state.daysRange[0], state.days, false);
  state.weekDeviceCount = updateRevenueChart(total_data.Result.device, state.daysRange[0], state.days, false);
  state.weekOrderCount = updateRevenueChart(total_data.Result.order, state.daysRange[0], state.days, false);
  state.weekCustomerUnitPrice = updateRevenueChart(total_data.Result.customer, state.daysRange[0], state.days, true);
  fetchDayRates();
};

const resetCurrentDate = () => {
  state.currentDate = formatToDate(new Date());
};

const resetPickerDaysRange = () => {
  state.pickerDaysRange = [formatToDate(dayjs().subtract(7, 'day')), formatToDate(dayjs().subtract(1, 'day'))];
};

const fetchDaysData = async () => {
  const pickerDays = state.pickerDays;
  const searchDaysRange = state.searchDaysRange;
  const params = {
    start_at: searchDaysRange[0],
    end_at: searchDaysRange[1],
  };
  const all_detail: {
    Result: {
      customer: any[];
      device_gmv: any[];
      device_new: any[];
      gmv: any[];
      order: any[];
      order_count: any[];
      site_new: any[];
    };
  } = await GetAllDetail(params);

  // 统一处理
  const gmvRes = updateRevenueChart(all_detail.Result.gmv, searchDaysRange[0], pickerDays * 2, true);
  state.pickerDaysGmv = {
    xData: gmvRes.xData.slice(pickerDays),
    uData: gmvRes.uData.slice(pickerDays),
  };
  const gmvRateData = genRateData(gmvRes.uData.slice(pickerDays), gmvRes.uData.slice(0, pickerDays));
  state.pickerGmv = Number(gmvRateData.data.toFixed(2));
  state.pickerGmvRate = gmvRateData.rate;

  const deviceGmvRes = updateRevenueChart(all_detail.Result.device_gmv, searchDaysRange[0], pickerDays * 2, true);
  state.pickerDaysDeviceAvgGmv = {
    xData: deviceGmvRes.xData.slice(pickerDays),
    uData: deviceGmvRes.uData.slice(pickerDays),
  };
  const deviceGmvRateData = genRateData(deviceGmvRes.uData.slice(pickerDays), deviceGmvRes.uData.slice(0, pickerDays));
  state.pickerDeviceAvgGmv = Number((deviceGmvRateData.data / pickerDays).toFixed(2));
  state.pickerDeviceAvgGmvRate = deviceGmvRateData.rate;

  const customerRes = updateRevenueChart(all_detail.Result.customer, searchDaysRange[0], pickerDays * 2, true);
  state.pickerDaysCustomerUnitPrice = {
    xData: customerRes.xData.slice(pickerDays),
    uData: customerRes.uData.slice(pickerDays),
  };
  const customerRateData = genRateData(customerRes.uData.slice(pickerDays), customerRes.uData.slice(0, pickerDays));
  state.pickerCustomerUnitPriceRate = customerRateData.rate;

  const orderRes = updateRevenueChart(all_detail.Result.order, searchDaysRange[0], pickerDays * 2, false);
  state.pickerDaysOrderCount = {
    xData: orderRes.xData.slice(pickerDays),
    uData: orderRes.uData.slice(pickerDays),
  };
  const orderRateData = genRateData(orderRes.uData.slice(pickerDays), orderRes.uData.slice(0, pickerDays));
  state.pickerOrderCount = orderRateData.data;
  state.pickerOrderRate = orderRateData.rate;

  const deviceOrderRes = updateRevenueChart(all_detail.Result.order_count, searchDaysRange[0], pickerDays * 2, false);
  state.pickerDaysDeviceAvgOrderCount = {
    xData: deviceOrderRes.xData.slice(pickerDays),
    uData: deviceOrderRes.uData.slice(pickerDays),
  };
  const deviceOrderRateData = genRateData(
    deviceOrderRes.uData.slice(pickerDays),
    deviceOrderRes.uData.slice(0, pickerDays),
  );
  state.pickerDeviceAvgOrderCount = Number((deviceOrderRateData.data / pickerDays).toFixed(2));
  state.pickerDeviceAvgOrderRate = deviceOrderRateData.rate;

  const siteNewRes = updateRevenueChart(all_detail.Result.site_new, searchDaysRange[0], pickerDays * 2, false);
  state.pickerDaysSiteNewCount = {
    xData: siteNewRes.xData.slice(pickerDays),
    uData: siteNewRes.uData.slice(pickerDays),
  };
  const siteNewRateData = genRateData(siteNewRes.uData.slice(pickerDays), siteNewRes.uData.slice(0, pickerDays));
  state.pickerSiteNewCount = siteNewRateData.data;
  state.pickerSiteNewRate = siteNewRateData.rate;

  const deviceNewRes = updateRevenueChart(all_detail.Result.device_new, searchDaysRange[0], pickerDays * 2, false);
  state.pickerDaysDeviceNewCount = {
    xData: deviceNewRes.xData.slice(pickerDays),
    uData: deviceNewRes.uData.slice(pickerDays),
  };
  const deviceNewRateData = genRateData(deviceNewRes.uData.slice(pickerDays), deviceNewRes.uData.slice(0, pickerDays));
  state.pickerDeviceNewCount = deviceNewRateData.data;
  state.pickerDeviceNewRate = deviceNewRateData.rate;

  await fetchRateData();
};

const fetchRateData = async () => {
  const pickerDays = state.pickerDays;
  // 当前区间
  const currentDate = [
    formatToDate(state.pickerDaysRange[0]),
    formatToDate(dayjs(state.pickerDaysRange[1]).add(1, 'day')),
  ];
  // 前一周期
  const prevDate = [
    formatToDate(dayjs(state.pickerDaysRange[0]).subtract(pickerDays, 'day')),
    formatToDate(state.pickerDaysRange[0]),
  ];

  // 并发请求
  const [currentDetail, prevDetail]: [
    { Result: { avg_gmv: any[]; avg_order_count: any[]; gmv: any[]; order_count: any[] } },
    { Result: { avg_gmv: any[]; avg_order_count: any[]; gmv: any[]; order_count: any[] } },
  ] = await Promise.all([
    GetWeekDetail({
      start_at: currentDate[0],
      end_at: currentDate[1],
    }),
    GetWeekDetail({
      start_at: prevDate[0],
      end_at: prevDate[1],
    }),
  ]);

  // GMV
  const gmvCurr = updateRevenueChart(currentDetail.Result.gmv, currentDate[0], pickerDays, true);
  const gmvPrev = updateRevenueChart(prevDetail.Result.gmv, prevDate[0], pickerDays, true);
  state.pickerDaysDeviceNewGmv = gmvCurr; // 图表数据
  const gmvRateData = genRateData(gmvCurr.uData, gmvPrev.uData);
  state.pickerDeviceNewGmv = Number(gmvRateData.data.toFixed(2));
  state.pickerDeviceNewGmvRate = gmvRateData.rate;

  // 台均GMV
  const avgGmvCurr = updateRevenueChart(currentDetail.Result.avg_gmv, currentDate[0], pickerDays, true);
  const avgGmvPrev = updateRevenueChart(prevDetail.Result.avg_gmv, prevDate[0], pickerDays, true);
  state.pickerDaysDeviceNewAvgGmv = avgGmvCurr; // 图表数据
  const avgGmvRateData = genRateData(avgGmvCurr.uData, avgGmvPrev.uData);
  state.pickerDeviceNewAvgGmv = Number((avgGmvRateData.data / pickerDays).toFixed(2));
  state.pickerDeviceNewAvgGmvRate = avgGmvRateData.rate;

  // 订单数
  const orderCurr = updateRevenueChart(currentDetail.Result.order_count, currentDate[0], pickerDays, false);
  const orderPrev = updateRevenueChart(prevDetail.Result.order_count, prevDate[0], pickerDays, false);
  state.pickerDaysDeviceNewOrderCount = orderCurr; // 图表数据
  const orderRateData = genRateData(orderCurr.uData, orderPrev.uData);
  state.pickerDeviceNewOrderCount = orderRateData.data;
  state.pickerDeviceNewOrderRate = orderRateData.rate;

  // 台均订单数
  const avgOrderCurr = updateRevenueChart(currentDetail.Result.avg_order_count, currentDate[0], pickerDays, false);
  const avgOrderPrev = updateRevenueChart(prevDetail.Result.avg_order_count, prevDate[0], pickerDays, false);
  state.pickerDaysDeviceNewAvgOrderCount = avgOrderCurr; // 图表数据
  const avgOrderRateData = genRateData(avgOrderCurr.uData, avgOrderPrev.uData);
  state.pickerDeviceNewAvgOrderCount = Number((avgOrderRateData.data / pickerDays).toFixed(2));
  state.pickerDeviceNewAvgOrderRate = avgOrderRateData.rate;
};

// 数据统计
const getDashboardData = async () => {
  // 获取总览数据
  state.loading = true;
  const { Result } = await GetTotalOverview({});
  state.totaldeviceCount = Result.total;
  state.deviceOnlineCount = Result.online;
  state.deviceOfflineCount = Result.offline;
  state.totalSiteCount = Result.node_count;
  state.totalGmv = Result.data;
  state.loading = false;

  await fetchDayData();
  await fetchDaysData();
};

onMounted(async () => {
  await getDashboardData();
});
</script>

<style lang="scss" scoped>
.content {
  .panel {
    &-item {
      padding: 50px 20px;
      overflow: hidden;
      text-align: center;
      background: $bg-panel;
      margin-bottom: 20px;

      .name {
        font-size: 14px;
        font-weight: 600;
      }

      .content {
        font-size: 50px;
        font-weight: 700;
      }
    }
  }
}
</style>
