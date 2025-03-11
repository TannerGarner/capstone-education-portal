<script setup>
    import { useRouter, RouterLink } from 'vue-router';
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();
    const router = useRouter();
    defineProps(['changeDisplay', 'components']);

    function logout(){ 
        userStore.logout();
        router.push("/auth");
    }

</script>

<template>
    <div class="sideNav">
        <div class="user">
            <img src="../assets/vue.svg" alt="user-picture" class="userPic">
            <button @click="logout">Logout</button>
            <h3>{{ userStore.user.first_name }} {{ userStore.user.last_name }}</h3>
        </div>
        <nav class="links">
            <button @click="changeDisplay(components.RegisteredCourses)">Registered Courses</button>
            <button @click="changeDisplay(components.Register)">Register</button>
            <button @click="changeDisplay(components.Account)">Account</button>
        </nav>
    </div>
</template>

<style scoped>
    .sideNav {
        background-color: #153131;
        color: #F5F1ED;
        padding: 30px;
    }

    .user {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .links {
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .links button {
        background-color: #F5F1ED;
        color: #153131;
        padding: 15px;
        border-radius: 5px;
        cursor:default;
        transition: background-color 0.3s, color 0.3s;
    }

    button:hover {
        background-color: #489FB5;
        color: #F5F1ED;
    }

</style>