<template>
    <div class="chat-container">
      <h2>채팅방</h2>
  
      <div class="chat-room-creation">
        <input v-model="newRoomTitle" placeholder="채팅방 이름 입력" />
        <button @click="createChatRoom">채팅방 생성</button>
      </div>
  
      <ul class="chat-room-list">
        <li v-for="room in chatRooms" :key="room.id" @click="enterChatRoom(room)">
          <strong>#{{ room.id }}</strong> {{ room.title }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  const chatRooms = ref([]);
  const newRoomTitle = ref("");
  const router = useRouter();
  
  const fetchChatRooms = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/chats?page=0&size=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("채팅방 목록을 불러올 수 없습니다.");
      chatRooms.value = await response.json();
    } catch (error) {
      alert(`오류 발생: ${error.message}`);
    }
  };
  
  const createChatRoom = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/chats?title=${encodeURIComponent(newRoomTitle.value)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("채팅방 생성 실패");
      const newRoom = await response.json();
      chatRooms.value.push({ id: newRoom.id, title: newRoom.title });
      newRoomTitle.value = "";
    } catch (error) {
      alert(error.message);
    }
  };
  
  const enterChatRoom = (room) => {
    if (!room.id) {
      alert("올바른 채팅방이 아닙니다.");
      return;
    }
    console.log("✅ 채팅방 이동:", room.id, room.title);
    router.push({ path: `/chat/${room.id}`, query: { title: room.title } });
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
  }
  </style>
  