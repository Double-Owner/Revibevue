import { createRouter, createWebHistory } from "vue-router";
import Signup from "../components/Signup.vue"; // Signup 컴포넌트 import
import Login from "../components/Login.vue";

const routes = [
  { path: "/", component: null }, // App.vue에서 직접 홈 화면 표시
  { path: "/signup", component: Signup }, // 회원가입 페이지 설정
  { path: "/login", component: Login },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
