/**
 * @description v-debounce
 * @description 按钮防抖，防止重复请求
 * @param app
 */

const debounce = {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 1000);
      }
    });
  },
};

export default debounce;
