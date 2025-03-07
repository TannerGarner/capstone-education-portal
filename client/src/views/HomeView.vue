<script setup>
    import SideNav from '../components/SideNav.vue';
    import RegisteredCourses from '../components/RegisteredCourses.vue';
    import Register from '../components/Register.vue';
    import Account from '../components/Account.vue';
    import { useRouter, RouterLink } from 'vue-router';
    import { ref, onMounted } from 'vue';

    const router = useRouter();
    
    onMounted(async () => {
    const isAuthenticated = await userStore.verifyToken();
    if (!isAuthenticated) {
        router.push("/login"); 
    }
});
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