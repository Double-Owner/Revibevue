<template>
  <div class="chat-container">
    <h2>채팅</h2>
    <ChatList @enterRoom="selectRoom" />
    <ChatRoom v-if="currentRoomId" :roomId="currentRoomId" :roomTitle="currentRoomTitle" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatList from "@/components/ChatList.vue";
import ChatRoom from "@/components/ChatRoom.vue";

const route = useRoute();
const router = useRouter();
const currentRoomId = ref(route.params.roomId || null);
const currentRoomTitle = ref(route.query.title || "");

const selectRoom = (room) => {
  console.log("✅ 채팅방 선택됨:", room.id, room.title);
  router.push({ path: `/chat/${room.id}`, query: { title: room.title } });
};

watch(() => route.params.roomId, (newRoomId) => {
  console.log("🔄 채팅방 변경됨:", newRoomId);
  currentRoomId.value = newRoomId;
  currentRoomTitle.value = route.query.title;
});

onMounted(() => {
  console.log("✅ ChatPage Mounted - Room ID:", currentRoomId.value, "Room Title:", currentRoomTitle.value);
});
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
