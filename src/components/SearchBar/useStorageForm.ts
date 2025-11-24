import type { Ref } from 'vue';

// type storageFieldString =
//   | 'cabinetSearch'
//   | 'operationCoupons'
//   | 'operationConfig'
//   | 'operationProductLib'
//   | 'cabinet'
//   | 'member'
//   | 'monitor'
//   | 'Lunch'
//   | 'Storage'
//   | 'SwimRing'
//   | 'Agent'
//   | 'Company'
//   | 'Platform'
//   | 'Shop'
//   | 'Site'
//   | 'AgentAdmin'
//   | 'CompanyAdmin'
//   | 'PlatformAdmin'
//   | 'ShopAdmin'
//   | 'SiteAdmin';

// const keys = [
//   'cabinetSearch',
//   'operationCoupons',
//   'operationConfig',
//   'operationProductLib',
//   'cabinet',
//   'member',
//   'monitor',
//   'Lunch',
//   'Storage',
//   'SwimRing',
//   'Agent',
//   'Company',
//   'Platform',
//   'Shop',
//   'Site',
//   'AgentAdmin',
//   'CompanyAdmin',
//   'PlatformAdmin',
//   'ShopAdmin',
//   'SiteAdmin'
// ];

export const useStorageForm = (storageField: Ref<string>) => {
  // const setFormToItem = () => {
  //   // 只保存有值的内容，暂不考虑嵌套
  //   for (const key in form) {
  //     if (Object.prototype.hasOwnProperty.call(form, key)) {
  //       const item = form[key];
  //       if (typeof item !== 'object') {
  //         if (item || item === false || item === 0) {
  //           if (typeof item === 'string') {
  //             form[key] = form[key].trim();
  //           }
  //         } else {
  //           delete form[key];
  //         }
  //       }
  //       if (Array.isArray(item) && item.length === 0) delete form[key];
  //       if (Object.prototype.toString.call(item) === '[object Object]' && Object.keys(item).length === 0)
  //         delete form[key];
  //     }
  //   }
  //   sessionStorage.setItem(storageField, JSON.stringify({ ...form }));
  // };

  const setFormToItemSearch = (form: Record<string, any> = {}) => {
    // 只保存有值的内容，暂不考虑嵌套
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        const item = form[key];
        if (typeof item !== 'object') {
          if (item || item === false || item === 0) {
            if (typeof item === 'string') {
              form[key] = form[key].trim();
            }
          } else {
            delete form[key];
          }
        }
        if (Array.isArray(item) && item.length === 0) delete form[key];
        if (Object.prototype.toString.call(item) === '[object Object]' && Object.keys(item).length === 0)
          delete form[key];
      }
    }
    sessionStorage.setItem(storageField.value, JSON.stringify({ ...form }));
  };

  const getItemToForm = () => {
    return getItem(storageField.value);
  };

  const clearItemToForm = () => {
    sessionStorage.removeItem(storageField.value);
    // emit && emit('search', {});
  };

  // onMounted(() => {
  //   getItemToForm();
  // });

  return {
    // setFormToItem,
    getItemToForm,
    setFormToItemSearch,
    clearItemToForm,
  };
};

export const getItem = (storageField: string) => {
  const data = sessionStorage.getItem(storageField);
  const searchParams = JSON.parse(data ?? '{}');
  // if (data) {
  //   const searchParams = JSON.parse(data ?? '{}');
  //   for (const key in searchParams) {
  //     form[key] = searchParams[key];
  //   }
  // }
  return searchParams;
};

// export const clearSessionStorage = () => {
//   keys.forEach((key) => {
//     sessionStorage.removeItem(key);
//   });
// };
