<template>
  <div v-if="item" class="item-detail">
    <h2>{{ item.name }}</h2>
    <img :src="item.image" :alt="item.name" class="item-image" />
    
    <div class="like-container" @click="toggleLike">
      <span :class="{'liked': isLiked}" class="heart">&#10084;</span>
    </div>
    
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
  </div>
  <div v-else class="loading">상품 정보를 불러오는 중...</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const item = ref(null);
const isLiked = ref(false);

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

const toggleLike = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/likes?itemId=${route.params.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (response.ok) {
      isLiked.value = result.message.includes("등록");
      console.log(result.message);
    } else {
      console.error("좋아요 요청 실패:", result.message);
    }
  } catch (error) {
    console.error("좋아요 요청 중 오류 발생:", error);
  }
};

onMounted(() => {
  fetchItemDetail(route.params.id);
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

.like-container {
  text-align: right;
  padding-right: 10px;
  cursor: pointer;
  font-size: 24px;
}

.heart {
  color: gray;
  transition: color 0.3s ease-in-out;
}

.heart.liked {
  color: red;
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

.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}
</style>