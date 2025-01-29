<template>
    <nav class="nav">
      <div class="logo">
        <span class="black">Re</span><span class="green">Vibe</span>
      </div>
      <ul class="nav-links">
        <li v-for="(item, index) in filteredNavItems" :key="index">
          <router-link :to="item.link">{{ item.text }}</router-link>
        </li>
        
        <li v-if="isAdmin">
          <router-link to="/register">상품 등록</router-link>
        </li>
  
        <li v-if="isLoggedIn" @click="logout" class="logout">로그아웃</li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const isLoggedIn = ref(false);
  const isAdmin = ref(false);
  
  const navItems = ref([
    { text: "홈", link: "/" },
    { text: "로그인", link: "/login", requiresAuth: false },
    { text: "회원가입", link: "/signup", requiresAuth: false },
  ]);
  
  const filteredNavItems = computed(() => {
    return navItems.value.filter((item) => {
      return isLoggedIn.value ? !item.requiresAuth : true;
    });
  });
  
  const checkLoginStatus = () => {
    const token = localStorage.getItem("accessToken");
    isLoggedIn.value = !!token;
  
    const role = localStorage.getItem("role");
    isAdmin.value = role === "ROLE_ADMIN";
  };
  
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    isLoggedIn.value = false;
    isAdmin.value = false;
    router.push("/");
  };
  
  onMounted(checkLoginStatus);
  </script>
  
  <style scoped>
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 0 20px;
  }
  .logo{
    padding-left: 1rem; 
  }
  .logo>.black{
    font-size: 2rem;
    font-weight: 900;
    padding-right: 0.2rem;
  }
  .logo>.green{
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
  