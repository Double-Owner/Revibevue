<template>
  <div v-if="isAdmin" class="main-container">
    <h2 class="title">상품 등록</h2>
    <form @submit.prevent="createItem">
      <label>브랜드 이름: <input v-model="item.brandName" type="text" required /></label>
      <label>카테고리: <input v-model="item.category" type="text" required /></label>
      <label>상품명: <input v-model="item.name" type="text" required /></label>
      <label>설명: <textarea v-model="item.description" required></textarea></label>
      <label>이미지: <input type="file" @change="handleFileChange" required /></label>
      <button type="submit" :disabled="loading" class="btn">상품 등록</button>
    </form>
    
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>

  <div v-else class="unauthorized">
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

const item = ref({
  brandName: "",
  category: "",
  name: "",
  description: "",
  image: null,
});

const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("JWT 디코딩 오류:", error);
    return null;
  }
};

const checkAdmin = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return;
  }
  const decoded = decodeJWT(token);
  if (decoded?.role?.toUpperCase() === "ROLE_ADMIN" || decoded?.role?.toUpperCase() === "ADMIN") {
    isAdmin.value = true;
  } else {
    alert("관리자만 접근 가능합니다.");
    router.push("/");
  }
};

const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    item.value.image = event.target.files[0];
  }
};

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
  formData.append("brandName", item.value.brandName);
  formData.append("category", item.value.category);
  formData.append("name", item.value.name);
  formData.append("description", item.value.description);
  formData.append("image", item.value.image);

  try {
    const response = await fetch("http://localhost:8080/api/items", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: formData,
      headers: { 
        "Authorization": `Bearer ${token}`  
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "상품 등록 실패");
    }

    successMessage.value = "상품이 등록되었습니다!";
    item.value = { brandName: "", category: "", name: "", description: "", image: null };
  } catch (error) {
    errorMessage.value = "등록 실패: " + error.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkAdmin();
});
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  background-color: #fff;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: 0.3s;
}

textarea {
  resize: none;
  height: 100px;
}

button {
  margin-top: 20px;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

.unauthorized {
  text-align: center;
  padding: 50px;
}
</style>
