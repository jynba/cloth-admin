export interface AnalysisState {
  loading: boolean;

  // 设备总览数据
  totaldeviceCount: number;
  deviceOnlineCount: number;
  deviceOfflineCount: number;
  totalSiteCount: number;
  totalGmv: number;

  // 单日数据
  currentDate: string;
  days: number;
  daysRange: string[];

  daySiteCount: number;
  daySiteRate: number;
  weekSiteCount: BarData;

  dayDeviceCount: number;
  dayDeviceRate: number;
  weekDeviceCount: BarData;

  dayOrderCount: number;
  dayOrderRate: number;
  weekOrderCount: BarData;

  dayGmv: number;
  dayGmvRate: number;
  weekGmv: BarData;

  dayCustomerUnitPrice: number;
  dayCustomerRate: number;
  weekCustomerUnitPrice: BarData;

  // 多日数据
  pickerDaysRange: string[];
  pickerDays: number;
  searchDaysRange: string[];

  pickerGmv: number;
  pickerGmvRate: number;
  pickerDaysGmv: BarData;

  pickerDeviceAvgGmv: number;
  pickerDeviceAvgGmvRate: number;
  pickerDaysDeviceAvgGmv: BarData;

  pickerCustomerUnitPriceRate: number;
  pickerDaysCustomerUnitPrice: BarData;

  pickerOrderCount: number;
  pickerOrderRate: number;
  pickerDaysOrderCount: BarData;

  pickerDeviceAvgOrderCount: number;
  pickerDeviceAvgOrderRate: number;
  pickerDaysDeviceAvgOrderCount: BarData;

  pickerSiteNewCount: number;
  pickerSiteNewRate: number;
  pickerDaysSiteNewCount: BarData;

  pickerDeviceNewCount: number;
  pickerDeviceNewRate: number;
  pickerDaysDeviceNewCount: BarData;

  pickerDeviceNewOrderCount: number;
  pickerDeviceNewOrderRate: number;
  pickerDaysDeviceNewOrderCount: BarData;

  pickerDeviceNewAvgOrderCount: number;
  pickerDeviceNewAvgOrderRate: number;
  pickerDaysDeviceNewAvgOrderCount: BarData;

  pickerDeviceNewGmv: number;
  pickerDeviceNewGmvRate: number;
  pickerDaysDeviceNewGmv: BarData;

  pickerDeviceNewAvgGmv: number;
  pickerDeviceNewAvgGmvRate: number;
  pickerDaysDeviceNewAvgGmv: BarData;
}

export interface BarData {
  xData: string[];
  uData: number[];
}
