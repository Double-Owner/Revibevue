<template>
    <div class="sell-bid-container">
      <h2>판매 입찰</h2>
  
      <div class="input-group">
        <label for="optionId">옵션 ID 입력</label>
        <input v-model.number="optionId" type="number" class="input-field" placeholder="옵션 ID 입력" />
      </div>
  
      <div class="input-group">
        <label for="price">판매 가격 (원)</label>
        <input v-model.number="price" type="number" class="input-field" placeholder="판매 가격 입력" />
      </div>
  
      <div class="input-group">
        <label for="amount">판매 수량</label>
        <input v-model.number="amount" type="number" class="input-field" placeholder="판매 수량 입력" />
      </div>
  
      <div class="input-group">
        <label for="endedAt">입찰 유지 기간 (일)</label>
        <input v-model.number="endedAt" type="number" class="input-field" placeholder="입찰 유지 기간 입력" />
      </div>
  
      <button @click="submitSellBid" class="submit-button">판매 입찰</button>
  
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  const route = useRoute();
const router = useRouter();
const optionId = ref(null); // 사용자가 입력할 옵션 ID
const price = ref(null);
const amount = ref(null);
const endedAt = ref(null);
const message = ref(""); // 성공/실패 메시지
  
  // 판매 입찰 요청
  const submitSellBid = async () => {
  if (!optionId.value || !price.value || !amount.value || endedAt.value === null) {
    message.value = "모든 값을 입력해야 합니다.";
    return;
  }
  
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      message.value = "로그인이 필요합니다.";
      return;
    }
  
    const requestBody = {
    optionId: optionId.value, // ✅ 옵션 ID 숫자로 변환
    price: price.value,
    amount: amount.value,
    endedAt: endedAt.value, // 0도 가능
  };
  
    try {
      const response = await fetch("http://localhost:8080/api/sell-bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
      if (response.ok) {
        message.value = "판매 입찰이 완료되었습니다.";
        setTimeout(() => router.push("/"), 2000);
      } else {
        message.value = `판매 입찰 실패: ${result.message}`;
      }
    } catch (error) {
      message.value = "판매 입찰 중 오류 발생.";
    }
  };
  
  </script>
  
  <style scoped>
  .sell-bid-container {
    max-width: 500px;
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
  
  .input-group {
    margin: 15px 0;
    text-align: left;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .submit-button {
    margin-top: 20px;
    padding: 12px 20px;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    transition: 0.3s ease-in-out;
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  
  .message {
    margin-top: 10px;
    font-size: 14px;
    color: green;
  }
  </style>
  