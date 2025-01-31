<template>
  <section class="style-gallery">
    <h2>Revibe 고객이 찾는 스타일</h2>
    <div class="gallery-container">
      <div v-for="(item, index) in styles" :key="index" class="gallery-item" @click="goToDetail(item.itemId)">
        <img :src="item.image" :alt="item.title" />
        <p>{{ item.title }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const styles = ref([]);

const fetchStyles = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/items?page=0&size=10"); 
    const result = await response.json();

    if (response.ok && result.data) {
      styles.value = result.data.content.map(item => ({ itemId: item.itemId, title: item.name, image: item.image }));
    } else {
      console.error("상품 목록 불러오기 실패:", result.message);
    }
  } catch (error) {
    console.error("상품 목록 불러오기 오류:", error);
  }
};

const goToDetail = (id) => {
  if (!id) {
    console.error("상품 ID가 존재하지 않습니다!");
    return;
  }
  console.log("선택한 상품 ID:", id);
  router.push(`/item/${id}`);
};
 
onMounted(fetchStyles);
</script>

<style scoped>
.style-gallery {
  padding: 40px 10%;
  background-color: #f8f8f8;
}

h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 20px;
  justify-content: center;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
}

.gallery-item p {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
}
</style>