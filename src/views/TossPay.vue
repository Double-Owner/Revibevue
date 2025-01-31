<template>
    <div class="toss-pay-container">
      <h2>토스페이 결제</h2>
      <div id="payment-method"></div>
      <div id="agreement"></div>
      <button class="payment-button" id="payment-button">결제하기</button>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  
  const loadTossPayments = () => {
    return new Promise((resolve, reject) => {
      if (window.TossPayments) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };
  
  const initializeTossPay = async () => {
    await loadTossPayments();
  
    const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
    const customerKey = generateRandomString();
    const tossPayments = TossPayments(clientKey);
  
    const widgets = tossPayments.widgets({ customerKey });
    
    await widgets.setAmount({
      currency: "KRW",
      value: 50000,
    });
  
    await Promise.all([
      widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
      widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
    ]);
  
    document.getElementById("payment-button").addEventListener("click", async function () {
      await widgets.requestPayment({
        orderId: generateRandomString(),
        orderName: "토스 티셔츠 외 2건",
        successUrl: "http://localhost:8080/v1/payments/confirm",
        failUrl: window.location.origin + "/fail.html",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
      });
    });
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
  