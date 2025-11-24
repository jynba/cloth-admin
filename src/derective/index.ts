import type { App } from 'vue';

/**
 * @description 注册modules中的自定义指令，以文件夹名字做指令名称
 * @param app
 */
const modules = import.meta.glob('./**/*.ts', { eager: true }) as Record<string, any>;

export function setupDerective(app: App) {
  Object.keys(modules).forEach((key) => {
    const derectiveStr = key.match(/(\w*).ts/);
    let directive;
    derectiveStr && (directive = derectiveStr[1]);
    app.directive(directive, modules[key].default);
  });
}
