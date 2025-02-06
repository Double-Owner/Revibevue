import { createRouter, createWebHistory } from "vue-router";
import Signup from "../components/Signup.vue";
import Login from "../components/Login.vue";
import ProfileView from "../views/ProfileView.vue";
import ItemRegister from "../views/ItemRegister.vue";
import ItemDetail from "../views/ItemDetail.vue";
import { getUserRoleFromToken } from "../utils/auth"; // JWT에서 role 가져오는 함수
import PaymentPage from "../views/PaymentPage.vue"; 
import ReviewPage from "../views/Review.vue";
import TossPay from "../views/TossPay.vue";
import TossSuccess from "@/views/TossSuccess.vue";
import ChatPage from '../views/ChatPage.vue';
import SellBid from "@/views/SellBid.vue";
import BuyBid from "@/views/BuyBid.vue";
import CouponRegister from "@/views/CouponRegister.vue";
import LikeListView from "@/views/LikeListView.vue";



const routes = [
  { path: "/", component: null }, // App.vue에서 직접 홈 화면 표시
  { path: "/signup", component: Signup },
  { path: "/login", component: Login },
  { 
    path: "/profile", 
    component: ProfileView,
    meta: { requiresAuth: true }, // ✅ 로그인한 사용자만 접근 가능
  },
  { path: "/sell-bid/:id", component: SellBid },
  { path: "/payment/:id", component: PaymentPage, props: true },
  { path: "/item/:id", component: ItemDetail, props: true },
  { path: "/review/:id", component: ReviewPage },
  { path: "/pay", component: TossPay }, // 결제 페이지
  { path: "/success", component: TossSuccess }, // 결제 성공 페이지
  { path: "/chat", component: ChatPage },
  { path: "/chat/:roomId?", component: ChatPage, props: true },
  { path: "/likes", component: LikeListView },
  { 
    path: "/register", 
    component: ItemRegister,
    meta: { requiresAdmin: true }, // ✅ 관리자만 접근 가능
  },
  { path: "/chat", component: ChatPage }, 
  { path: "/buy-bid/:id", component: BuyBid, props: true },
  {
    path: "/coupon-register", // ✅ 쿠폰 등록 페이지 추가
    component: CouponRegister,
    meta: { requiresAdmin: true }, // ✅ 관리자만 접근 가능
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 라우터 가드 (로그인 및 관리자 권한 체크)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");
  const role = getUserRoleFromToken(); // ✅ role 가져오기

  // ✅ 관리자 페이지 접근 제한
  if (to.meta.requiresAdmin) {
    if (!token) {
      alert("로그인이 필요합니다.");
      return next("/login");
    }
    if (role !== "ADMIN") {
      alert("관리자만 접근 가능합니다.");
      return next("/");
    }
  }

  next(); // ✅ 모든 조건 통과 시 페이지 이동
});

export default router;
