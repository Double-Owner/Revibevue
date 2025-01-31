<template>
  <div class="profile-container">
    <!-- 사이드바 -->
    <aside class="sidebar">
      <div class="profile-image-large">
        <img v-if="user.profileImage" :src="user.profileImage" alt="프로필 이미지" />
        <div v-else class="no-profile">프로필 사진 없음</div>
      </div>
      <h2 class="nickname">{{ user.nickname || "사용자" }}</h2>
      <nav>
        <div class="info">
          <div class="title">쇼핑정보</div>
          <ul>
            <li @click="navigateTo('/orders')">구매내역</li>
            <li @click="navigateTo('/wishlist')">관심상품</li>
          </ul>
        </div>
        <div class="myinfo">
          <div class="title">내정보</div>
          <ul>
            <li @click="navigateTo('/profile')">프로필 정보</li>
            <li @click="navigateTo('/payment')">결제정보</li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- 프로필 본문 -->
    <main class="profile-content">
      <h2 class="section-title">프로필 정보</h2>

      <div v-if="loading" class="loading">로딩 중...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="profile-card">
        <div class="profile-section">
          <h3>내 프로필</h3>
          <div class="profile-info">
            <div class="profile-image-small">
              <img v-if="user.profileImage" :src="user.profileImage" alt="프로필 이미지" />
              <div v-else class="no-profile">이미지 없음</div>
            </div>
            <p><strong>이름:</strong> {{ user.nickname || "사용자" }}</p>
          </div>
        </div>

        <div class="profile-section">
          <h3>계정 정보</h3>
          <p><strong>이메일:</strong> <span class="email">{{ user.email }}</span></p>
          <p><strong>비밀번호:</strong> ********</p>
          <p><strong>휴대폰 번호:</strong> {{ user.phoneNumber || "등록된 번호 없음" }}</p>
        </div>

        <button class="edit-btn" @click="editProfile">변경</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref({
  userId: null,
  nickname: "",
  email: "",
  profileImage: null,
  address: "",
  phoneNumber: "",
  status: "",
});
const loading = ref(false);
const error = ref("");

// ✅ 프로필 가져오기
const fetchProfile = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    console.log("🔍 API 요청 시작: /api/users/profile");

    const response = await fetch("http://localhost:8080/api/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인하세요.");
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    if (!data.data) {
      throw new Error("프로필 데이터를 찾을 수 없습니다.");
    }

    user.value = { ...data.data };
  } catch (err) {
    console.error("API 요청 오류:", err);
    error.value = `프로필 정보를 불러오는 중 오류가 발생했습니다. ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// ✅ 프로필 수정
const editProfile = async () => {
  const newNickname = prompt("새로운 닉네임을 입력하세요:", user.value.nickname);
  if (!newNickname || newNickname.trim() === "") return;

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const response = await fetch("http://localhost:8080/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nickname: newNickname }),
    });

    if (!response.ok) {
      throw new Error("닉네임 변경 실패");
    }

    const result = await response.json();
    user.value.nickname = result.data.nickname;
    alert("프로필이 업데이트되었습니다.");
  } catch (err) {
    alert(`프로필 수정 오류: ${err.message}`);
  }
};

// ✅ 페이지 로드시 API 호출
onMounted(fetchProfile);

// ✅ 페이지 이동
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
/* 전체 레이아웃 */
.profile-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
}

/* 사이드바 */
.sidebar {
  width: 250px;
  background-color: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
  border-right: 2px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #6c757d;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nickname {
  font-size: 1.2rem;
  margin-top: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
}

.sidebar li:hover {
  background-color: #495057;
}

/* 프로필 본문 */
.profile-content {
  flex: 1;
  padding: 30px;
  background-color: white;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.profile-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-section {
  margin-bottom: 20px;
}

.email {
  font-weight: bold;
  color: #007bff;
}

/* 버튼 스타일 */
.edit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}
</style>
