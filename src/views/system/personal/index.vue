<template>
  <el-card shadow="never" class="box-card h-full">
    <template #header>
      <div>
        <span class="mr-3">个人中心</span>
      </div>
    </template>
    <div class="form-box">
      <el-form ref="formRef" label-width="100px" :rules="rulesPassword" :model="state.form">
        <div class="flex flex-col">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="state.form.username" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="联系人" prop="contact">
              <el-input v-model="state.form.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="state.form.phone"></el-input>
            </el-form-item> -->
          <el-form-item label="密码" prop="newPassword">
            <el-input v-model="state.form.newPassword" type="password" clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="state.form.confirmPassword" type="password" clearable></el-input>
          </el-form-item>
          <div class="mt-4 w-full">
            <el-button v-debounce class="w-full" type="primary" size="default" @click="submit">确认修改</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { success, warning } from '@/hooks/elementPlus/useMessage';
import { useUserStoreWithOut } from '@/store/modules/user';
import { rulesPassword } from './model';
import { updateManagerApi } from '@/api/app';

const store = useUserStoreWithOut();
const formRef = ref();
const state = reactive({
  user: {} as any,
  params: {},
  form: {
    newPassword: '',
    confirmPassword: '',
    username: store.user?.username,
    // contact:store.user?.contact,
    // phone:store.user?.phone,
  },
});
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (state.form.newPassword !== state.form.confirmPassword) {
        warning('两次密码不一致');
        return;
      }
      update();
    }
  });
};
const update = async () => {
  const params = { username: state.form.username, password: state.form.newPassword };
  // console.log('params: ', params);
  const data = await updateManagerApi(store.user?.id, params);
  // console.log('data: ', data);
  if (data.id) {
    success('修改成功，需要重新登录');
    setTimeout(() => {
      store.logout();
    }, 2000);
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  :deep(.el-card__header) {
    padding: 15px;
    background: $bg-primary;
  }
  :deep(.el-card__body) {
    height: 100%;
  }
  .form-box {
    height: 100%;
    width: 350px;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
