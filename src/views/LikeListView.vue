<template>
    <div class="like-list-container">
      <h2>좋아요 목록</h2>
  
      <div v-if="loading" class="loading">로딩 중...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <ul v-if="likes.length">
          <li v-for="like in likes" :key="like.itemId">
            상품 ID: {{ like.itemId }}
          </li>
        </ul>
        <p v-else class="empty">좋아요한 상품이 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const likes = ref([]);
  const loading = ref(false);
  const error = ref("");
  
  // ✅ 좋아요 목록 가져오기
  const fetchLikes = async () => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    loading.value = true;
    error.value = "";
  
    try {
      const response = await fetch("http://localhost:8080/api/likes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
  
      const data = await response.json();
      likes.value = data.data || [];
    } catch (err) {
      error.value = `좋아요 목록을 불러오는 중 오류 발생: ${err.message}`;
    } finally {
      loading.value = false;
    }
  };
  
  // ✅ 페이지 로드시 API 호출
  onMounted(fetchLikes);
  </script>
  