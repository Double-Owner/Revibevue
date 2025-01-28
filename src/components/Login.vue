<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <input type="email" v-model="form.email" required placeholder="이메일" />
        </div>

        <div class="form-group">
          <input type="password" v-model="form.password" required placeholder="비밀번호" />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "로그인 중..." : "로그인" }}
        </button>
      </form>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button class="kakao-login-btn" @click="kakaoLogin">
        <img src="@/assets/kakao_logo.png" alt="Kakao Logo" />
        카카오 로그인
      </button>
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

// ✅ 일반 로그인 함수
const login = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    const result = await response.json(); // JSON 변환
    console.log("서버 응답:", result); // ✅ 응답 구조 확인

    if (result.data && result.data.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      router.push("/");
      
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

// ✅ 카카오 로그인 처리 함수
const kakaoLogin = () => {
  const REST_API_KEY = "YOUR_KAKAO_REST_API_KEY"; // 🔥 카카오 REST API 키 입력
  const REDIRECT_URI = "http://localhost:8080/api/users/kakao/callback"; // 🔥 백엔드에서 설정한 리다이렉트 URI
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  window.location.href = kakaoAuthURL;
};
</script>

<style scoped>
/* ✅ 전체 레이아웃 */
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

/* ✅ 입력 필드 */
.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
}

/* ✅ 일반 로그인 버튼 */
button {
  width: 100%;
  padding: 12px;
  background: #007bff;
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

/* ✅ 카카오 로그인 버튼 */
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

/* ✅ 오류 메시지 스타일 */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
