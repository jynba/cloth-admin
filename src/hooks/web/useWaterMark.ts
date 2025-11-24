import type { Ref } from 'vue';
import { isDef } from '@/utils/is';

const domSymbol = Symbol('watermark-dom');
export function useWaterMark(appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>) {
  const id = domSymbol.toString();
  const watermarkEl = shallowRef<HTMLElement>();

  // 绘制文字背景图
  function createBase64(str: string, date) {
    const can = document.createElement('canvas');
    const width = 200;
    const height = 140;
    Object.assign(can, { width, height });

    const cans = can.getContext('2d');
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120);
      cans.font = '15px Vedana';
      cans.fillStyle = 'rgba(0, 0, 0, 0.1)';
      cans.textAlign = 'left';
      cans.textBaseline = 'middle';
      cans.fillText(str, width / 20, height);
      cans.font = '15px Vedana';
      cans.translate(0, 20);
      cans.fillText(date, width / 20, height);
    }
    return can.toDataURL('image/png');
  }

  function updateWatermark(
    options: {
      width?: number;
      height?: number;
      str?: string;
      date?: string;
    } = {},
  ) {
    const el = unref(watermarkEl);
    if (!el) return;
    if (isDef(options.width)) {
      el.style.width = `${options.width}px`;
    }
    if (isDef(options.height)) {
      el.style.height = `${options.height}px`;
    }
    if (isDef(options.str)) {
      el.style.background = `url(${createBase64(options.str, options.date)}) left top repeat`;
    }
  }
  // 绘制水印层
  const createWatermark = (str: string, date: string) => {
    if (unref(watermarkEl)) {
      updateWatermark({ str, date });
      return id;
    }
    const div = document.createElement('div');
    watermarkEl.value = div;
    div.id = id;
    div.style.pointerEvents = 'none';
    div.style.top = '0px';
    div.style.right = '0px';
    div.style.left = '160px';
    div.style.position = 'absolute';
    div.style.zIndex = '10';
    const el = unref(appendEl);
    if (!el) return id;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ str, date, width, height });
    el.appendChild(div);
    return id;
  };
  // 监听窗口变化，更新水印
  const func = useThrottleFn(() => {
    const el = unref(appendEl);
    if (!el) return;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ height, width });
  }, 500);
  const clear = () => {
    const domId = unref(watermarkEl);
    watermarkEl.value = undefined;
    const el = unref(appendEl);
    if (!el) return;
    domId && el.removeChild(domId);
    window.removeEventListener('resize', func);
  };
  // 对外提供设置水印的方法
  function setWatermark(str: string, date: string) {
    createWatermark(str, date);
    // 监听窗口变化事件，只要不remove这个监听就一直存在
    window.addEventListener('resize', func);
    const instance = getCurrentInstance();
    if (instance) {
      onBeforeUnmount(() => {
        clear();
      });
    }
  }

  return { setWatermark };
}
