<template>
    <div class="coupon-register">
      <h2>쿠폰 등록</h2>
  
      <div class="input-group">
        <label for="name">쿠폰 이름</label>
        <input v-model="coupon.name" type="text" id="name" class="input-field" />
      </div>
  
      <div class="input-group">
        <label for="price">쿠폰 할인 금액</label>
        <input v-model.number="coupon.price" type="number" id="price" class="input-field" />
      </div>
  
      <div class="input-group">
        <label for="totalQuantity">발급 수량</label>
        <input v-model.number="coupon.totalQuantity" type="number" id="totalQuantity" class="input-field" />
      </div>
  
      <div class="input-group">
        <label for="issuedStart">발급 시작 시간</label>
        <input v-model="coupon.issuedStart" type="datetime-local" id="issuedStart" class="input-field" />
      </div>
  
      <div class="input-group">
        <label for="issuedEnd">발급 종료 시간</label>
        <input v-model="coupon.issuedEnd" type="datetime-local" id="issuedEnd" class="input-field" />
      </div>
  
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  
      <button @click="submitCoupon" class="submit-button">쿠폰 등록</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const coupon = ref({
    name: "",
    price: 0,
    totalQuantity: 0,
    issuedStart: "",
    issuedEnd: "",
  });
  const errorMessage = ref("");
  const successMessage = ref("");
  
  const submitCoupon = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      errorMessage.value = "로그인이 필요합니다.";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(coupon.value),
      });
  
      const result = await response.json();
      if (response.ok) {
        successMessage.value = result.message;
        // 폼 초기화
        coupon.value = {
          name: "",
          price: 0,
          totalQuantity: 0,
          issuedStart: "",
          issuedEnd: "",
        };
      } else {
        errorMessage.value = `쿠폰 등록 실패: ${result.message}`;
      }
    } catch (error) {
      errorMessage.value = "쿠폰 등록 중 오류 발생.";
    }
  };
  </script>
  
  <style scoped>
  .coupon-register {
    max-width: 500px;
    margin: 40px auto;
    padding: 20px;
  }
  .input-group {
    margin-bottom: 15px;
  }
  .input-field {
    width: 100%;
    padding: 10px;
  }
  .submit-button {
    background-color: #007bff;
    color: white;
  }
  .error-message {
    color: red;
  }
  .success-message {
    color: green;
  }
  </style>
  