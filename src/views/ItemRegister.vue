<template>
    <div v-if="isAdmin" class="main-title">
      <h2 class="title">상품 등록</h2>
      <form @submit.prevent="createItem">
        <label>브랜드 ID: <input v-model="item.brandId" type="number" required /></label>
        <label>카테고리: <input v-model="item.category" type="text" required /></label>
        <label>상품명: <input v-model="item.name" type="text" required /></label>
        <label>설명: <textarea v-model="item.description" required></textarea></label>
        <label>이미지: <input type="file" @change="handleFileChange" required /></label>
        <button type="submit" :disabled="loading" class="btn">상품 등록</button>
      </form>
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  
    <div v-else>
      <h2>접근 불가</h2>
      <p>관리자만 상품을 등록할 수 있습니다.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const isAdmin = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");
  const styles = ref([]);
  
  const item = ref({
    brandId: "",
    category: "",
    name: "",
    description: "",
    image: null,
  });
  
  
  const decodeJWT = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload;
    } catch (error) {
      console.error("JWT 디코딩 오류:", error);
      return null;
    }
  };
  
  
  const checkAdmin = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }
  
    const decoded = decodeJWT(token);
    console.log("JWT 디코딩 결과:", decoded);
  
    if (decoded?.role?.toUpperCase() === "ROLE_ADMIN" || decoded?.role?.toUpperCase() === "ADMIN") {
      isAdmin.value = true;
    } else {
      alert("관리자만 접근 가능합니다.");
      router.push("/");
    }
  };
  
 
  const handleFileChange = (event) => {
    item.value.image = event.target.files[0];
  };
  
 
  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/items");
      const result = await response.json();
  
      if (response.ok) {
        styles.value = result.data.map(item => ({
          title: item.name,
          image: item.image,
        }));
      } else {
        console.error("상품 목록 불러오기 실패:", result.message);
      }
    } catch (error) {
      console.error("상품 목록 불러오기 오류:", error);
    }
  };
  
  // ✅ 상품 등록 함수
  const createItem = async () => {
    errorMessage.value = "";
    successMessage.value = "";
    loading.value = true;
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    const formData = new FormData();
    formData.append("brandId", item.value.brandId);
    formData.append("category", item.value.category);
    formData.append("name", item.value.name);
    formData.append("description", item.value.description);
    formData.append("image", item.value.image);
  
    try {
      const response = await fetch("http://localhost:8080/api/items", {
        method: "POST",
        mode:"cors",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "상품 등록 실패");
      }
  
      successMessage.value = "상품이 등록되었습니다!";
  
      // ✅ 등록 후 최신 상품 목록 가져오기
      await fetchItems(); 
      
      // ✅ 폼 초기화
      item.value = { brandId: "", category: "", name: "", description: "", image: null };
    } catch (error) {
      errorMessage.value = "등록 실패: " + error.message;
    } finally {
      loading.value = false;
    }
  };
  
  // ✅ 페이지 로드 시 관리자 확인 및 상품 목록 가져오기
  onMounted(() => {
    checkAdmin();
    fetchItems();
  });
  </script>
  
  

  
  <style scoped>
  .main-title{
    height: 100vh;
    background: #f8f9fa;
  }
  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
    background-color: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);;
    padding: 24px;
    border-radius: 12px;
  }
  .title{
    text-align: center;
    margin: 24px 0;
    padding-top: 30px;
  }
  
  label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #333;
}
  label>input,
  label>textarea{
    width: 90%;
    margin-top: 5px;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
  }
  label>textarea{
    scrollbar-width: none;
  -ms-overflow-style: none;
  }
  
  button {
    margin-top: 20px;
    padding: 16px;
    cursor: pointer;
    border: none;
    color: #ffffff;
    background-color: #32A852;
    font-weight: 900;
    font-size: 1.3rem;
    border-radius: 8px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .success {
    color: green;
    margin-top: 10px;
  }
  </style>
  