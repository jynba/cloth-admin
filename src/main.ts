import { createApp } from 'vue';
import App from './App.vue';
import 'normalize.css/normalize.css';
import 'nprogress/nprogress.css';
import 'virtual:windi.css';
// 字体样式
// import "@/assets/fonts/font.scss";
import '@/styles/theme/index.scss';
import '@/styles/global.scss';
// Register icon sprite
import 'virtual:svg-icons-register';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/theme-chalk/el-message-box.css'; // fix 样式丢失问题

import { setupStore } from '@/store';
import { setupErrorHandle } from '@/setting/errorHandleSetting';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { registerGlobalComponent } from '@/components';
import { initAppConfigStore } from '@/setting/initAppSetting';
import { setupDerective } from '@/derective';

async function bootstrap() {
  const app = createApp(App);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  // config store
  setupStore(app);

  // init app config
  initAppConfigStore();

  // configure routing
  setupRouter(app);

  setupRouterGuard(router);

  // register global components
  registerGlobalComponent(app);

  // register error handle
  setupErrorHandle(app);

  setupDerective(app);

  // https://next.router.vuejs.org/api/#isready
  await router.isReady();

  app.mount('#app');
}

void bootstrap();
