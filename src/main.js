import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // ✅ 라우터 가져오기

const app = createApp(App);

app.use(router); // ✅ Vue 애플리케이션에 라우터 추가
app.mount("#app");
