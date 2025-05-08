<script setup>
    import { useRouter } from 'vue-router';
    import { useUsersStore } from '../stores/users.js';
    import { useCoursesStore } from '../stores/courses.js';
    const userStore = useUsersStore();
    const courseStore = useCoursesStore();
    const router = useRouter();

    const props = defineProps(['changeDisplay', 'components']);

    const isAdmin = userStore.user.is_admin;

    function logout() {
        userStore.logout();
        router.push("/auth");
    }

    function showUserStateForDebugging() {
        console.log("=".repeat(25));
        console.log("userStore.user:", userStore.user);
        console.log("userStore.users:", userStore.users);
        console.log("courseStore.courses:", courseStore.courses);
        console.log("=".repeat(25));
    }
</script>

<template>
    <div class="topBar">
        <div class="logo-container">
            <img src="/logo.png" alt="logo" class="logo">
            <h2>Vision<br>Academy</h2>
        </div>
        <div class="user">
            <img
                src="../assets/vue.svg"
                alt="user-picture"
                class="userPic"
                @dblclick="showUserStateForDebugging()"
            />
            <h3>{{ userStore.user.first_name }} {{ userStore.user.last_name }}</h3>
            <button class="logout" @click="logout">Logout</button>
        </div>
    </div>
</template>

<style scoped>
    .topBar {
        color: #153131;
        min-width: 10%;
        display: flex;
        padding: 10px 100px;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        border-bottom: #489FB5 2px solid;
    }

    .logo-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .logout{
        width: fit-content;
        background-color: #489FB5;
        color: #F5F1ED;
    }

    .logout:hover{
        background-color: #E63946;
        color: #F5F1ED;
    }

    .links {
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    button {
        background-color: #F5F1ED;
        color: #153131;
        width: 160px;
        padding: 15px;
        border-radius: 5px;
        cursor:default;
        transition: background-color 0.3s, color 0.3s;
    }

    button:hover {
        background-color: #489FB5;
        color: #F5F1ED;
    }

    .active {
        background-color:  #489FB5;
        color: #F5F1ED;
        font-weight: bold;
    }

</style>