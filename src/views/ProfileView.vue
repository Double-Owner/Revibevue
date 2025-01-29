<template>
    <div class="profile-container">
      <!-- 사이드바 -->
      <aside class="sidebar">
        <div class="profile-image-large"></div>
        <h2>사용자</h2>
        <nav>
            <div class="info">
                <div class="title">쇼핑정보</div>
                <ul>
                    <li>구매내역</li>
                    <li>관심상품</li>
                </ul>
            </div>
            <div class="myinfo">
                <div class="title">내정보</div>
                <ul>
                  <li>프로필 정보</li>
                  <li>결제정보</li>
                </ul>
            </div>
        </nav>
      </aside>
  
      <!-- 프로필 본문 -->
      <main class="profile-content">
        <h2>프로필정보</h2>
  
        <!-- 이메일 및 연락처 정보 -->
        <div class="info-card">
          <p><strong>이메일</strong> <span class="email">{{ user.email }}</span></p>
          <p><strong>비밀번호</strong> ******</p>
          <p><strong>휴대폰 번호</strong> {{ user.phone }}</p>
        </div>
  
        <button class="edit-btn" @click="editProfile">변경</button>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const user = ref({
    name: "사용자",
    email: "Abcb@gmail.com",
    phone: "010-1234-5678",
  });
  
  // ✅ 프로필 수정 기능
  const editProfile = () => {
    const newName = prompt("새로운 이름을 입력하세요:", user.value.name);
    if (newName) {
      user.value.name = newName;
      alert("프로필이 업데이트되었습니다.");
    }
  };
  
  onMounted(() => {
    // ✅ 추후 서버에서 사용자 정보 가져오는 로직 추가 가능
  });
  </script>
  
  <style scoped>
  /* 전체 컨테이너 */
  .profile-container {
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: #fff;
  }
  
  /* 사이드바 */
  .sidebar {
    width: 250px;
    background-color: #f4f4f4;
    padding: 20px;
    text-align: center;
    border-right: 2px solid #ddd;
  }
  
  .profile-image-large {
    width: 200px;
    height: 200px;
    background-color: #ccc;
    border-radius: 50%;
    margin: 0 auto 10px;
  }
  .info, .myinfo{
    padding: 3px 0;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .title {
    font-size: 1.3rem;
    font-weight: 800;
    padding: 12px 0;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  ul li {
    padding: 8px 0;
    font-size: 1rem;
  }
  
  /* 프로필 내용 */
  .profile-content {
    flex: 1;
    padding: 30px;
  }
  
  .info-card {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .profile-image-small {
    width: 50px;
    height: 50px;
    background-color: #ccc;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .info-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-card p {
    margin: 5px 0;
  }
  
  .email {
    font-weight: bold;
    color: gray;
  }
  
  .edit-btn {
    display: block;
    font-weight: 600;
    padding: 10px 24px;
    border: none;
    background-color: black;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    position: absolute;
    right: 58px;
  }
  </style>
  