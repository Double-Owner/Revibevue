<template>
  <NavBar />
  <div class="main-content">
    <StyleGallery v-if="showGallery" />
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import NavBar from "@/components/NavBar.vue";
import StyleGallery from "@/components/StyleGallery.vue";

const route = useRoute();

const showGallery = computed(() => !["/login", "/signup"].includes(route.path));
</script>

<style scoped>
.main-content {
  padding: 20px;
}
</style>
