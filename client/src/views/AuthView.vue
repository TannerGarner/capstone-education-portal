<script setup>
  import SignUp from "../components/SignUp.vue";
  import LogIn from "../components/LogIn.vue";
  import { ref, onMounted } from 'vue';
  import { useUsersStore } from '../stores/users.js';
  import { useRouter } from 'vue-router';
  import bgImage from '/signup-login-background-blue.jpg';
  const userStore = useUsersStore();
  const router = useRouter();
  const showSignUp = ref(true);

  onMounted(async () => {
      const isAuthenticated = await userStore.verifyToken();
      if (isAuthenticated) {
          router.push("/");
      }
    });

  const toggleAuthView = () => {
    showSignUp.value = !showSignUp.value;
  };
</script>

<template>
  <div class="view">
    <div class="auth">
      <SignUp v-if="showSignUp" @toggle="toggleAuthView"></SignUp>
      <LogIn v-else @toggle="toggleAuthView" ></LogIn>
    </div>
    <img :src="bgImage" alt="background" class="background" />  </div>
</template>

<style scoped>
  .view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 2;
  }
  .auth{
    position: absolute;
    top: 0;
    left: 0;
    width: 75%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .background {
    position: absolute;
    top: 0;
    right: 0;
    width: 25%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  @media screen and (max-width: 1000px) {
    .background {
      display: none;
    }
    .auth {
      width: 100%;
      overflow-y: scroll;
    }
    
  }
</style>