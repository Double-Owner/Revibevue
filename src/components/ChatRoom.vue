<template>
    <div class="chat-room">
      <h3>채팅방: {{ roomTitle }}</h3>
  
      <ul class="chat-messages">
        <li v-for="message in messages" :key="message.timestamp || Math.random()">
          <strong>{{ message.sender }}:</strong> {{ message.message }}
        </li>
      </ul>
  
      <input v-model="newMessage" placeholder="메시지를 입력하세요" @keyup.enter="sendMessage" />
      <button @click="sendMessage">전송</button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { Stomp } from "@stomp/stompjs";
  
  const route = useRoute();
  const roomId = ref(route.params.roomId);
  const roomTitle = ref(route.query.title);
  const messages = ref([]);
  const newMessage = ref("");
  let stompClient = null;
  
  watch(() => route.params.roomId, (newRoomId) => {
    roomId.value = newRoomId;
    roomTitle.value = route.query.title;
    connectWebSocket(newRoomId);
    fetchMessages(newRoomId);
  });
  
  const connectWebSocket = (roomId) => {
    if (stompClient && stompClient.connected) stompClient.disconnect();
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log("✅ WebSocket 연결됨:", roomId);
      stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
        messages.value.push(JSON.parse(message.body));
      });
    });
  };
  
  const fetchMessages = async (roomId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:8080/chatrooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("메시지 불러오기 실패");
      messages.value = await response.json();
    } catch (error) {
      alert(error.message);
    }
  };
  
  const sendMessage = () => {
    if (!newMessage.value.trim()) return;
  
    const messagePayload = {
      sender: "사용자", // 실제 닉네임 반영 필요
      message: newMessage.value,
    };
  
    if (stompClient && stompClient.connected) {
      stompClient.send(`/pub/chat/sendMessage/${roomId.value}`, {}, JSON.stringify(messagePayload));
      newMessage.value = "";
    } else {
      alert("웹소켓 연결이 끊어졌습니다. 다시 접속하세요.");
    }
  };
  
  onMounted(() => {
    connectWebSocket(roomId.value);
    fetchMessages(roomId.value);
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
  }
  </style>
  