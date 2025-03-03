<script setup>
    import SideNav from '../components/SideNav.vue';
    import { RouterLink } from 'vue-router';
    import { ref } from 'vue';

</script>

<template>
    
    <div class="container">
        <SideNav/>
        <div class="dev">
            <h1>Welcome to My Vue App</h1>
            <p>This is the Home Page!</p>
            <nav>
                <RouterLink to="/auth">Sign Up</RouterLink>
            </nav>
        </div>
    </div>
</template>

<style scoped>
    .container {
        width: 100%;
        height: 100vh;
        display: flex;
    }
</style>