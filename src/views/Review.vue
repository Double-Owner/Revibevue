<template>
    <div class="review-container">
      <h2>상품 리뷰 작성</h2>
      
      <!-- 상품 정보 -->
      <div class="product-info" v-if="product">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
        </div>
      </div>
  
      <!-- 리뷰 작성 -->
      <div class="review-section">
        <h3>리뷰 작성하기</h3>
        <div class="star-rating">
          <span v-for="n in 5" :key="n" @click="setRating(n)">
            {{ n <= rating ? '★' : '☆' }}
          </span>
        </div>
        <textarea v-model="reviewText" placeholder="리뷰를 작성하세요..."></textarea>
      </div>
      
      <!-- 사진 첨부 -->
      <div class="file-upload">
        <h3>사진 첨부</h3>
        <input type="file" @change="handleFileUpload" />
      </div>
      
      <button @click="submitReview">등록</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const product = ref(null);
  const rating = ref(0);
  const reviewText = ref("");
  const selectedFile = ref(null);
  
  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${route.params.id}`);
      const result = await response.json();
      if (response.ok) {
        product.value = result;
      } else {
        console.error("상품 정보 불러오기 실패:", result.message);
      }
    } catch (error) {
      console.error("상품 정보 불러오기 오류:", error);
    }
  };
  
  const setRating = (stars) => {
    rating.value = stars;
  };
  
  const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  const submitReview = async () => {
    if (!reviewText.value.trim()) {
      alert("리뷰 내용을 입력하세요.");
      return;
    }
  
    const formData = new FormData();
    formData.append("productId", route.params.id);
    formData.append("rating", rating.value);
    formData.append("reviewText", reviewText.value);
    if (selectedFile.value) {
      formData.append("image", selectedFile.value);
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("리뷰가 성공적으로 등록되었습니다.");
        reviewText.value = "";
        rating.value = 0;
        selectedFile.value = null;
      } else {
        console.error("리뷰 등록 실패");
      }
    } catch (error) {
      console.error("리뷰 등록 오류:", error);
    }
  };
  
  onMounted(fetchProductDetail);
  </script>
  
  <style scoped>
  .review-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .product-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .product-image {
    width: 100px;
    height: auto;
    margin-right: 20px;
    border-radius: 5px;
  }
  
  .star-rating span {
    font-size: 24px;
    cursor: pointer;
    color: gold;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 10px;
  }
  
  .file-upload input {
    margin-top: 10px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>