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
        <div class="menu-section">
          <h3>쇼핑정보</h3>
          <ul>
            <li @click="navigateTo('/orders')">📦 구매내역</li>
            <li @click="navigateTo('/likes')">❤️ 좋아요 목록</li>
          </ul>
        </div>
        <div class="menu-section">
          <h3>내정보</h3>
          <ul>
            <li @click="navigateTo('/profile')">👤 프로필 정보</li>
            <li @click="navigateTo('/payment')">💳 결제정보</li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- 프로필 본문 -->
    <main class="profile-content">
      <h2 class="section-title">👤 내 프로필</h2>

      <div v-if="loading" class="loading">⏳ 로딩 중...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="profile-card">
        <div class="profile-header">
          <div class="profile-image-small">
            <img v-if="user.profileImage" :src="user.profileImage" alt="프로필 이미지" />
            <div v-else class="no-profile">이미지 없음</div>
          </div>
          <div class="profile-info">
            <p><strong>이름:</strong> {{ user.nickname || "사용자" }}</p>
            <p><strong>이메일:</strong> <span class="email">{{ user.email }}</span></p>
          </div>
        </div>

        <div class="profile-section">
          <h3>📞 연락처</h3>
          <p><strong>휴대폰 번호:</strong> {{ user.phoneNumber || "등록된 번호 없음" }}</p>
        </div>

        <button class="edit-btn" @click="editProfile">✏️ 프로필 수정</button>
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

const likes = ref([]);
const likesLoading = ref(false);
const likesError = ref("");

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
    const response = await fetch("http://localhost:8080/api/users/profile", {
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
    user.value = { ...data.data };
  } catch (err) {
    error.value = `프로필 정보를 불러오는 중 오류 발생: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// ✅ 좋아요 목록 가져오기
const fetchLikes = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  likesLoading.value = true;
  likesError.value = "";

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
    likesError.value = `좋아요 목록을 불러오는 중 오류 발생: ${err.message}`;
  } finally {
    likesLoading.value = false;
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
onMounted(() => {
  fetchProfile();
  fetchLikes();
});

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
  background: linear-gradient(135deg, #ece9e6, #ffffff);
}

/* 사이드바 */
.sidebar {
  width: 280px;
  background-color: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
  border-right: 2px solid #ddd;
}

.profile-image-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #6c757d;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nickname {
  font-size: 1.4rem;
  margin-top: 10px;
  font-weight: bold;
}

.menu-section h3 {
  font-size: 1.1rem;
  margin: 15px 0 10px;
}

.menu-section ul {
  list-style: none;
  padding: 0;
}

.menu-section li {
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s;
}

.menu-section li:hover {
  background-color: #495057;
}

/* 프로필 본문 */
.profile-content {
  flex: 1;
  padding: 30px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.profile-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
}
</style>
