<script setup>
    import SideNav from '../components/SideNav.vue';
    import RegisteredCourses from '../components/RegisteredCourses.vue';
    import Register from '../components/Register.vue';
    import Account from '../components/Account.vue';
    import { RouterLink } from 'vue-router';
    import { ref } from 'vue';

</script>

<template>
    
    <div class="container">
        <SideNav/>
        <!-- <RegisteredCourses/> -->
        <!-- <Register/> -->
        <Account/>
    </div>
</template>

<style scoped>
    .container {
        width: 100%;
        height: 100vh;
        display: flex;
    }
</style>