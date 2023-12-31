import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;
// 统一在入口这里引入product的所有api接口
import API from "@/api";
// 引入全局组件三级联动
import CategorySelect from "@/components/CategorySelect";
Vue.component(CategorySelect.name, CategorySelect);
new Vue({
  el: "#app",
  router,
  store,
  // 创建实例前将api的所有接口放在vue原型上，用$API发请求
  beforeCreate() {
    Vue.prototype.$API = API;
    Vue.prototype.$bus = this;
  },
  render: (h) => h(App),
});
