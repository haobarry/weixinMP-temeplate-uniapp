import { createSSRApp } from "vue";
import App from "./App.vue";
import piniaPersistUniApp from 'pinia-plugin-persist-uni'
import { createPinia } from "pinia";

const pinia = createPinia().use(piniaPersistUniApp)

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia)
  return {
    app,
  };
}
