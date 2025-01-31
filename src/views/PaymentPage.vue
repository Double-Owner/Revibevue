<template>
  <div class="payment-container">
    <h2>결제 페이지</h2>
    <p>상품명: {{ item.name }}</p>
    <p>결제 금액: {{ amount }}원</p>
    
    <button class="payment-button" @click="goToTossPay">결제하기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const item = ref({});
const amount = ref(50000);

const fetchItemDetail = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/items/${route.params.id}`);
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

const goToTossPay = () => {
  router.push(`/tosspay/${route.params.id}`);
};

onMounted(fetchItemDetail);
</script>

<style scoped>
.payment-container {
  max-width: 400px;
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

p {
  font-size: 16px;
  margin: 10px 0;
}

.payment-button {
  margin-top: 20px;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
}

.payment-button:hover {
  background-color: #0056b3;
}
</style>
