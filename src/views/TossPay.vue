<template>
  <div class="toss-pay-container">
    <h2>토스페이 결제</h2>
    <p><strong>상품명:</strong> {{ productName }}</p>
    <p><strong>가격:</strong> {{ productPrice }}원</p>

    <div id="payment-method"></div>
    <div id="agreement"></div>
    <button class="payment-button" id="payment-button">결제하기</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productId = ref(route.query.productId || "상품 ID 없음");
const productName = ref(route.query.productName || "상품 없음");
const productPrice = ref(route.query.productPrice || 0);

console.log("TossPay.vue 로드됨");
console.log("Query Params:", route.query);

const loadTossPayments = () => {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) {
      console.log("TossPayments 이미 로드됨");
      resolve();
      return;
    }
    console.log("TossPayments 스크립트 로드 시작");
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.onload = () => {
      console.log("TossPayments 스크립트 로드 완료");
      resolve();
    };
    script.onerror = (error) => {
      console.error("TossPayments 스크립트 로드 실패", error);
      reject();
    };
    document.head.appendChild(script);
  });
};

const initializeTossPay = async () => {
  try {
    await loadTossPayments();
    if (!window.TossPayments) {
      console.error("TossPayments가 로드되지 않았습니다.");
      return;
    }

    const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
    const tossPayments = TossPayments(clientKey);
    console.log("TossPayments 객체 생성 완료");

    const widgets = tossPayments.widgets({ customerKey: generateRandomString() });

    await widgets.setAmount({
      currency: "KRW",
      value: parseInt(productPrice.value),
    });

    await Promise.all([
      widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
      widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
    ]);

    console.log("위젯 렌더링 완료");

    document.getElementById("payment-button").addEventListener("click", async function () {
      console.log("결제 버튼 클릭됨");

      try {
        await widgets.requestPayment({
          orderId: generateRandomString(),
          orderName: productName.value,
          successUrl: `${window.location.origin}/success?orderId=${generateRandomString()}&orderName=${productName.value}&amount=${productPrice.value}`,
          failUrl: window.location.origin + "/fail.html",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
        });
        console.log("결제 요청 성공");
      } catch (error) {
        console.error("결제 요청 실패:", error);
      }
    });
  } catch (error) {
    console.error("TossPayments 초기화 오류:", error);
  }
};

function generateRandomString() {
  return window.btoa(Math.random()).slice(0, 20);
}

onMounted(initializeTossPay);
</script>
  
  <style scoped>
  .toss-pay-container {
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
  