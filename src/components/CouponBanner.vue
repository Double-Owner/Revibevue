<template>
    <div class="coupon-banner" @click="openCouponModal">
      <img src="@/assets/banner.png" alt="쿠폰 배너" class="banner-image" />
    </div>
  
    <!-- 발급된 쿠폰 목록 모달 -->
    <div v-if="showCouponModal" class="modal-overlay" @click.self="closeCouponModal">
      <div class="modal-content">
        <h2>🎟️ 발급된 쿠폰 목록</h2>
  
        <div v-if="issuedCoupons.length > 0" class="coupon-list">
          <div class="coupon-card" v-for="coupon in issuedCoupons" :key="coupon.couponId">
            <div class="coupon-info">
              <h3>{{ coupon.name }}</h3>
              <p class="discount">💰 {{ formatPrice(coupon.price) }} 할인</p>
              <p class="quantity">📦 남은 수량: {{ coupon.totalQuantity }}개</p>
              <p class="date">
                🕒 유효 기간:
                <span v-if="coupon.issuedStart && coupon.issuedEnd">
                  {{ formatDate(coupon.issuedStart) }} ~ {{ formatDate(coupon.issuedEnd) }}
                </span>
                <span v-else>없음</span>
              </p>
            </div>
            <!-- 다운로드 버튼 -->
            <button class="download-button" @click="downloadCoupon(coupon)">
              다운로드 📥
            </button>
          </div>
        </div>
  
        <p v-else class="no-coupons">❌ 발급된 쿠폰이 없습니다.</p>
  
        <button class="close-button" @click="closeCouponModal">닫기</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const showCouponModal = ref(false);
  const issuedCoupons = ref([]);
  
  /** ✅ 발급된 쿠폰 목록 불러오기 */
  const fetchIssuedCoupons = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("❌ 로그인이 필요합니다.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/coupons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok && result.data !== null && Array.isArray(result.data)) {
        issuedCoupons.value = result.data.filter((coupon) => coupon.name.trim() !== "");
      } else {
        issuedCoupons.value = [];
      }
    } catch (error) {
      console.error("❌ 발급된 쿠폰 목록 조회 오류:", error);
    }
  };
  
  /** ✅ 쿠폰 다운로드 (API 호출) */
  const downloadCoupon = async (coupon) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("❌ 로그인이 필요합니다.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/issued-coupons/${coupon.couponId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(`✅ 쿠폰 "${result.data.couponName}"이 다운로드되었습니다! 📥`);
        await fetchIssuedCoupons(); // 쿠폰 목록 갱신
      } else {
        alert(`❌ 쿠폰 다운로드 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ 쿠폰 다운로드 오류:", error);
      alert("❌ 쿠폰 다운로드 중 오류가 발생했습니다.");
    }
  };
  
  /** ✅ 모달 열기 (배너 클릭 시 실행) */
  const openCouponModal = async () => {
    await fetchIssuedCoupons();
    showCouponModal.value = true;
  };
  
  /** ✅ 모달 닫기 */
  const closeCouponModal = () => {
    showCouponModal.value = false;
  };
  
  /** ✅ 가격 포맷 변환 */
  const formatPrice = (price) => `${price.toLocaleString()}원`;
  
  /** ✅ 날짜 포맷 변환 */
  const formatDate = (dateString) => {
    if (!dateString) return "기간 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  onMounted(fetchIssuedCoupons);
  </script>
  
  <style scoped>
  /* ✅ 배너 스타일 */
  .coupon-banner {
    width: 100vw;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #6ecaff;
    cursor: pointer;
    overflow: hidden;
  }
  
  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease-in-out;
  }
  
  .banner-image:hover {
    transform: scale(1.02);
  }
  
  /* ✅ 모달 스타일 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  /* ✅ 쿠폰 리스트 스타일 */
  .coupon-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  /* ✅ 쿠폰 카드 스타일 */
  .coupon-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transition: 0.3s;
  }
  
  .coupon-card:hover {
    transform: scale(1.02);
  }
  
  .coupon-info {
    text-align: left;
  }
  
  .coupon-info h3 {
    font-size: 18px;
    font-weight: bold;
  }
  
  .discount {
    font-size: 16px;
    color: #28a745;
    font-weight: bold;
  }
  
  .quantity,
  .date {
    font-size: 14px;
    color: #6c757d;
  }
  
  /* ✅ 다운로드 버튼 */
  .download-button {
    background: #007bff;
    color: white;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .download-button:hover {
    background: #0056b3;
  }
  
  /* ✅ 닫기 버튼 */
  .close-button {
    margin-top: 15px;
    padding: 10px 15px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .close-button:hover {
    background-color: #c82333;
  }
  </style>
  