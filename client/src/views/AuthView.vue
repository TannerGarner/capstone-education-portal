<script setup>
  import SignUp from "../components/SignUp.vue";
  import LogIn from "../components/LogIn.vue";
  import { ref, onMounted } from 'vue';
  import { useUsersStore } from '../stores/users.js';
  import { useRouter } from 'vue-router';
  const userStore = useUsersStore();
  const router = useRouter();
  const showSignUp = ref(true);

  onMounted(async () => {
    if (userStore.user?.user_id) {
      const isAuthenticated = await userStore.fetchUser(userStore.user.user_id);
      if (isAuthenticated) {
        router.push("/");
      }
    }
  });

  const toggleAuthView = () => {
    showSignUp.value = !showSignUp.value;
  };
</script>

<template>
  <div class="container">

    <SignUp v-if="showSignUp" @toggle="toggleAuthView"></SignUp>
    <LogIn v-else @toggle="toggleAuthView" ></LogIn>
    
  </div>
</template>

<styles>

</styles>