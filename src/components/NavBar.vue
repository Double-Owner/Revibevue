
<template>
  <nav class="nav">
    <div class="logo">
      <span class="black">Re</span><span class="green">Vibe</span>
    </div>
    <ul class="nav-links">
      <li v-for="(item, index) in filteredNavItems" :key="index">
        <router-link :to="item.link">{{ item.text }}</router-link>
      </li>

      <!-- 로그인한 사용자만 마이페이지 버튼 표시 -->
      <li v-if="isLoggedIn">
        <router-link to="/profile">마이페이지</router-link>
      </li>

      <!-- 관리자만 상품 등록 버튼 표시 -->
      <li v-if="isAdmin">
        <router-link to="/register">상품 등록</router-link>
      </li>

      <!-- 로그인한 경우 로그아웃 버튼 -->
      <li v-if="isLoggedIn" @click="handleLogout" class="logout">로그아웃</li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  isLoggedIn: Boolean,
  isAdmin: Boolean,
});
const emit = defineEmits(["logout"]);

const navItems = [
  { text: "홈", link: "/" },
  { text: "로그인", link: "/login", requiresAuth: false },
  { text: "회원가입", link: "/signup", requiresAuth: false },
];

// ✅ 로그인 상태에 따라 네비게이션 항목 필터링
const filteredNavItems = computed(() => {
  return navItems.filter((item) => !(props.isLoggedIn && (item.link === "/login" || item.link === "/signup")));
});

// ✅ 로그아웃 핸들러
const handleLogout = () => {
  emit("logout");
};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 0 20px;
}
.logo {
  padding-left: 1rem;
}
.logo > .black {
  font-size: 2rem;
  font-weight: 900;
  padding-right: 0.2rem;
}
.logo > .green {
  font-size: 2rem;
  font-weight: 900;
  color: green;
}
.nav-links {
  display: flex;
  list-style: none;
  gap: 15px;
  padding-right: 1rem;
}
.logout {
  cursor: pointer;
  color: red;
}
</style>