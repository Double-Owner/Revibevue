<template>
    <div class="success-container">
      <h2>결제가 완료되었습니다!</h2>
      <p>주문번호: {{ orderId }}</p>
      <p>주문상품: {{ orderName }}</p>
      <p>결제금액: {{ amount }}원</p>
  
      <router-link to="/" class="home-button">홈으로 이동</router-link>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const orderId = ref("");
  const orderName = ref("");
  const amount = ref(0);
  
  onMounted(() => {
    orderId.value = route.query.orderId || "정보 없음";
    orderName.value = route.query.orderName || "정보 없음";
    amount.value = route.query.amount || 0;
  });
  </script>
  
  <style scoped>
  .success-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    background: #fff;
    text-align: center;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #28a745;
    font-size: 24px;
  }
  
  p {
    font-size: 18px;
    margin: 10px 0;
  }
  
  .home-button {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    color: white;
    background: #007bff;
    text-decoration: none;
    border-radius: 8px;
  }
  
  .home-button:hover {
    background: #0056b3;
  }
  </style>