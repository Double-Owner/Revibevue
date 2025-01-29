<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <input v-model="form.email" placeholder="이메일" required />
        </div>
        <div class="form-group">
          <input v-model="form.password" type="password" placeholder="비밀번호" required />
        </div>
        <button type="submit" :disabled="loading">로그인</button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button @click="kakaoLogin" class="kakao-login-btn">카카오 로그인</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  email: "",
  password: "",
});
const loading = ref(false);
const errorMessage = ref("");


const decodeJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    return payload;
  } catch (error) {
    console.error("JWT 디코딩 오류:", error);
    return null;
  }
};


const login = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    const result = await response.json();
    console.log("서버 응답:", result);

    if (!response.ok) {
      errorMessage.value = result.message || "로그인 실패!";
      return;
    }

    if (result.data && result.data.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);

   
      const decoded = decodeJWT(result.data.accessToken);
      console.log("JWT 디코딩 결과:", decoded);

      if (decoded && decoded.role) {
        localStorage.setItem("role", decoded.role); 
      } else {
        console.warn("JWT에 role 정보가 없습니다.");
      }

      alert("로그인 성공!");

      
      if (decoded?.role?.toUpperCase() === "ROLE_ADMIN" || decoded?.role?.toUpperCase() === "ADMIN") {
        router.push("/register"); 
      } else {
        router.push("/"); 
      }
    } else {
      errorMessage.value = "서버 응답에 accessToken이 없습니다.";
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    errorMessage.value = "서버와 연결할 수 없습니다.";
  } finally {
    loading.value = false;
  }
};


const checkTokenExpiration = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
    const exp = payload.exp * 1000; // 만료 시간 (밀리초 변환)

    if (Date.now() >= exp) {
      console.log("JWT 토큰 만료됨, 자동 로그아웃 수행");
      localStorage.clear();
      router.push("/login");
    }
  } catch (error) {
    console.error("JWT 디코딩 오류:", error);
    localStorage.clear();
    router.push("/login");
  }
};


checkTokenExpiration();

// ✅ 카카오 로그인
const kakaoLogin = () => {
  const REST_API_KEY = "YOUR_KAKAO_REST_API_KEY"; 
  const REDIRECT_URI = "http://localhost:8080/api/users/kakao/callback"; 
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  window.location.href = kakaoAuthURL;
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;
}

.login-container {
  width: 320px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.login-container>h2{
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 90%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;

}

button {
  width: 100%;
  padding: 12px;
  background: #32A852;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: gray;
  cursor: not-allowed;
}

.kakao-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background: #fee500;
  color: #3c1e1e;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.kakao-login-btn img {
  width: 20px;
  margin-right: 8px;
}

.kakao-login-btn:hover {
  background: #ffeb3b;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
