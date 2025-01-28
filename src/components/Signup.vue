<template>
    <div class="signup-wrapper">
      <div class="signup-container">
        <h2>회원가입</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="form.email" required placeholder="이메일을 입력하세요" />
          </div>
  
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" v-model="form.password" required placeholder="비밀번호를 입력하세요" />
          </div>
  
          <div class="form-group">
            <label for="nickname">닉네임</label>
            <input type="text" id="nickname" v-model="form.nickname" required placeholder="닉네임을 입력하세요" />
          </div>
  
          <div class="form-group">
            <label for="address">주소</label>
            <input type="text" id="address" v-model="form.address" required placeholder="주소를 입력하세요" />
          </div>
  
          <div class="form-group">
            <label for="phoneNumber">핸드폰 번호</label>
            <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required placeholder="핸드폰 번호를 입력하세요" />
          </div>
  
          <div class="form-group">
            <label for="role">권한</label>
            <select id="role" v-model="form.role" required>
              <option value="">권한을 선택하세요</option>
              <option value="USER">일반 사용자</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="profileImage">프로필 이미지</label>
            <input type="file" id="profileImage" @change="handleFileUpload" accept="image/*" />
          </div>
  
          <button type="submit" :disabled="loading">
            {{ loading ? "가입 중..." : "가입하기" }}
          </button>
        </form>
        <p v-if="message" :class="{'success': success, 'error': !success}">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // ✅ Vue Router 사용

const router = useRouter(); // ✅ 라우터 인스턴스 생성

const form = ref({
  email: "",
  password: "",
  nickname: "",
  address: "",
  phoneNumber: "",
  role: "",
  profileImage: null,
});

const message = ref(""); // 성공 또는 실패 메시지
const success = ref(false);
const loading = ref(false);

const handleFileUpload = (event) => {
  form.value.profileImage = event.target.files[0];
};

const submitForm = async () => {
  loading.value = true;
  message.value = "";

  const formData = new FormData();
  formData.append("email", form.value.email);
  formData.append("password", form.value.password);
  formData.append("nickname", form.value.nickname);
  formData.append("address", form.value.address);
  formData.append("phoneNumber", form.value.phoneNumber);
  formData.append("role", form.value.role);
  
  if (form.value.profileImage) {
    formData.append("profileImage", form.value.profileImage);
  }

  try {
    const response = await fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      message.value = result.message || "회원가입이 완료되었습니다!";
      success.value = true;
      
      // ✅ 2초 후 홈(`/`)으로 이동
      setTimeout(() => {
        router.push("/"); // 🚀 홈으로 리다이렉트
      }, 2000);
    } else {
      message.value = result.message || "회원가입에 실패했습니다.";
      success.value = false;
    }
  } catch (error) {
    message.value = "서버와 연결할 수 없습니다.";
    success.value = false;
  } finally {
    loading.value = false;
  }
};
</script>
  
  <style scoped>
  /* ✅ 전체 스타일 */
  .signup-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to right, #e3f2fd, #ffffff);
  }
  
  .signup-container {
    width: 100%;
    max-width: 500px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 1px solid #ddd;
  }
  
  h2 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #2c3e50;
    font-weight: bold;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    text-align: left;
  }
  
  label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
  }
  
  input, select {
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
    width: 100%;
  }
  
  input:focus, select:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  }
  
  button {
    width: 100%;
    padding: 14px;
    background-color: #3498db;
    color: white;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  
  button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  .success {
    color: green;
    margin-top: 10px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  