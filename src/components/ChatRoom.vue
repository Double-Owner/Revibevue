<template>
  <div class="chat-room">
    <h3 class="room-title">채팅방: {{ roomTitle }}</h3>

    <div class="invite-user">
      <input v-model="inviteEmail" placeholder="초대할 사용자 이메일" />
      <button @click="inviteUser">초대</button>
    </div>

    <div class="chat-messages">
      <ul ref="chatMessages">
        <li v-for="message in messages" :key="message.id" class="message-container">
          <div class="message" :class="{ 'sent-message': message.sender === username, 'received-message': message.sender !== username }">
            <div class="sender">{{ message.sender }}:</div>
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
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { Stomp } from "@stomp/stompjs";

const route = useRoute();
const roomId = ref(route.params.roomId);
const roomTitle = ref(route.query.title);
const messages = ref([]);
const newMessage = ref("");
const inviteEmail = ref("");
const username = ref(localStorage.getItem("username") || "사용자");
let stompClient = null;
const chatMessages = ref(null);

watch(() => route.params.roomId, (newRoomId) => {
  roomId.value = newRoomId;
  roomTitle.value = route.query.title;
  connectWebSocket(newRoomId);
  fetchMessages(newRoomId);
});

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
    stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
      try {
        const newMessageData = JSON.parse(message.body);
        messages.value.push({
          id: newMessageData.id || Math.random(),
          sender: newMessageData.sender || "알 수 없음",
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

// 사용자 초대 함수
const inviteUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (!inviteEmail.value.trim()) {
    alert("이메일을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/chats/invites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId: roomId.value,
        email: inviteEmail.value,
      }),
    });

    if (!response.ok) throw new Error("초대 실패");

    alert("초대 완료!");
    inviteEmail.value = "";  // 이메일 입력 필드 초기화
  } catch (error) {
    alert(error.message);
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const messagePayload = {
    sender: username.value,
    message: newMessage.value,
    createdAt: new Date().toISOString(),
  };
  console.log("📤 메시지 전송됨:", messagePayload);

  if (stompClient && stompClient.connected) {
    stompClient.send(`/pub/chat/sendMessage/${roomId.value}`, {}, JSON.stringify(messagePayload));
    messages.value.push({ ...messagePayload, id: Math.random() });
    newMessage.value = "";
    scrollToBottom();
  } else {
    alert("웹소켓 연결이 끊어졌습니다. 다시 접속하세요.");
  }
};

const fetchMessages = (roomId) => {
  console.log("📥 기존 메시지 불러오기:", roomId);
  messages.value = []; // 🔥 기존 메시지 중복 방지
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "시간 없음";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

onMounted(() => {
  connectWebSocket(roomId.value);
  fetchMessages(roomId.value);
});

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
  max-width: 70%;
  text-align: right;
  margin-left: auto;
}

.received-message {
  background-color: #f1f1f1;
  align-self: flex-start;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  text-align: left;
  margin-right: auto;
}
</style>
