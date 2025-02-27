<script setup>
import { ref, onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'

const data = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('/api');
    const result = await response.json();
    data.value = result.message;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld v-if="data" :msg="data"/>
  <HelloWorld v-else msg="Loading..." />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
