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

    <button @click="goToPayment" class="payment-button">결제하기</button>
    <button @click="goBack" class="back-button">뒤로 가기</button>
  </div>
  <div v-else class="loading">상품 정보를 불러오는 중...</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const item = ref(null);

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

onMounted(() => {
  fetchItemDetail(route.params.id);
});

const goBack = () => {
  router.push("/");
};

const goToBid = (type) => {
  router.push(`/bid/${type}/${route.params.id}`);
};

const goToPayment = () => {
  router.push({
    path: "/pay",
    query: {
      productId: item.value.id,
      productName: item.value.name,
      productPrice: item.value.price
    }
  });
};
</script>

<style scoped>
/* 기존 스타일 유지 */
</style>
  
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
  }
  
  .bid-button, .payment-button {
    margin: 10px;
    padding: 12px 20px;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    border-radius: 8px;
    transition: 0.3s ease-in-out;
  }
  
  .buy-button {
    background-color: #007bff;
    color: white;
  }
  
  .buy-button:hover {
    background-color: #0056b3;
  }
  
  .sell-button {
    background-color: #dc3545;
    color: white;
  }
  
  .sell-button:hover {
    background-color: #b22234;
  }
  
  .payment-button {
    background-color: #28a745;
    color: white;
  }
  
  .payment-button:hover {
    background-color: #218838;
  }
  
  .back-button {
    margin-top: 20px;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    color: #ffffff;
    background-color: #32A852;
    font-size: 1rem;
    border-radius: 8px;
    transition: 0.3s ease-in-out;
  }
  
  .back-button:hover {
    background-color: #278a41;
  }
  
  .loading {
    text-align: center;
    font-size: 18px;
    margin-top: 50px;
  }
  </style>
  