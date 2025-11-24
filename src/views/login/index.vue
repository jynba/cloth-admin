<template>
  <div class="bg-[#efefef] w-full h-full">
    <div class="flex justify-center items-center w-full h-full">
      <div class="w-[450px] h-[400px] p-10 bg-white rounded-lg">
        <div class="text-30px font-bold mb-10 text-center">
          <p>{{ VITE_GLOB_APP_TITLE }}</p>
        </div>
        <el-form
          ref="loginFormRef"
          class="flex flex-col gap-y-8"
          label-position="top"
          :model="form"
          :rules="rules"
          label-width="60px"
        >
          <el-form-item class="input-item" prop="phone">
            <el-input v-model="form.phone" type="text" autocomplete="off" clearable placeholder="输入账号">
              <template #prefix>
                <i-ep-user />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="input-item" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              clearable
              show-password
              placeholder="输入密码"
              @keyup.enter="submitForm"
            >
              <template #prefix>
                <i-ep-lock />
              </template>
            </el-input>
          </el-form-item>
          <!-- <el-form-item class="input-item">
              <el-input
              type="text"
              clearable
              v-model="form.verifyCode"
              placeholder="输入验证码"
              class="flex-1 mr-2"
              />
              <img @click="getCaptcha" :src="captchaImage" />
          </el-form-item> -->
          <el-form-item class="btn-item">
            <el-button class="h-10 w-full" type="primary" color="#1685f8" :loading="isLoading" @click="submitForm">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAppEnvConfig } from '@/utils/env';
import { success } from '@/hooks/elementPlus/useMessage';
import { useUserStoreWithOut } from '@/store/modules/user';
import { endLoading, isLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { getRoutes, rules } from './model';
import { getTimeState } from '@/utils/dateUtil';
import type { LoginParams } from '@/api/interface';
// import { asyncRoutes } from '@/router/routes';
// import type { AppRouteRecordRaw } from '@/router/types';
// import { filterAsyncRoutes } from '@/store/modules/permission';
// import { getCaptchaApi } from '@/api/app';

const loginFormRef = ref();
const router = useRouter();
const store = useUserStoreWithOut();
// const captchaImage = ref('');
const form = reactive<LoginParams>({ phone: '', password: '' });
const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();

const submitForm = () => {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      startLoading();
      store
        .login(form)
        .then((user) => {
          // if (!user) return;
          success(`${getTimeState()}  欢迎登陆`);
          getRoutes(user, router);
        })
        .finally(() => {
          endLoading();
        });
    }
  });
};

// const getCaptcha = async() => {
//   const {data} = await getCaptchaApi()
//   form.captchaId = data.id;
//   captchaImage.value = data.img;
// };

// getCaptcha();
</script>

<style lang="scss" scoped></style>
