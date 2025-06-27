<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import { useEnrollmentStore } from '../stores/enrollment.js';
    const usersStore = useUsersStore();
    const router = useRouter();

    const dropdownOpen = ref(false);

    function logout() {
        usersStore.logout();
        router.push("/auth");
    }

    function showUserStateForDebugging() {
        console.log("=".repeat(25));
        console.log("usersStore.user:", usersStore.user);
        console.log("usersStore.users:", usersStore.users);
        console.log("courseStore.courses:", courseStore.courses);
        console.log("=".repeat(25));
    }

    function getLastInitial(name){
        return usersStore.user.last_name.slice(0, 1) + ".";
    }

    function dropdownEnter(el) {
        el.style.height = '0';
        el.style.opacity = '0';
        requestAnimationFrame(() => {
            el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
            el.style.height = el.scrollHeight + 'px';
            el.style.opacity = '1';
        });
    }

    function dropdownLeave(el) {
        el.style.height = el.scrollHeight + 'px';
        el.style.opacity = '1';
        requestAnimationFrame(() => {
            el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
            el.style.height = '0';
            el.style.opacity = '0';
        });
    }
</script>

<template>
    <div class="topBar">
        <div class="logo-container">
            <img src="/logo.png" alt="logo" class="logo">
            <h2>Vision<br>Academy</h2>
        </div>
        <img @click="dropdownOpen = !dropdownOpen" @dblclick="showUserStateForDebugging()"src="/logo.png" alt="profile-picture" class="profilePicture" />
        <transition name="dropdown" @enter="dropdownEnter" @leave="dropdownLeave">
            <div v-if="dropdownOpen" class="user">
                <h3>{{ usersStore.user.first_name }} {{ getLastInitial(usersStore.user.last_name) }}</h3>
                <p class="logout" @click="logout">
                    <span class="material-symbols-outlined icon">
                        logout
                    </span> 
                    Logout
                </p>
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
        justify-content: space-evenly;
        position: absolute;
        top: 100px;
        right: 50px;
        align-items: flex-start;
        background-color: #F5F1ED;
        border: #489FB5 2px solid;
        border-radius: 15px;
        gap: 20px;
        padding: 20px;
        box-shadow: 0px 0px 10px rgba(21, 49, 49, 20%);
        overflow: hidden;
        z-index: 1000;;
    }

    .dropdown-enter-active,
    .dropdown-leave-active {
        transition: height 0.3s ease, opacity 0.3s ease;
        overflow: hidden;
    }

    .dropdown-enter-from,
    .dropdown-leave-to {
        height: 0;
        opacity: 0;
    }

    .dropdown-enter-to,
    .dropdown-leave-from {
        height: auto;
        opacity: 1;
    }

    .logout{
        width: 100%;
        color: #E63946;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
    }

    .logout:hover{
        cursor: pointer;
    }

    .icon {
        color: #E63946;
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

    @media screen and (max-width: 768px) {
        .topBar {
            padding: 10px 20px;
        }

        .user {
            position: absolute;
            top: 75px;
            right: 20px;
        }
    }
</style>