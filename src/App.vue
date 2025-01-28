<template>
  <nav class="nav">
    <div class="logo">
      <span class="black">Re</span><span class="green">Vibe</span>
    </div>
    <ul class="nav-links">
      <li v-for="(item, index) in navItems" :key="index">
        <router-link :to="item.link">{{ item.text }}</router-link>
      </li>
    </ul>
  </nav>
  <router-view />
</template>

<style scoped>
.nav {
  position: fixed; /* 화면 상단에 고정 */
  top: 0;
  left: 0;
  width: 98%; /* 전체 너비 */
  background-color: white; /* 배경색 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  z-index: 1000; /* 다른 요소보다 위에 표시 */
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.black {
  color: black;
}

.green {
  color: green;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 10px;
}

.nav-links li {
  font-weight: bold;
}

.nav-links a {
  text-decoration: none;
  color: black;
}

.nav-links a:hover {
  color: green;
}

/* 네비게이션 바 고정으로 인해 페이지 컨텐츠가 가려지는 것을 방지 */
body {
  padding-top: 60%;
}
</style>

<script setup>
import { ref } from "vue";

const navItems = ref([
  { text: "홈", link: "/" },
  { text: "로그인", link: "/login" },
  { text: "회원가입", link: "signup" },
]);
</script>