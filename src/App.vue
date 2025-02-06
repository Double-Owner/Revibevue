<template>
  <NavBar :isLoggedIn="state.isLoggedIn" :isAdmin="state.isAdmin" @logout="logout" />
  <CouponBanner />
  <div class="main-content">
    <StyleGallery v-if="shouldShowGallery" />
    <router-view @loginSuccess="updateLoginStatus" />
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import StyleGallery from "@/components/StyleGallery.vue";
import CouponBanner from "@/components/CouponBanner.vue";

const router = useRouter();
const route = useRoute();
const state = reactive({ isLoggedIn: false, isAdmin: false });

const shouldShowGallery = computed(() => route.path === "/");

// ✅ 로그인 상태 업데이트 함수
const updateLoginStatus = async () => {
  const token = localStorage.getItem("accessToken");
  state.isLoggedIn = !!token;

  // ✅ nextTick()을 사용하여 UI 업데이트 보장
  await nextTick();
  state.isAdmin = localStorage.getItem("role") === "ADMIN";
};

const logout = () => {
  localStorage.clear();
  state.isLoggedIn = false;
  state.isAdmin = false;
  router.push("/");
};

onMounted(updateLoginStatus);
</script>

<style scoped>
.main-content {
  padding: 20px;
}
</style>
