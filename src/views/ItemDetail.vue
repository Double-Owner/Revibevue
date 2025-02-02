<template>
  <div v-if="item" class="item-detail">
    <h2>{{ item.name }}</h2>
    <img :src="item.image" :alt="item.name" class="item-image" />
    <p><strong>브랜드:</strong> {{ item.brandName }}</p>
    <p><strong>카테고리:</strong> {{ item.category }}</p>
    <p><strong>설명:</strong> {{ item.description }}</p>
    <p><strong>등록 관리자:</strong> {{ item.adminName }}</p>

    <div class="button-container">
      <button @click="goToBid('buy')" class="bid-button buy-button">구매 입찰</button>
      <button @click="goToBid('sell')" class="bid-button sell-button">판매 입찰</button>
    </div>

    <div class="button-container">
      <button @click="goToPayment" class="bid-button payment-button">결제하기</button>
      <button @click="goBack" class="bid-button back-button">뒤로 가기</button>
    </div>

    <!-- ADMIN 전용 옵션 등록 기능 -->
    <div v-if="isAdmin" class="admin-section">
      <h3>상품 옵션 등록</h3>
      <div class="option-container">
        <select v-model="selectedSize" class="size-select">
          <option disabled value="">사이즈 선택</option>
          <option v-for="size in sizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <button @click="registerOption" class="bid-button option-button">옵션 등록</button>
      </div>
    </div>

    <p v-if="optionMessage" class="option-message">{{ optionMessage }}</p>
  </div>
  <div v-else class="loading">상품 정보를 불러오는 중...</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const item = ref(null);
const isAdmin = ref(false); // ADMIN 여부 확인
const selectedSize = ref(""); // 선택된 사이즈
const optionMessage = ref(""); // 옵션 등록 메시지

const sizeOptions = [
  "220", "225", "230", "235", "240", "245", "250", "255", "260", "265",
  "270", "275", "285", "290", "295", "300", "305", "310", "315", "320",
  "325"
];

// 로컬 스토리지에서 role 확인
const checkAdminStatus = () => {
  const userRole = localStorage.getItem("role");
  isAdmin.value = userRole === "ADMIN"; // ADMIN이면 true
};

// 상품 정보 가져오기
const fetchItemDetail = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/items/${id}`);
    const result = await response.json();
    if (response.ok) {
      item.value = result.data;
    } else {
      console.error("상품 정보 불러오기 실패:", result.message);
    }
  } catch (error) {
    console.error("상품 정보 불러오기 오류:", error);
  }
};

// 옵션 등록 요청
const registerOption = async () => {
  if (!selectedSize.value) {
    optionMessage.value = "사이즈를 선택해주세요.";
    return;
  }

  const token = localStorage.getItem("accessToken");

  if (!token) {
    optionMessage.value = "로그인이 필요합니다.";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/items/${route.params.id}/options`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ size: selectedSize.value }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      optionMessage.value = "옵션이 성공적으로 등록되었습니다.";
    } else {
      optionMessage.value = `옵션 등록 실패: ${result.message}`;
    }
  } catch (error) {
    optionMessage.value = "옵션 등록 중 오류 발생.";
  }
};

onMounted(() => {
  fetchItemDetail(route.params.id);
  checkAdminStatus();
});

const goBack = () => {
  router.push("/");
};

const goToBid = (type) => {
  if (type === "buy") {
    router.push(`/buy-bid/${route.params.id}`);
  } else if (type === "sell") {
    router.push(`/sell-bid/${route.params.id}`);
  }
};

const goToPayment = () => {
  router.push({
    path: "/pay",
    query: {
      productId: item.value.id,
      productName: item.value.name,
      productPrice: item.value.price,
    },
  });
};
</script>

<style scoped>
.item-detail {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.item-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin: 10px 0;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.bid-button {
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  width: 160px;
  height: 50px;
  text-align: center;
  display: inline-block;
}

.buy-button {
  background-color: #007bff;
  color: white;
}

.sell-button {
  background-color: #dc3545;
  color: white;
}

.payment-button {
  background-color: #28a745;
  color: white;
}

.back-button {
  background-color: #6c757d;
  color: white;
}

.option-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.size-select {
  padding: 10px;
  border-radius: 5px;
  font-size: 1rem;
}

.option-button {
  background-color: #ff9800;
  color: white;
  width: 160px;
  height: 50px;
}

.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}
</style>
