<template>
    <div class="buy-bid">
      <h2>구매 입찰</h2>
      <p><strong>상품:</strong> {{ item.name }}</p>
  
      <div class="input-group">
        <label for="optionId">옵션 ID 입력</label>
        <input v-model.number="optionId" type="number" class="input-field" placeholder="옵션 ID 입력" />
      </div>
  
      <div class="price-container">
        <label for="price">입찰 가격:</label>
        <input type="number" id="price" v-model="price" min="20000" class="input-field" />
      </div>
  
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  
      <button @click="submitBid" class="submit-button">구매 입찰 등록</button>
      <button @click="goBack" class="back-button">뒤로 가기</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  const route = useRoute();
  const router = useRouter();
  const item = ref({});
  const optionId = ref(null);
  const price = ref(20000);
  const errorMessage = ref("");
  const successMessage = ref("");
  
  // 상품 정보 불러오기
  const fetchItemDetails = async () => {
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
  
  // 구매 입찰 등록 요청
  const submitBid = async () => {
    if (!optionId.value) {
      errorMessage.value = "옵션 ID를 입력해주세요.";
      return;
    }
    if (price.value < 20000) {
      errorMessage.value = "입찰 가격은 20000원 이상이어야 합니다.";
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      errorMessage.value = "로그인이 필요합니다.";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/buy-bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          optionId: optionId.value,
          price: price.value,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        successMessage.value = result.message;
      } else {
        errorMessage.value = `입찰 실패: ${result.message}`;
      }
    } catch (error) {
      errorMessage.value = "입찰 요청 중 오류 발생.";
    }
  };
  
  const goBack = () => {
    router.go(-1);
  };
  
  onMounted(() => {
    fetchItemDetails();
  });
  </script>
  
  <style scoped>
  .buy-bid {
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
  
  .input-group,
  .price-container {
    margin: 15px 0;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .submit-button,
  .back-button {
    margin-top: 20px;
    padding: 12px;
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  
  .submit-button {
    background-color: #007bff;
    color: white;
  }
  
  .back-button {
    background-color: #6c757d;
    color: white;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  
  .success-message {
    color: green;
    margin-top: 10px;
  }
  </style>
  