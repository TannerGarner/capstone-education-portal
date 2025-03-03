<script setup>
  import { ref } from "vue";
  import SignUp from "../components/SignUp.vue";
  import LogIn from "../components/LogIn.vue";

  const showSignUp = ref(true);

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