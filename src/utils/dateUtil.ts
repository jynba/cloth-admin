import dayjs from 'dayjs';

// 常量
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATE_TIME_FORMAT_SECOND = 'YYYY-MM-DD HH:mm:ss';
export const DATE_TIME_SECOND = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

// 星期数据
export const weekDays = [
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 },
  { label: '日', value: 7 },
];

export const convertWeekRange = (weekList: number[]): string[] => {
  if (!Array.isArray(weekList) || weekList.length === 0) return [];
  // 按升序排序
  const sorted = [...weekList].sort((a, b) => a - b);
  const result: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      // 处理区间
      result.push(
        start === end
          ? `周${weekDays[start - 1].label}`
          : `周${weekDays[start - 1].label}至周${weekDays[end - 1].label}`,
      );
      start = end = sorted[i];
    }
  }
  // 最后一个区间
  result.push(
    start === end ? `周${weekDays[start - 1].label}` : `周${weekDays[start - 1].label}至周${weekDays[end - 1].label}`,
  );
  return result;
};

export function format(date, fmt = DATE_TIME_SECOND): string {
  if (!date) {
    return date;
  }
  return dayjs(date).format(fmt);
}

// 格式化日期时间
export function formatToDateTime(date, format = DATE_TIME_FORMAT): string {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

// 格式化日期
export function formatToDate(date, format = DATE_FORMAT): string {
  if (!date) {
    return '';
  }
  return formatToDateTime(date, format);
}

// 格式化时间戳
export function formatUnix(date, format = DATE_TIME_SECOND): string {
  if (!date) {
    return '';
  }
  const time = dayjs.unix(date).format(format);
  return time;
}

/**
 * 根据日期类型格式化时间戳
 * @param timestamp 时间戳（秒）
 * @param dateType 日期类型：1-日，2-月，3-年
 * @returns 格式化后的时间字符串
 */
export function formatDateByType(timestamp: number, dateType?: number): string {
  if (!timestamp) return '';
  const type = dateType || 1; // 默认按日
  if (type === 3) {
    // 按年
    return dayjs.unix(timestamp).format('YYYY');
  } else if (type === 2) {
    // 按月
    return dayjs.unix(timestamp).format('YYYY-MM');
  } else {
    // 按日
    return dayjs.unix(timestamp).format('YYYY-MM-DD');
  }
}

// 传入时间是今天
export const isToday = (date) => {
  return dayjs(date).isSame(new Date(), 'day');
};

// 最近七天
export const withLatestWeek = (format = DATE_FORMAT) => {
  const now = dayjs().format(format);
  const day7s = dayjs().subtract(7, 'day').format(format);
  return [day7s, now];
};

// 昨天一整天
export const yesterday = (format = DATE_FORMAT) => {
  const lastDayStart = dayjs().subtract(1, 'day').startOf('day').format(format);
  const lastDayEnd = dayjs().subtract(1, 'day').endOf('day').format(format);
  return [lastDayStart, lastDayEnd];
};

// 最近一周
export const getRecentWeekRange = (format = DATE_TIME_SECOND) => {
  const now = dayjs();
  const dayOfWeek = now.day(); // 获取当前是星期几，0 表示周日，1 表示周一，依此类推

  let startOfWeek, endOfWeek;

  if (dayOfWeek === 0) {
    // 如果今天是周日，返回上周一到上周六。
    startOfWeek = now.subtract(1, 'week').startOf('week').add(1, 'day').format(format); // 上周一
    endOfWeek = now.subtract(1, 'day').format(format); // 上周六
  } else if (dayOfWeek === 1) {
    // 如果今天是周一，返回上周一到上周日
    startOfWeek = now.subtract(1, 'week').startOf('week').add(1, 'day').format(format);
    endOfWeek = now.subtract(1, 'week').endOf('week').add(1, 'day').format(format);
  } else {
    // 如果今天是周二到周六，返回本周一到今天的前一天
    startOfWeek = now.startOf('week').add(1, 'day').format(format);
    endOfWeek = now.subtract(1, 'day').format(format);
  }

  return [startOfWeek, endOfWeek];
};

// 最近一个月
export const getRecentMonthRange = (format = DATE_FORMAT) => {
  const now = dayjs();
  const dayOfMonth = now.date(); // 获取当前是几号

  let startOfMonth, endOfMonth;

  if (dayOfMonth === 1) {
    // 如果今天是一号，返回上个月整月的区间时间戳
    startOfMonth = now.subtract(1, 'month').startOf('month').format(format);
    endOfMonth = now.subtract(1, 'month').endOf('month').format(format);
  } else {
    // 如果今天是二号及以后，返回本月一号至今天的前一天
    startOfMonth = now.startOf('month').format(format);
    endOfMonth = now.subtract(1, 'day').format(format);
  }

  return [startOfMonth, endOfMonth];
};

// 最近三个月
export const getRecentThreeMonthsRange = (format = DATE_FORMAT) => {
  const now = dayjs();
  const dayOfMonth = now.date(); // 获取当前是几号

  let startOfRange, endOfRange;

  if (dayOfMonth === 1) {
    // 如果今天是一号，返回前三个月整月的区间时间戳
    startOfRange = now.subtract(3, 'month').startOf('month').format(format);
    endOfRange = now.subtract(1, 'month').endOf('month').format(format);
  } else {
    // 如果今天是二号及以后，返回前两个月至本月一号的时间戳
    startOfRange = now.subtract(2, 'month').startOf('month').format(format);
    endOfRange = now.subtract(1, 'day').format(format);
  }

  return [startOfRange, endOfRange];
};

// 最近一周到前一天
export const lastWeek = (format = DATE_FORMAT) => {
  const lastDay = dayjs().subtract(1, 'day').format(format);
  const day8s = dayjs().subtract(8, 'day').format(format);
  return [day8s, lastDay];
};

// 最近一个月或几个月到前一天
export const withLastMonth = (month = 1, format = DATE_FORMAT) => {
  const lastDay = dayjs().subtract(1, 'day').format(format);
  const day8s = dayjs().subtract(month, 'month').format(format);
  return [day8s, lastDay];
};

// 最近一个月
export const lastMonth = (format = DATE_FORMAT) => {
  const lastDay = dayjs().startOf('month').subtract(1, 's').format(format);
  const day8s = dayjs().subtract(1, 'month').startOf('month').format(format);
  return [day8s, lastDay];
};

// 最近一年，返回根据当前年起始时间戳
export const lastYear = (format = DATE_FORMAT, year = new Date().getFullYear()) => {
  const startOfYear = dayjs(`${year}`).startOf('year').format(format);
  const endOfYear = dayjs(`${year}`).endOf('year').format(format);
  return [startOfYear, endOfYear];
};

// date2在date之后
export const isAfter = (date, date2) => {
  return dayjs(date).isAfter(date2);
};

// 分钟转 天小时分钟
export const mToDayhm = (value: number) => {
  value = Number(value);
  if (value === 1440) {
    return `1天`;
  }
  if (value === 60) {
    return `1小时`;
  }
  const time = [] as number[];
  const day = value / 60 / 24;
  const hour = (value / 60) % 24;
  const min = value % 60;
  time[0] = day > 0 ? day : 0;
  time[1] = hour > 0 ? hour : 0;
  time[2] = min > 0 ? min : 0;
  if (value > 1400) {
    return `${time[0]}天${time[1]}小时${time[2]}分钟`;
  } else if (value > 60) {
    return `${time[1]}小时${time[2]}分钟`;
  }
  return `${time[2]}分钟`;
};

/**
 * @description 获取当前时间
 * @return string
 */
export function getTimeState() {
  // 获取当前时间
  const timeNow = new Date();
  // 获取当前小时
  const hours = timeNow.getHours();
  // 判断当前时间段
  if (hours >= 6 && hours < 11) return `早上好 ⛅ `;
  if (hours >= 11 && hours < 13) return `中午好 🌞 `;
  if (hours >= 13 && hours < 18) return `下午好 🌞 `;
  if (hours >= 18 && hours < 24) return `晚上好 🌛 `;
  if (hours >= 0 && hours < 6) return `凌晨好 🌛 `;
}

export function getDaysBetween(start) {
  const now = new Date().getTime();
  const startDay = new Date(start).getTime();
  let time: number = (startDay - now) / (1 * 24 * 60 * 60 * 1000); // 天

  if (time > 0 && time < 1) {
    time = time * 1000 * 60; // 分钟
    return '1天';
  } else if (time === 0 || time < 0) {
    return '0天';
  } else {
    return Math.ceil((startDay - now) / (1 * 24 * 60 * 60 * 1000)) + '天';
  }
}

// 分钟转小时分钟
export function minuteToHours(minutes: number) {
  if (!minutes) return '00:00';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `00:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`;
  } else if (hours > 0 && hours < 10) {
    return `0${hours}:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`;
  }
  return `${hours}:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`;
}

// 小时转分钟
export function hoursToMinute(time: string) {
  if (!time) return;
  return Number(time.split(':')[0]) * 60 + Number(time.split(':')[1]);
}

// 分钟数转时间字符串 (HH:mm)
export function minutesToTimeString(minutes: number): string {
  if (!minutes && minutes !== 0) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// 时间字符串转分钟数
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, mins] = timeStr.split(':').map(Number);
  return hours * 60 + mins;
}

/**
 * @description 每月1到28日( 值 1- 28 )
 * @returns [{label: 每年月..日,value:1}]
 */
export const monthArr = () => {
  const res = [] as TimeArr[];
  for (let i = 0; i < 28; i++) {
    res.push({ label: `每月${i + 1}号`, value: i + 1 });
  }
  return res;
};

/**
 * @description 每年365天( 值 1- 365 )
 * @returns [{label: 每年第..天,value:1}]
 */
export const yearArr = () => {
  const res = [] as TimeArr[];
  for (let i = 0; i < 365; i++) {
    res.push({ label: `每年第${i + 1}天`, value: i + 1 });
  }
  return res;
};

/**
 * @description 0点到24点数组值，用于转分钟使用
 * @returns
 */
interface TimeArr {
  label: string;
  value: string | number;
  disabled?: boolean;
}
export const timeArr = (): TimeArr[] => {
  const arr = [] as TimeArr[];
  for (let j = 0; j < 24; j++) {
    for (let i = 0; i < 60; i++) {
      if (j < 10) {
        if (i < 10) {
          arr.push({
            label: '0' + j + ':0' + i,
            value: '0' + j + ':0' + i,
          });
        } else {
          arr.push({
            label: '0' + j + ':' + i,
            value: '0' + j + ':' + i,
          });
        }
      } else {
        if (i < 10) {
          arr.push({
            label: j + ':0' + i,
            value: j + ':0' + i,
          });
        } else {
          arr.push({
            label: j + ':' + i,
            value: j + ':' + i,
          });
        }
      }
    }
  }
  arr.push({
    label: '24:00',
    value: '24:00',
  });
  return arr;
};

export interface TimeRangeDisplay {
  startTime: string;
  endTime: string;
}
/**
 * 将时间范围显示格式转换为分钟数格式
 * @param timeRangesDisplay
 * @returns
 */
export const convertDisplayToTimeRanges = (timeRangesDisplay: TimeRangeDisplay[]): string[] => {
  return timeRangesDisplay
    .filter((range) => range.startTime && range.endTime)
    .map((range) => {
      const start = timeStringToMinutes(range.startTime);
      const end = timeStringToMinutes(range.endTime);
      return `${start}-${end}`;
    });
};
/**
 * 将时间范围字符串转换为时间范围显示格式
 * @param timeRanges
 * @returns
 */
export const convertTimeRangesToDisplay = (timeRanges: string[]): TimeRangeDisplay[] => {
  if (!timeRanges || timeRanges.length === 0) return [];
  return timeRanges.map((range) => {
    const [start, end] = range.split('-').map(Number);
    return {
      startTime: minutesToTimeString(start),
      endTime: minutesToTimeString(end),
    };
  });
};

export const dateUtil = dayjs;
