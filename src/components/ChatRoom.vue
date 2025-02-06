<template>
  <div class="chat-room">
    <h3 class="room-title">채팅방: {{ roomTitle }}</h3>

    <div class="invite-user">
      <input v-model="inviteEmail" placeholder="초대할 사용자 이메일" />
      <button @click="inviteUser">초대</button>
    </div>

    <div class="chat-messages" ref="chatMessages">
      <ul>
        <li 
          v-for="message in messages" 
          :key="message.id" 
          class="message-container"
          :class="{ 'sent-message': isCurrentUser(message.sender), 'received-message': !isCurrentUser(message.sender) }"
        >
          <div class="message-content">
            <div class="sender">{{ message.sender || "알 수 없음" }}</div>
            <div class="message-text">{{ message.message }}</div>
            <div class="timestamp">{{ formatTimestamp(message.createdAt) }}</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="message-input-container">
      <input v-model="newMessage" placeholder="메시지를 입력하세요" @keyup.enter="sendMessage" />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { Stomp } from "@stomp/stompjs";

const route = useRoute();
const roomId = ref(route.params.roomId);
const roomTitle = ref(route.query.title);
const messages = ref([]);
const newMessage = ref("");
const inviteEmail = ref("");
const userEmail = ref(""); // ✅ JWT에서 추출한 사용자 이메일 저장
let stompClient = null;
const chatMessages = ref(null);

// ✅ JWT 디코딩 함수 (Base64 디코딩)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1]; // JWT의 두 번째 부분 (Payload)
    return JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 변환
  } catch (error) {
    console.error("❌ 토큰 디코딩 실패:", error);
    return null;
  }
};

// ✅ JWT 토큰에서 사용자 이메일 추출
const fetchUserEmailFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const userInfo = decodeToken(token);
    if (userInfo?.sub) {  // ✅ JWT `subject` 값(email) 추출
      userEmail.value = userInfo.sub.trim().toLowerCase();
      localStorage.setItem("userEmail", userEmail.value);
      console.log("👤 현재 사용자 (email):", userEmail.value);
    }
  }
};

// ✅ 현재 사용자가 보낸 메시지인지 확인하는 함수
const isCurrentUser = (sender) => {
  if (!sender || !userEmail.value) return false;
  return sender.trim().toLowerCase() === userEmail.value;
};

// ✅ WebSocket 연결 설정
const connectWebSocket = (roomId) => {
  if (stompClient && stompClient.connected) {
    console.log("✅ 기존 WebSocket 연결 유지됨");
    return;
  }

  console.log("🔗 WebSocket 연결 중...");
  const socket = new WebSocket("ws://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("✅ WebSocket 연결 성공");

    // ✅ WebSocket 연결 시 email 다시 확인
    fetchUserEmailFromToken();

    stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
      try {
        const newMessageData = JSON.parse(message.body);

        // ✅ sender가 null이거나 잘못된 값이면 기본값 설정
        if (!newMessageData.sender || newMessageData.sender.trim() === "") {
          newMessageData.sender = "알 수 없음";
        }

        messages.value.push({
          id: newMessageData.id || Math.random(),
          sender: newMessageData.sender.trim(),
          message: newMessageData.message || "내용 없음",
          createdAt: newMessageData.createdAt || new Date().toISOString(),
        });
        scrollToBottom();
      } catch (error) {
        console.error("❌ 메시지 JSON 변환 실패", error);
      }
    });
  }, (error) => {
    console.error("❌ WebSocket 연결 실패, 5초 후 재시도", error);
    setTimeout(() => connectWebSocket(roomId), 5000);
  });
};

// ✅ 메시지 전송 기능 (WebSocket으로 전송)
const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  // ✅ sender를 JWT에서 추출한 email로 설정
  const messagePayload = {
    sender: userEmail.value,
    message: newMessage.value,
    createdAt: new Date().toISOString(),
  };

  console.log("📤 메시지 전송됨:", messagePayload);

  if (stompClient && stompClient.connected) {
    stompClient.send(`/pub/chat/sendMessage/${roomId.value}`, {}, JSON.stringify(messagePayload));
  } else {
    alert("웹소켓 연결이 끊어졌습니다. 다시 접속하세요.");
  }

  newMessage.value = "";
};

// ✅ 채팅창 자동 스크롤
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
};

// ✅ 날짜 포맷 변환
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "시간 없음";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

// ✅ 컴포넌트 마운트 시 WebSocket 연결 및 사용자 정보 설정
onMounted(() => {
  fetchUserEmailFromToken();
  connectWebSocket(roomId.value);
});

// ✅ 컴포넌트 해제 시 WebSocket 연결 종료
onUnmounted(() => {
  if (stompClient) stompClient.disconnect();
});
</script>

<style scoped>
.chat-room {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  list-style: none;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.message-container {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}

.sent-message {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
  padding: 10px;
  border-radius: 10px;
  max-width: 50%;
  text-align: right;
  margin-left: auto;
}

.received-message {
  background-color: #f1f1f1;
  align-self: flex-start;
  padding: 10px;
  border-radius: 10px;
  max-width: 50%;
  text-align: left;
  margin-right: auto;
}

.message-input-container {
  display: flex;
  width: 100%;
  margin-top: 10px;
}

.message-input-container input {
  flex-grow: 1;
  padding: 10px;
}

.message-input-container button {
  margin-left: 10px;
}
</style>
