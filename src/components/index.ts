import type { App } from 'vue';
import { SearchBar } from './SearchBar';
// 全局组件
const modules = import.meta.glob('./global/**/*.vue', { eager: true });

export function registerGlobalComponent(app: App) {
  Object.keys(modules).forEach((key) => {
    const component = modules[key].default;
    app.component(component.name, component);
  });
  app.component('GlobalSearch', SearchBar);
}
