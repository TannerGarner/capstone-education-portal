<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import { useEnrollmentStore } from '../stores/enrollment.js';
    const userStore = useUsersStore();
    const router = useRouter();
    const enrollmentStore = useEnrollmentStore();

    const dropdownOpen = ref(false);

    const isAdmin = userStore.user.is_admin;

    function logout() {
        userStore.logout();
        router.push("/auth");
    }

    function showUserStateForDebugging() {
        console.log("=".repeat(25));
        console.log("userStore.user:", userStore.user);
        console.log("enrollmentStore.enrolledInList:", enrollmentStore.enrolledInList);
        console.log("enrollmentStore.notEnrolledInList:", enrollmentStore.notEnrolledInList);
        console.log("-".repeat(25));
        console.log("enrollmentStore.coursesForUser:", enrollmentStore.coursesForUser);
        console.log("enrollmentStore.coursesNotForUser:", enrollmentStore.coursesNotForUser);
        console.log("=".repeat(25));
    }
</script>

<template>
    <div class="topBar">
        <div class="logo-container">
            <img src="/logo.png" alt="logo" class="logo">
            <h2>Vision<br>Academy</h2>
        </div>
        <img @click="dropdownOpen = !dropdownOpen" @dblclick="showUserStateForDebugging()"src="/logo.png" alt="profile-picture" class="profilePicture" />
        <transition name="slide">
            <div v-if="dropdownOpen" class="user">
                <h3>{{ userStore.user.first_name }} {{ userStore.user.last_name }}</h3>
                <button class="logout" @click="logout">Logout</button>
            </div>
        </transition>
        
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

    .profilePicture {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.3s;
    }

    .user {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100px;
        right: 45px;
        align-items: center;
        background-color: #F5F1ED;
        border: #489FB5 2px solid;
        border-radius: 15px;
        gap: 20px;
        padding: 30px;
        box-shadow: 0px 0px 10px rgba(21, 49, 49, 20%);
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