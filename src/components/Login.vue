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
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({ email: "", password: "" });
const loading = ref(false);
const errorMessage = ref("");
const emit = defineEmits(["loginSuccess"]);

// JWT 디코딩 함수
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
    if (!response.ok || !result.data?.accessToken) {
      errorMessage.value = result.message || "로그인 실패!";
      return;
    }

    // 토큰 저장
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);

    // ✅ role 저장 방법 개선 (디코딩 시도)
    let userRole = result.data.role;
    if (!userRole) {
      const decodedToken = decodeJWT(result.data.accessToken);
      userRole = decodedToken?.role || "ROLE_USER";
    }
    localStorage.setItem("role", userRole);

    // ✅ 로그인 상태 즉시 반영
    await nextTick();
    emit("loginSuccess");

    // 메인 페이지로 이동
    router.push("/");
  } catch (error) {
    errorMessage.value = "서버와 연결할 수 없습니다.";
  } finally {
    loading.value = false;
  }
};

// ✅ 카카오 로그인
const kakaoLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  if (!REST_API_KEY) {
    console.error("카카오 REST API 키가 설정되지 않았습니다.");
    return;
  }
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

.login-container > h2 {
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background: #32a852;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

button:hover {
  background: #279046;
}

button:disabled {
  background: gray;
  cursor: not-allowed;
}

.kakao-login-btn {
  width: 100%;
  padding: 12px;
  background: #fee500;
  color: #3c1e1e;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
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
