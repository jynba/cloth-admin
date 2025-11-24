import { ref } from 'vue';
import NProgress from 'nprogress';

export const isLoading = ref(false);

export const startLoading = () => {
  isLoading.value = true;
};

export const endLoading = () => {
  isLoading.value = false;
};

export const useLoading = () => {
  let needLoadingRequestCount = 0;

  const endLoading = () => {
    NProgress.done();
  };

  const openLoading = () => {
    if (needLoadingRequestCount === 0) {
      NProgress.start();
    }

    needLoadingRequestCount++;
  };

  const closeLoading = () => {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;

    if (needLoadingRequestCount === 0) {
      endLoading();
    }
  };

  return [openLoading, closeLoading];
};
