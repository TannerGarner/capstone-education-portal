<script setup>
    import SideNav from '../components/SideNav.vue';
    import RegisteredCourses from '../components/RegisteredCourses.vue';
    import { RouterLink } from 'vue-router';
    import { ref } from 'vue';

</script>

<template>
    
    <div class="container">
        <SideNav/>
        <RegisteredCourses/>
    </div>
</template>

<style scoped>
    .container {
        width: 100%;
        height: 100vh;
        display: flex;
    }
</style>