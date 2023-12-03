import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Toastify, { toast, type ToastContainerOptions } from "vue3-toastify";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import App from "./App.vue";

import "@/assets/styles/main.css";

library.add(faCirclePlus, faXmark);

const app = createApp(App);
app.use(createPinia());

app.component("font-awesome-icon", FontAwesomeIcon);

// @ts-ignore
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.TOP_CENTER,
} as ToastContainerOptions);

app.mount("#app");
