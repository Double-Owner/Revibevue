<template>
  <div class="chat-container">
    <h2>채팅방</h2>

    <!-- 채팅방 생성 -->
    <div class="chat-room-creation">
      <input v-model="newRoomTitle" placeholder="채팅방 이름 입력" />
      <button @click="createChatRoom">채팅방 생성</button>
    </div>

    <!-- 채팅방 목록 -->
    <ul class="chat-room-list">
      <li v-for="room in chatRooms" :key="room.id" @click="enterChatRoom(room.id, room.title)">
        {{ room.title }}
      </li>
    </ul>

    <!-- 선택한 채팅방 -->
    <div v-if="currentRoomId" class="chat-room">
      <h3>{{ currentRoomTitle }}</h3>

      <!-- 사용자 초대 -->
      <div class="invite-section">
        <input v-model="inviteUserEmail" placeholder="초대할 사용자 이메일" />
        <button @click="inviteUser">초대</button>
      </div>

      <!-- 메시지 목록 -->
      <ul class="chat-messages">
        <li v-for="message in messages" :key="message.id">
          {{ message.message }}
        </li>
      </ul>

      <!-- 메시지 입력 -->
      <input v-model="newMessage" placeholder="메시지를 입력하세요" @keyup.enter="sendMessage" />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Stomp } from "@stomp/stompjs";

const chatRooms = ref([]);
const newRoomTitle = ref("");
const currentRoomId = ref(null);
const currentRoomTitle = ref("");
const messages = ref([]);
const newMessage = ref("");
const inviteUserEmail = ref(""); // 이메일 기반 초대
let stompClient = null;

const fetchChatRooms = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/chats?page=0&size=10`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    chatRooms.value = await response.json();
  } catch (error) {
    console.error("채팅방 목록 불러오기 실패:", error);
  }
};

const createChatRoom = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    await fetch("http://localhost:8080/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      },
      body: new URLSearchParams({ title: newRoomTitle.value }).toString(),
    });

    newRoomTitle.value = "";
    fetchChatRooms(); // 생성 후 목록 갱신
  } catch (error) {
    console.error("채팅방 생성 실패:", error);
  }
};

const enterChatRoom = async (roomId, roomTitle) => {
  currentRoomId.value = roomId;
  currentRoomTitle.value = roomTitle;
  messages.value = [];
  connectWebSocket(roomId);
};

const connectWebSocket = (roomId) => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
  }

  const socket = new WebSocket("ws://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("WebSocket 연결 완료");
    stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
      messages.value.push(JSON.parse(message.body));
    });
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !currentRoomId.value) return;

  stompClient.send(
    `/pub/chat/sendMessage/${currentRoomId.value}`,
    {},
    JSON.stringify({ message: newMessage.value })
  );
  newMessage.value = "";
};

const inviteUser = async () => {
  if (!inviteUserEmail.value.trim()) {
    alert("초대할 사용자의 이메일을 입력하세요.");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/chats/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        roomId: currentRoomId.value, 
        email: inviteUserEmail.value 
      })
    });

    if (response.ok) {
      alert(`사용자 ${inviteUserEmail.value} 초대 완료`);
      inviteUserEmail.value = "";
    } else {
      const errorText = await response.text();
      alert(`초대 실패: ${errorText}`);
    }
  } catch (error) {
    console.error("사용자 초대 실패:", error);
    alert("사용자 초대 중 오류 발생");
  }
};

onMounted(fetchChatRooms);
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.chat-room-creation input,
.invite-section input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chat-room-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.chat-room-list li {
  padding: 10px;
  background: #f4f4f4;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.chat-room-list li:hover {
  background: #ddd;
}

.chat-room {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: #f9f9f9;
}

.chat-messages {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.chat-messages li {
  padding: 8px;
  background: #e1e1e1;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>
